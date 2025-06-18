import { invoke } from "@tauri-apps/api/core";
import { getManimAnimationByName } from "./manim/animations";
import { objects, type ManimObject } from "./manim/objects";
import { getPossibleProperties, getProperty, propertyValueToString, type FunctionProperty, type KeywordProperty, type PositionalProperty, type Property } from "./manim/property";
import { getProjectAnimations, getProjectLocation, topologicalProjectObjects, type ProjectObject } from "./project.svelte";

export function codegenObject(object: Omit<ProjectObject, "previewData"> & { previewData?: string }): string {
	const possibleProperties = getPossibleProperties(object);
	const objectBase: ManimObject = objects.find(manimObject => manimObject.name === object.properties["Object Type"]!)!;

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

	return `${constructor}(${positionalArguments}${comma}${keywordArguments})${functions}`;
}

let isPreviewLoaded = $state(true);

export async function generateObjectPreview(object: Omit<ProjectObject, "previewData"> & { previewData?: string }): Promise<ProjectObject> {
	isPreviewLoaded = false;
	const imageData = await invoke<string>("generate_object_preview", {
		path: await getProjectLocation(),
		id: object.id,
		code: `from manim import *\n\nclass Main(Scene):\n\tdef construct(self):\n\t\tself.add(${codegenObject(object)})`,
	});
	object.previewData = imageData;
	isPreviewLoaded = true;
	return object as ProjectObject;
}

export function previewLoaded() {
	return isPreviewLoaded;
}

export function generateCode(): string {
	let animations = getProjectAnimations().toSorted((first, other) => getProperty(first, "Start Time")! - getProperty(other, "Start Time")!);

	const objectLines = topologicalProjectObjects()
		.map(object => `\t\tobject_${object.id} = ${codegenObject(object)}`)
		.join("\n");

	const animationLines = animations
		.map(animation => {
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
