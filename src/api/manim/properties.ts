import { getProjectObjects, type ProjectObject } from "../project.svelte";
import { animations } from "./animations";
import { objects } from "./objects";
import type { Property } from "./property";

export function getPossibleProperties(type: string): Property[] {
	return (objects.find(object => object.name === type) ?? animations.find(animation => animation.name === type))!.properties;
}

export function addProperty(id: number, name: string, value: unknown) {
	(getProjectObjects().find(object => object.id === id) as ProjectObject).properties[name] = value;
}
