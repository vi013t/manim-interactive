import { getProjectObjects, type ProjectObject } from "../project.svelte";
import { animations } from "./animations";
import { objects } from "./objects";

export type PropertyType = "color" | "float" | "integer" | "string" | "animation" | "object" | "coordinate" | "boolean";
export type Property = { name: string; type: PropertyType; defaultValue: unknown; category: PropertyCategory };
export type PropertyCategory = "color" | "size" | "rendering" | "position";

export function getPossibleProperties(type: string): Property[] {
	return (objects.find(object => object.name === type) ?? animations.find(animation => animation.name === type))!.properties;
}

export function addProperty(id: number, name: string, value: unknown) {
	(getProjectObjects().find(object => object.id === id) as ProjectObject).properties[name] = value;
}
