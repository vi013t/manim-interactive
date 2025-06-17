import { getManimAnimationByName } from "./manim/animations";
import { objects, type ManimObject } from "./manim/objects";
import { getPossibleProperties, getProperty, propertyValueToString, type FunctionProperty, type KeywordProperty, type PositionalProperty, type Property } from "./manim/property";
import { animationEndTime, getProjectAnimations, getProjectMarkers, topologicalProjectObjects, type ProjectAnimation } from "./project.svelte";

export function generateCode(): string {
	let animations = getProjectAnimations().toSorted((first, other) => getProperty(first, "Start Time")! - getProperty(other, "Start Time")!);
	let animationsWithWaits: (ProjectAnimation | { wait: number })[] = [];
	animations.forEach((animation, index) => {
		animationsWithWaits.push(animation);
		if (index != animations.length - 1) {
			let waitTime = getProperty(animations[index + 1], "Start Time")! - animationEndTime(animation);
			if (waitTime > 0) animationsWithWaits.push({ wait: waitTime });
		}
	});
	if (animationsWithWaits.length && getProperty(animationsWithWaits[0] as ProjectAnimation, "Start Time")! > 0) {
		animationsWithWaits.unshift({ wait: getProperty(animationsWithWaits[0] as ProjectAnimation, "Start Time")! });
	}

	// Ending Wait
	if (animations.length > 0) {
		let lastAnimation = animations[animations.length - 1];
		let endingWait = getProjectMarkers().find(marker => marker.name === "End")!.time - animationEndTime(lastAnimation);
		if (endingWait !== 0) {
			animationsWithWaits.push({ wait: endingWait });
		}
	}

	const objectLines = topologicalProjectObjects()
		.map(object => {
			const possibleProperties = getPossibleProperties(object);
			const objectBase: ManimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type")!)!;

			// Custom Codegen
			if (objectBase.create) {
				return `\t\tobject_${object.id} = ${objectBase.create(object.properties)}`;
			}

			// Constructor Name
			const constructor = objectBase.getConstructorName?.(object.properties) ?? objectBase.internalName ?? objectBase.name;

			// Properties
			const properties = Object.entries(object.properties)
				.filter(([propertyName, _propertyValue]) => !["Object Type", "Name"].includes(propertyName))
				.map(([propertyName, propertyValue]): [unknown, Property] => [propertyValue, possibleProperties.find(possible => possible.name === propertyName)! as Property]);

			// Positional Arguments
			const positionalArguments = properties
				.filter<[unknown, PositionalProperty]>((propertyData): propertyData is [unknown, PositionalProperty] => "position" in propertyData[1])
				.toSorted(([_valueA, baseA], [_valueB, baseB]) => baseA.position - baseB.position)
				.map(([propertyValue, propertyBase]) => propertyValueToString(propertyBase.type, propertyValue))
				.join(",");

			// Keyword Arguments
			const keywordArguments = properties
				.filter<[unknown, KeywordProperty]>((propertyData): propertyData is [unknown, KeywordProperty] => "internalName" in propertyData[1])
				.map(([propertyValue, propertyBase]) => `${propertyBase.internalName} = ${propertyValueToString(propertyBase.type, propertyValue)}`)
				.join(", ");

			// Separating comma
			const comma = positionalArguments && keywordArguments ? ", " : "";

			// Functions
			const functions = properties
				.filter<[unknown, FunctionProperty]>((propertyData): propertyData is [unknown, FunctionProperty] => "function" in propertyData[1])
				.map(([propertyValue, propertyBase]) => `.${propertyBase.function}(${propertyValueToString(propertyBase.type, propertyValue)})`)
				.join("");

			return `\t\tobject_${object.id} = ${constructor}(${positionalArguments}${comma}${keywordArguments})${functions}`;
		})
		.join("\n");

	const animationLines = animationsWithWaits
		.map(animation => {
			if ("wait" in animation) return `\t\tself.wait(${animation.wait})`;

			let manimAnimation = getManimAnimationByName(getProperty(animation, "Animation Type")!)!;

			const possibleProperties = getPossibleProperties(animation);

			// Properties
			const properties = Object.entries(animation.properties)
				.filter(([propertyName, _propertyValue]) => !["Animation Type", "Name"].includes(propertyName))
				.map(([propertyName, propertyValue]): [unknown, Property] => [propertyValue, possibleProperties.find(possible => possible.name === propertyName)! as Property]);

			// Positional Arguments
			const positionalArguments = properties
				.filter<[unknown, PositionalProperty]>((propertyData): propertyData is [unknown, PositionalProperty] => "position" in propertyData[1])
				.toSorted(([_valueA, baseA], [_valueB, baseB]) => baseA.position - baseB.position)
				.map(([propertyValue, propertyBase]) => propertyValueToString(propertyBase.type, propertyValue))
				.join(",");

			// Keyword Arguments
			const keywordArguments = properties
				.filter<[unknown, KeywordProperty]>((propertyData): propertyData is [unknown, KeywordProperty] => "internalName" in propertyData[1])
				.map(([propertyValue, propertyBase]) => `${propertyBase.internalName} = ${propertyValueToString(propertyBase.type, propertyValue)}`)
				.join(", ");

			// Separating comma
			const comma = positionalArguments && keywordArguments ? ", " : "";

			// Return Out
			return `\t\tself.play(${manimAnimation.internalName ?? manimAnimation.name}(${positionalArguments}${comma}${keywordArguments}))`;
		})
		.join("\n");

	return `from manim import *

class Main(Scene):
	def construct(self):
${objectLines}

${animationLines}
`;
}
