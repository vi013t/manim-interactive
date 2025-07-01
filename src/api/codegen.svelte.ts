import { invoke } from "@tauri-apps/api/core";
import { getManimAnimationByName } from "./manim/animations";
import { events } from "./manim/events";
import { objects, type ManimObject } from "./manim/objects";
import {
	getAnimationObjects,
	getPossibleProperties,
	propertyValueToString,
	type FunctionProperty,
	type KeywordProperty,
	type PositionalProperty,
	type Property,
} from "./manim/property";
import { getObjectFromId, getProject, getProjectLocation, topologicalProjectObjects, type ProjectAnimation, type ProjectEvent, type ProjectObject } from "./project.svelte";

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

export function codegenAnimation(animation: Omit<ProjectAnimation, "previewData"> & { previewData?: string }): string {
	let manimAnimation = getManimAnimationByName(animation.properties["Animation Type"]!)!;

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
	return `${manimAnimation.internalName ?? manimAnimation.name}(${positionalArguments}${comma}${keywordArguments})`;
}

let isObjectPreviewLoaded = $state(true);
let isAnimationPreviewLoaded = $state(true);

export async function generateObjectPreview(object: Omit<ProjectObject, "previewData"> & { previewData?: string }): Promise<ProjectObject> {
	isObjectPreviewLoaded = false;
	const variableLines = getProject()
		.variables.map(variable => `\t\tvariable_${variable.id} = ${propertyValueToString(variable.type, variable.value)}`)
		.join("\n");
	const imageData = await invoke<string>("generate_object_preview", {
		path: await getProjectLocation(),
		id: object.id,
		code: `from manim import *\n\nclass Main(Scene):\n\tdef construct(self):\n${variableLines}\n\n\t\tself.add(${codegenObject(object)})`,
	});
	object.previewData = imageData;
	isObjectPreviewLoaded = true;
	return object as ProjectObject;
}

export async function generateAnimationPreview(animation: Omit<ProjectAnimation, "previewData"> & { previewData?: string }): Promise<ProjectAnimation> {
	isAnimationPreviewLoaded = false;
	const variableLines = getProject()
		.variables.map(variable => `\t\tvariable_${variable.id} = ${propertyValueToString(variable.type, variable.value)}`)
		.join("\n");
	const videoData = await invoke<string>("generate_animation_preview", {
		path: await getProjectLocation(),
		id: animation.id,
		code: `from manim import *\n\nclass Main(Scene):\n\tdef construct(self):\n${variableLines}\n\n${getAnimationObjects(animation as ProjectAnimation).map(
			object => `\n\t\tobject_${object} = ${codegenObject(getObjectFromId(object)!)}`
		)}\n\n\t\tself.play(${codegenAnimation(animation)})`,
	});
	animation.previewData = videoData;
	isAnimationPreviewLoaded = true;
	return animation as ProjectAnimation;
}

export function objectPreviewLoaded() {
	return isObjectPreviewLoaded;
}

export function animationPreviewLoaded() {
	return isAnimationPreviewLoaded;
}

export function generateCode(): string {
	let animations = (getProject().animations as (ProjectAnimation | ProjectEvent)[]).concat(getProject().events).toSorted((first, other) => {
		let startTime1 = first.type === "animation" ? first.properties["Start Time"]! : first.properties.Time!;
		let startTime2 = other.type === "animation" ? other.properties["Start Time"]! : other.properties.Time!;

		if (startTime1 === startTime2) {
			if (first.type === "event") return -1;
			if (other.type === "event") return 1;
		}

		return startTime1 - startTime2;
	});

	const variableLines = getProject()
		.variables.map(variable => `\t\tvariable_${variable.id} = ${propertyValueToString(variable.type, variable.value)}`)
		.join("\n");

	const objectLines = topologicalProjectObjects()
		.map(object => `\t\tobject_${object.id} = ${codegenObject(object)}`)
		.join("\n");

	console.log($state.snapshot(animations.map(anim => anim.properties.Name)));

	const animationLines = animations
		.map(animation => {
			if (animation.type === "event") {
				const eventBase = events.find(event => event.name === animation.properties["Event Type"])!;
				return "codegen" in eventBase ? `\t\t${eventBase.codegen(animation.properties)}` : null;
			}

			return `\t\tself.play(${codegenAnimation(animation)})`;
		})
		.filter(line => line)
		.join("\n");

	console.log(animationLines);

	return `from manim import *

class Main(Scene):

	def construct(self):

		# Variables
${variableLines}

		# Objects
${objectLines}

		# Animations
${animationLines}
`;
}
