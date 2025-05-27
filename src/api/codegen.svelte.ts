import { getManimAnimationByName } from "./manim/animations";
import { getPossibleProperties } from "./manim/shared";
import { type ProjectAnimation, animationEndTime, getProjectAnimations, getProjectObjects } from "./project.svelte";

export function generateCode(): string {
	console.log("codegen");
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

	const objectLines = getProjectObjects()
		.map(object => {
			if (!("objectType" in object)) return;
			let possibleProperties = getPossibleProperties(object.objectType);
			let properties = Object.entries(object.properties)
				.filter(([propertyName, propertyValue]) => {
					let defaultValue = possibleProperties.find(possible => possible.name === propertyName)!.defaultValue;
					return propertyValue !== defaultValue;
				})
				.map(([propertyName, propertyValue]) => `${possibleProperties.find(possible => possible.name === propertyName)!.internalName} = ${propertyValue}`)
				.join(", ");
			console.log("properties", properties);
			return `\t\tvar_${object.id} = ${object.objectType}(${properties})`;
		})
		.join("\n");
	const animationLines = animationsWithWaits
		.map(animation => {
			if ("wait" in animation) return `\t\tself.wait(${animation.wait})`;
			let manimAnimation = getManimAnimationByName(animation.name)!;
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
