import { getProjectObjects, type ProjectObject } from "../project.svelte";
import { animations } from "./animations";
import { objects } from "./objects";

export type PropertyTypeBase = "color" | "float" | "integer" | "string" | "animation" | "object" | "coordinate" | "boolean";
export type Property = { name: string; type: PropertyTypeBase; defaultValue: unknown; category: PropertyCategory; internalName: string };
export type PropertyCategory = "color" | "size" | "rendering" | "position";

export type NumberPropertyType = {
	base: "number";
	maximum: number;
	minimum: number;
	integeric: boolean;
};

export type ColorPropertyType = {
	base: "color";
};

export function floatProperty() {
	return {
		base: "number",
		maximum: Infinity,
		minimum: -Infinity,
		integeric: false,
	};
}

export function integerProperty() {
	return {
		base: "number",
		maximum: Infinity,
		minimum: -Infinity,
		integeric: true,
	};
}

export function percentProperty() {
	return {
		base: "number",
		maximum: 1,
		minimum: 0,
		integeric: false,
	};
}

export function getPossibleProperties(type: string): Property[] {
	console.log(type);
	return (objects.find(object => object.name === type) ?? animations.find(animation => animation.name === type))!.properties;
}

export function addProperty(id: number, name: string, value: unknown) {
	(getProjectObjects().find(object => object.id === id) as ProjectObject).properties[name] = value;
}
