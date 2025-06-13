import { getManimAnimationByName } from "./manim/animations";
import { objects, type ManimObject } from "./manim/objects";
import { getPossibleProperties } from "./manim/properties";
import { propertyValueToString } from "./manim/property";
import { animationEndTime, getProjectAnimations, topologicalProjectObjects, type ProjectAnimation } from "./project.svelte";

export function generateCode(): string {
	let animations = getProjectAnimations().toSorted((first, other) => first.startTime - other.startTime);
	let animationsWithWaits: (ProjectAnimation | { wait: number })[] = [];
	animations.forEach((animation, index) => {
		animationsWithWaits.push(animation);
		if (index != animations.length - 1) {
			let waitTime = animations[index + 1].startTime - animationEndTime(animation);
			if (waitTime > 0) animationsWithWaits.push({ wait: waitTime });
		}
	});
	if (animationsWithWaits.length && (animationsWithWaits[0] as ProjectAnimation).startTime > 0) {
		animationsWithWaits.unshift({ wait: (animationsWithWaits[0] as ProjectAnimation).startTime });
	}

	const objectLines = topologicalProjectObjects()
		.map(object => {
			if (!("objectType" in object)) return;
			let possibleProperties = getPossibleProperties(object);

			let objectBase = objects.find(manimObject => manimObject.name === object.objectType)!;
			if ("create" in objectBase) {
				return `\t\tvar_${object.id} = ${objectBase.create(object.properties)}`;
			}

			// Positional Arguments
			let positionalArguments = Object.entries(object.properties)
				.filter(([propertyName, _propertyValue]) => {
					let position = possibleProperties.find(possible => possible.name === propertyName)!.position;
					return position !== undefined;
				})
				.toSorted(([nameA, _valueA], [nameB, _valueB]) => {
					let positionA = possibleProperties.find(possible => possible.name === nameA)!.position!;
					let positionB = possibleProperties.find(possible => possible.name === nameB)!.position!;
					return positionA - positionB;
				})
				.map(([propertyName, propertyValue]) => {
					let propertyBase = possibleProperties.find(possible => possible.name === propertyName)!;
					return `${propertyValueToString(propertyBase.type, propertyValue)}, `;
				})
				.join("");

			// Keyword Arguments
			let keywordArguments = Object.entries(object.properties)
				.filter(([propertyName, propertyValue]) => {
					let propertyBase = possibleProperties.find(possible => possible.name === propertyName)!;
					let defaultValue = "defaultValue" in propertyBase.type ? propertyBase.type.defaultValue : null;
					return propertyBase.position === undefined && propertyBase.function === undefined && propertyValue !== defaultValue;
				})
				.map(([propertyName, propertyValue]) => {
					let propertyBase = possibleProperties.find(possible => possible.name === propertyName)!;
					return `${propertyBase.internalName} = ${propertyValueToString(propertyBase.type, propertyValue)}`;
				})
				.join(", ");

			// Functions
			let functions = Object.entries(object.properties)
				.filter(([propertyName, _propertyValue]) => {
					let propertyBase = possibleProperties.find(possible => possible.name === propertyName)!;
					return propertyBase.function !== undefined;
				})
				.map(([propertyName, propertyValue]) => {
					let propertyBase = possibleProperties.find(possible => possible.name === propertyName)!;
					return `.${propertyBase.function}(${propertyValueToString(propertyBase.type, propertyValue)})`;
				})
				.join("");

			let manimObject: ManimObject = objects.find(manimObject => manimObject.name === object.objectType)!;

			return `\t\tvar_${object.id} = ${manimObject.internalName ?? manimObject.name}(${positionalArguments}${keywordArguments})${functions}`;
		})
		.join("\n");

	const animationLines = animationsWithWaits
		.map(animation => {
			if ("wait" in animation) return `\t\tself.wait(${animation.wait})`;
			let manimAnimation = getManimAnimationByName(animation.animationType)!;
			return `\t\tself.play(${manimAnimation.internalName ?? manimAnimation.name}(${animation.objects.map(id => `var_${id}`).join(",")}, run_time=${animation.duration}))`;
		})
		.join("\n");

	return `from manim import *

class Main(Scene):
	def construct(self):
${objectLines}

${animationLines}
`;
}
