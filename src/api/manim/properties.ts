import { getProjectObjects, type ProjectAnimation, type ProjectObject } from "../project.svelte";
import { animations } from "./animations";
import { objects } from "./objects";
import type { Property } from "./property";

export function getPossibleProperties(item: ProjectObject | ProjectAnimation | string): Property[] {
	if (typeof item === "string") return objects.find(object => object.name === item)!.properties;
	if ("objectType" in item) return objects.find(object => object.name === item.objectType)!.properties;
	return animations.find(manimAnimation => manimAnimation.name === item.animationType)!.properties;
}

export function addProperty(id: number, name: string, value: unknown) {
	(getProjectObjects().find(object => object.id === id) as ProjectObject).properties[name] = value;
}
