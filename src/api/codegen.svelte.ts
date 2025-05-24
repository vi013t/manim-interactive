import { getProjectAnimations, getProjectObjects } from "./project.svelte";

export function generateCode(): string {
	const objectLines = getProjectObjects().map(object => ("objectType" in object ? `\t\tvar_${object.id} = ${object.objectType}()` : ""));
	const animationLines = getProjectAnimations().map(animation => `\t\tself.play(${animation.name}(${animation.objects.map(id => `var_${id}`).join(",")}))`);

	return `from manim import *

class Main(Scene):
	def construct(self):
${objectLines}
${animationLines}
`;
}
