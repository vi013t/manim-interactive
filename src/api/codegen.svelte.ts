import { getManimAnimationByName } from "./manim/animations";
import { type ProjectAnimation, animationEndTime, getProjectAnimations, getProjectObjects } from "./project.svelte";

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
	console.log(animations);
	console.log(animationsWithWaits);

	const objectLines = getProjectObjects()
		.map(object => ("objectType" in object ? `\t\tvar_${object.id} = ${object.objectType}()` : ""))
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
