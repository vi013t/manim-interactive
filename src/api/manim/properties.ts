import { getProjectObjects, type ProjectObject } from "../project.svelte";
import { animations } from "./animations";
import { objects } from "./objects";

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

export type ObjectProperty = {
	base: "object";
};

export type AnimationProperty = {
	base: "animation";
};

export type StringProperty = {
	base: "string";
	canBeEmpty: boolean;
	notEmpty(): StringProperty;
};

export type NumberProperty = {
	base: "number";
	maximumValue: number;
	minimumValue: number;
	isIntegeric: boolean;
	max(value: number): NumberProperty;
	min(value: number): NumberProperty;
	integeric(): NumberProperty;
	nonnegative(): NumberProperty;
	positive(): NumberProperty;
};

export type CoordinateProperty = {
	base: "coordinate";
};

export type BooleanProperty = {
	base: "boolean";
};

export type PropertyType = NumberProperty | StringProperty | ColorProperty | CoordinateProperty | BooleanProperty | ObjectProperty | AnimationProperty;
export type PropertyTypeBase = PropertyType["base"];

export const property = (() => {
	return {
		number(): NumberProperty {
			return {
				base: "number",
				maximumValue: Infinity,
				minimumValue: -Infinity,
				isIntegeric: false,
				max(value: number): NumberProperty {
					return {
						...this,
						maximumValue: value,
					};
				},
				min(value: number): NumberProperty {
					return {
						...this,
						minimumValue: value,
					};
				},
				integeric(): NumberProperty {
					return {
						...this,
						isIntegeric: true,
					};
				},
				nonnegative(): NumberProperty {
					return {
						...this,
						minimumValue: 0,
					};
				},
				positive(): NumberProperty {
					return {
						...this,
						minimumValue: 0.000001,
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
		boolean(): BooleanProperty {
			return {
				base: "boolean",
			};
		},
		color(): ColorProperty {
			return {
				base: "color",
			};
		},
		object(): ObjectProperty {
			return {
				base: "object",
			};
		},
		animation(): AnimationProperty {
			return {
				base: "animation",
			};
		},
		coordinate(): CoordinateProperty {
			return {
				base: "coordinate",
			};
		},
	};
}) satisfies () => { [Key in PropertyTypeBase]: () => PropertyType };

export function getPossibleProperties(type: string): Property[] {
	return (objects.find(object => object.name === type) ?? animations.find(animation => animation.name === type))!.properties;
}

export function addProperty(id: number, name: string, value: unknown) {
	(getProjectObjects().find(object => object.id === id) as ProjectObject).properties[name] = value;
}
