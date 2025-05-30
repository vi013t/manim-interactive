import type { Component } from "svelte";
import AsteriskIcon from "../../components/icons/AsteriskIcon.svelte";
import CameraIcon from "../../components/icons/CameraIcon.svelte";
import PaintRollerIcon from "../../components/icons/PaintRollerIcon.svelte";
import ReticleIcon from "../../components/icons/ReticleIcon.svelte";
import ScaleIcon from "../../components/icons/ScaleIcon.svelte";

export type Property = {
	name: string;
	type: PropertyType;
	defaultValue: unknown;
	categories: PropertyCategory[];
	internalName?: string;
	prioritized?: true;
	required?: true;
	position?: number;
	description?: string;
};

export const propertyCategories = [
	{ color: "#f38ba8", icon: PaintRollerIcon, name: "Color" },
	{ color: "#89b4fa", icon: ScaleIcon, name: "Size" },
	{ color: "#cba6f7", icon: CameraIcon, name: "Details" },
	{ color: "#f9e2af", icon: ReticleIcon, name: "Position" },
	{ color: "#b4befe", icon: AsteriskIcon, name: "Special" },
] as const satisfies { name: string; color: string; icon: Component<{ stroke: string; [key: string]: unknown }> }[];

export type PropertyCategory = typeof propertyCategories extends (infer Category)[] ? (Category extends { name: unknown } ? Category["name"] : never) : never;

export type NumberPropertyType = {
	base: "number";
	maximum: number;
	minimum: number;
	integeric: boolean;
};

export type ColorProperty = {
	base: "color";
};

export type SelectProperty = {
	base: "string";
	options: string[];
	choices(...options: string[]): SelectProperty;
};

export type ObjectTypeProperty = {
	base: "objectType";
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
	isMath: boolean;
	notEmpty(): StringProperty;
	math(): StringProperty;
};

export type NumberProperty = {
	base: "number";
	maximumValue: number;
	minimumValue: number;
	isIntegeric: boolean;

	/**
	 * Restricts a number property to be at most a certain maximum value. The new property is returned without modifying this one.
	 *
	 * @param value The maximum value
	 */
	max(value: number): NumberProperty;

	/**
	 * Restricts a number property to be at least a certain minimum value. The new property is returned without modifying this one.
	 *
	 * @param value The minimum value
	 */
	min(value: number): NumberProperty;

	/**
	 * Restricts a number property to be an integer.
	 */
	integeric(): NumberProperty;

	/**
	 * Restricts a number property to be greater than or equal to 0. To make a number property greater than *and not equal to* 0, use {positive()} instead.
	 * The new property is returned without modifying this one.
	 */
	nonnegative(): NumberProperty;

	/**
	 * Restricts a number property to be greater than 0. To make a number property greater than *or equal to* 0, use {nonnegative()} instead.
	 * The new property is returned without modifying this one.
	 */
	positive(): NumberProperty;

	/**
	 * Restricts a number property to be in `[0, 1]`.
	 * The new property is returned without modifying this one.
	 */
	percent(): NumberProperty;
};

export type CoordinateProperty = {
	base: "coordinate";
};

export type BooleanProperty = {
	base: "boolean";
};

export type PropertyType =
	| NumberProperty
	| StringProperty
	| ColorProperty
	| CoordinateProperty
	| BooleanProperty
	| ObjectTypeProperty
	| AnimationProperty
	| SelectProperty
	| ObjectProperty;
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
				percent(): NumberProperty {
					return this.min(0).max(1);
				},
			};
		},
		string(): StringProperty {
			return {
				base: "string",
				canBeEmpty: true,
				isMath: false,
				notEmpty() {
					return {
						...this,
						canBeEmpty: false,
					};
				},
				math() {
					return {
						...this,
						isMath: true,
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
		objectType(): ObjectTypeProperty {
			return {
				base: "objectType",
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
		select(): SelectProperty {
			return {
				base: "string",
				options: [],
				choices(...choices: string[]) {
					return {
						...this,
						options: choices,
					};
				},
			};
		},
	};
}) satisfies () => { [Key in PropertyTypeBase]: () => PropertyType };

export function propertyValueToString(property: Property, value: unknown): string {
	if (["string", "color"].includes(property.type.base)) return `r"${value}"`;
	if (property.type.base === "object") return `var_${value}`;
	return `${value}`;
}
