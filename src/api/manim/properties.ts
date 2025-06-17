import { getProjectAnimations, getProjectObjects, type ProjectAnimation, type ProjectObject } from "../project.svelte";
import { animations, type AnimationProperty, type AnimationPropertyName, type AnimationPropertyValue } from "./animations";
import { objects, type ObjectProperty, type ObjectPropertyName, type ObjectPropertyValue } from "./objects";
import { getPropertyObjects } from "./property";

export function getPossibleProperties(item: string): readonly ObjectProperty[];
export function getPossibleProperties(item: ProjectObject): readonly ObjectProperty[];
export function getPossibleProperties(item: ProjectAnimation): readonly AnimationProperty[];
export function getPossibleProperties(item: ProjectObject | ProjectAnimation): readonly ObjectProperty[] | readonly AnimationProperty[];

export function getPossibleProperties(item: ProjectObject | ProjectAnimation | string): readonly ObjectProperty[] | readonly AnimationProperty[] {
	if (typeof item === "string") return objects.find(object => object.name === item)!.properties as readonly ObjectProperty[];
	if (item.type === "object") return objects.find(object => object.name === getProperty(item, "Object Type")!)!.properties as readonly ObjectProperty[];
	return animations.find(manimAnimation => manimAnimation.name === getProperty(item, "Animation Type")!)!.properties as AnimationProperty[];
}

export function addProperty(id: number, name: ObjectPropertyName | AnimationPropertyName, value: unknown) {
	((getProjectObjects().find(object => object.id === id) ?? getProjectAnimations().find(animation => animation.id === id)) as any).properties[name] = value;
}

export function getProperty<Name extends AnimationPropertyName>(item: ProjectAnimation, name: Name): AnimationPropertyValue<Name> | null;
export function getProperty<Name extends ObjectPropertyName>(item: ProjectObject, name: Name): ObjectPropertyValue<Name> | null;
export function getProperty<Name extends AnimationPropertyName | ObjectPropertyName>(
	item: ProjectAnimation | ProjectObject,
	name: Name
): Name extends AnimationPropertyName ? AnimationPropertyValue<Name> : Name extends ObjectPropertyName ? ObjectPropertyValue<Name> : never | null {
	return (item.properties as any)[name] ?? null;
}

export function getAnimationObjects(animation: ProjectAnimation): number[] {
	return getPropertyObjects(
		new Map(
			getPossibleProperties(animation)
				.filter(property => property.name in animation.properties)
				.map(property => [property.type, getProperty(animation, property.name)!])
		)
	);
}
