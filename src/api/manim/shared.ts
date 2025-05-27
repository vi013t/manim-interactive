import { getProjectObjects, type ProjectObject } from "../project.svelte";
import { animations } from "./animations";
import { objects } from "./objects";

export type PropertyTypeBase = "color" | "number" | "string" | "animation" | "object" | "coordinate" | "boolean";
export type PropertyType = { base: PropertyTypeBase; [key: string]: unknown };
export type Property = { name: string; type: PropertyType; defaultValue: unknown; category: PropertyCategory; internalName: string; prioritized?: true; required?: true };
export type PropertyCategory = "color" | "size" | "rendering" | "position";

export type NumberPropertyType = {
	base: "number";
	maximum: number;
	minimum: number;
	integeric: boolean;
};

export type ColorProperty = {
	base: "color";
};

export type StringProperty = {
	base: "string";
	canBeEmpty: boolean;
	notEmpty(): StringProperty;
};

export type NumberProperty = {
	base: "number";
	maximum: number;
	minimum: number;
	integer: boolean;
	max(value: number): NumberProperty;
	min(value: number): NumberProperty;
	integeric(): NumberProperty;
};

export function property(): { [key: string]: () => PropertyType } {
	return {
		numeric(): NumberProperty {
			return {
				base: "number",
				maximum: Infinity,
				minimum: -Infinity,
				integer: false,
				max(value: number): NumberProperty {
					return {
						...this,
						maximum: value,
					};
				},
				min(value: number): NumberProperty {
					return {
						...this,
						minimum: value,
					};
				},
				integeric(): NumberProperty {
					return {
						...this,
						integer: true,
					};
				},
			};
		},
		string(): StringProperty {
			return {
				base: "string",
				canBeEmpty: true,
				notEmpty() {
					return {
						...this,
						canBeEmpty: false,
					};
				},
			};
		},
		boolean() {
			return {
				base: "boolean",
			};
		},
		color(): ColorProperty {
			return {
				base: "color",
			};
		},
		object() {
			return {
				base: "object",
			};
		},
		animation() {
			return {
				base: "animation",
			};
		},
		coordinate() {
			return {
				base: "coordinate",
			};
		},
	};
}

export function getPossibleProperties(type: string): Property[] {
	return (objects.find(object => object.name === type) ?? animations.find(animation => animation.name === type))!.properties;
}

export function addProperty(id: number, name: string, value: unknown) {
	(getProjectObjects().find(object => object.id === id) as ProjectObject).properties[name] = value;
}
