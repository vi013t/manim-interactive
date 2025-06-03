import type { Component } from "svelte";
import AsteriskIcon from "../../components/icons/AsteriskIcon.svelte";
import CameraIcon from "../../components/icons/CameraIcon.svelte";
import PaintRollerIcon from "../../components/icons/PaintRollerIcon.svelte";
import ReticleIcon from "../../components/icons/ReticleIcon.svelte";
import ScaleIcon from "../../components/icons/ScaleIcon.svelte";
import type { SelectOption } from "../../components/util/Select.svelte";

export type Property = {
	name: string;
	type: PropertyType;
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

export type ColorProperty = {
	base: "color";
	defaultValue: string;
	default(value: string): ColorProperty;
};

export type SelectProperty = {
	base: "string";
	options: string[];
	choices(...options: SelectOption[]): SelectProperty;
	defaultValue: string | null;
};

export type ListProperty = {
	base: "list";
	type: PropertyType;
	shouldSpread: boolean;
	defaultValue: unknown[];
	default(value: unknown[]): ListProperty;
	spread(): ListProperty;
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
	defaultValue: string;
	notEmpty(): StringProperty;
	math(): StringProperty;
	default(value: string): StringProperty;
};

export type NumberProperty = {
	base: "number";
	maximumValue: number;
	minimumValue: number;
	isIntegeric: boolean;
	defaultValue: number;

	/**
	 * Restricts a number property to be at most a certain maximum value. The new property is returned without modifying this one.
	 *
	 * @param value The maximum value
	 */
	max(value: number): NumberProperty;

	default(value: number): NumberProperty;

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
	defaultValue: [number, number, number];
	default(value: [number, number, number]): CoordinateProperty;
};

export type BooleanProperty = {
	base: "boolean";
	defaultValue: boolean;
	default(value: boolean): BooleanProperty;
};

export type CompoundProperty = {
	base: "compound";
	subProperties: { [key: string]: PropertyType };
	property(name: string, type: PropertyType): CompoundProperty;
	defaultValue: unknown;
	default(value: unknown): CompoundProperty;
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
	| ObjectProperty
	| ListProperty
	| CompoundProperty;
export type PropertyTypeBase = PropertyType["base"];

export const property = (() => {
	return {
		number(): NumberProperty {
			return {
				base: "number",
				maximumValue: Infinity,
				minimumValue: -Infinity,
				isIntegeric: false,
				defaultValue: 0,
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
				default(value: number) {
					return {
						...this,
						defaultValue: value,
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
				defaultValue: "",
				default(value: string) {
					return {
						...this,
						defaultValue: value,
					};
				},
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
				defaultValue: false,
				default(value: boolean) {
					return {
						...this,
						defaultValue: value,
					};
				},
			};
		},
		color(): ColorProperty {
			return {
				defaultValue: "#FFFFFF",
				base: "color",
				default(value: string) {
					return {
						...this,
						defaultValue: value,
					};
				},
			};
		},
		list(type: PropertyType): ListProperty {
			return {
				base: "list",
				type,
				defaultValue: [],
				shouldSpread: false,
				default(value: unknown[]) {
					return {
						...this,
						defaultValue: value,
					};
				},
				spread() {
					return {
						...this,
						shouldSpread: true,
					};
				},
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
		compound(): CompoundProperty {
			return {
				base: "compound",
				subProperties: {},
				defaultValue: {},
				default(value: unknown) {
					return {
						...this,
						defaultValue: value,
					};
				},
				property(name: string, type: PropertyType): CompoundProperty {
					return {
						...this,
						subProperties: { ...this.subProperties, [name]: type },
					};
				},
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
				defaultValue: [0, 0, 0],
				default(value: [number, number, number]) {
					return {
						...this,
						defaultValue: value,
					};
				},
			};
		},
		select(): SelectProperty {
			return {
				base: "string",
				options: [],
				defaultValue: null,
				choices(...choices: string[]) {
					return {
						...this,
						options: choices,
					};
				},
			};
		},
	};
}) satisfies () => { [Key in PropertyTypeBase]: (() => PropertyType) | ((type: PropertyType) => PropertyType) };

export function propertyValueToString(type: PropertyType, value: unknown): string {
	if (type.base === "list") {
		let result = (value as unknown[]).map(element => propertyValueToString(type.type, element)).join(", ");
		if (!type.shouldSpread) result = `[${result}]`;
		return result;
	}

	if (["string", "color"].includes(type.base)) return `r"${value}"`;
	if (type.base === "object") return `var_${value}`;
	return `${value}`;
}

export type PropertyValue<T extends PropertyType> = T extends ListProperty
	? unknown[]
	: T extends StringProperty
	? string
	: T extends ColorProperty
	? string
	: T extends NumberProperty
	? number
	: T extends SelectProperty
	? string
	: T extends BooleanProperty
	? boolean
	: never;
