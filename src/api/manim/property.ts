import type { Component } from "svelte";
import CameraIcon from "../../components/icons/CameraIcon.svelte";
import PaintRollerIcon from "../../components/icons/PaintRollerIcon.svelte";
import StarIcon from "../../components/icons/StarIcon.svelte";
import TransformIcon from "../../components/icons/TransformIcon.svelte";
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
	function?: string;
};

export const propertyCategories = [
	{ color: "#f9e2af", icon: StarIcon, name: "Special" },
	{ color: "#f38ba8", icon: PaintRollerIcon, name: "Color" },
	{ color: "#89b4fa", icon: TransformIcon, name: "Transform" },
	{ color: "#cba6f7", icon: CameraIcon, name: "Details" },
] as const satisfies { name: string; color: string; icon: Component<{ stroke: string; [key: string]: unknown }> }[];

export type PropertyCategory = typeof propertyCategories extends (infer Category)[] ? (Category extends { name: unknown } ? Category["name"] : never) : never;

export type ColorProperty = {
	base: "color";
	defaultValue: string;
	requiredProperties: string[];
	default(value: string): ColorProperty;
	requires(...name: string[]): ColorProperty;
};

export type SelectProperty = {
	base: "string";
	options: string[];
	requiredProperties: string[];
	choices(...options: SelectOption[]): SelectProperty;
	defaultValue: string | null;
	default(value: string): SelectProperty;
	requires(...name: string[]): SelectProperty;
};

export type ListProperty = {
	base: "list";
	type: PropertyType;
	requiredLength: NumberProperty;
	shouldSpread: boolean;
	defaultValue: unknown[];
	requiredProperties: string[];
	allowDuplicates: boolean;
	default(value: unknown[]): ListProperty;

	/**
	 * Indicates that this list cannot have duplicate elements.
	 *
	 * In the case of lists of complex objects such as project objects or animations, duplicates are considered by referential
	 * equality; i.e. if two objects are identical but have different internal IDs, they are allowed to be in the same list,
	 * even if it is `.unique()`.
	 */
	unique(): ListProperty;

	/**
	 * Indicates that this property should be spread into separate arguments when generating
	 * Python code. For example, consider passing the property `[1, 2, 3]` to a constructor
	 * `Shape`. Without `.spread()`, the generated code would be:
	 *
	 * ```python
	 * Shape([1, 2, 3])
	 * ```
	 *
	 * With spread, the generated code would instead be:
	 *
	 * ```python
	 * Shape(1, 2, 3)
	 * ```
	 */
	spread(): ListProperty;

	/**
	 * Indicates that this list must have the specified number of elements. If `.length()` is
	 * not used, the user can set any amount of elements.
	 *
	 * @param length The required amount of elements
	 */
	length(length: NumberProperty): ListProperty;

	requires(...name: string[]): ListProperty;
};

export type ObjectTypeProperty = {
	base: "objectType";
	requiredProperties: string[];
	requires(...name: string[]): ObjectTypeProperty;
};

export type ObjectProperty = {
	base: "object";
	allowedTypes: string[];
	requiredProperties: string[];
	only(...allowedTypes: string[]): ObjectProperty;
	requires(...name: string[]): ObjectProperty;
};

export type AnimationTypeProperty = {
	base: "animation";
	requiredProperties: string[];
	requires(...name: string[]): AnimationTypeProperty;
};

export type StringProperty = {
	base: "string";
	canBeEmpty: boolean;
	isMath: boolean;
	defaultValue: string;
	requiredProperties: string[];
	notEmpty(): StringProperty;
	math(): StringProperty;
	default(value: string): StringProperty;
	requires(...name: string[]): StringProperty;
};

export type NumberProperty = {
	base: "number";
	maximumValue: number;
	minimumValue: number;
	isIntegeric: boolean;
	defaultValue: number;
	requiredProperties: string[];

	requires(...name: string[]): NumberProperty;

	equal(value: number): NumberProperty;

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
	requiredProperties: string[];
	default(value: [number, number, number]): CoordinateProperty;
	requires(...name: string[]): CoordinateProperty;
};

export type BooleanProperty = {
	base: "boolean";
	defaultValue: boolean;
	requiredProperties: string[];
	default(value: boolean): BooleanProperty;
	requires(...name: string[]): BooleanProperty;
};

export type CompoundProperty = {
	base: "compound";
	subProperties: { [key: string]: PropertyType };
	defaultValue: unknown;
	requiredProperties: string[];
	property(name: string, type: PropertyType): CompoundProperty;
	default(value: unknown): CompoundProperty;
	requires(...name: string[]): CompoundProperty;
};

export type PropertyType =
	| NumberProperty
	| StringProperty
	| ColorProperty
	| CoordinateProperty
	| BooleanProperty
	| ObjectTypeProperty
	| AnimationTypeProperty
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
				requiredProperties: [],
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
				equal(value: number): NumberProperty {
					return {
						...this,
						minimumValue: value,
						maximumValue: value,
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
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		string(): StringProperty {
			return {
				base: "string",
				canBeEmpty: true,
				isMath: false,
				defaultValue: "",
				requiredProperties: [],
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
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		boolean(): BooleanProperty {
			return {
				base: "boolean",
				defaultValue: false,
				requiredProperties: [],
				default(value: boolean) {
					return {
						...this,
						defaultValue: value,
					};
				},
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		color(): ColorProperty {
			return {
				defaultValue: "#FFFFFF",
				base: "color",
				requiredProperties: [],
				default(value: string) {
					return {
						...this,
						defaultValue: value,
					};
				},
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		list(type: PropertyType): ListProperty {
			return {
				base: "list",
				type,
				requiredLength: property().number().integeric().nonnegative(),
				defaultValue: [],
				shouldSpread: false,
				requiredProperties: [],
				allowDuplicates: true,
				unique(): ListProperty {
					return {
						...this,
						allowDuplicates: false,
					};
				},
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
				length(length: NumberProperty) {
					return {
						...this,
						requiredLength: length,
					};
				},
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		objectType(): ObjectTypeProperty {
			return {
				base: "objectType",
				requiredProperties: [],
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		object(): ObjectProperty {
			return {
				base: "object",
				allowedTypes: [],
				requiredProperties: [],
				only(...allowedTypes: string[]) {
					return {
						...this,
						allowedTypes,
					};
				},
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		compound(): CompoundProperty {
			return {
				base: "compound",
				subProperties: {},
				requiredProperties: [],
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
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		animation(): AnimationTypeProperty {
			return {
				requiredProperties: [],
				base: "animation",
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		coordinate(): CoordinateProperty {
			return {
				base: "coordinate",
				defaultValue: [0, 0, 0],
				requiredProperties: [],
				default(value: [number, number, number]) {
					return {
						...this,
						defaultValue: value,
					};
				},
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
				},
			};
		},
		select(): SelectProperty {
			return {
				base: "string",
				requiredProperties: [],
				options: [],
				defaultValue: null,
				choices(...choices: string[]) {
					return {
						...this,
						options: choices,
					};
				},
				default(value: string) {
					return {
						...this,
						defaultValue: value,
					};
				},
				requires(...name: string[]) {
					return { ...this, requiredProperties: name };
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
	: T extends AnimationTypeProperty
	? string
	: T extends ObjectTypeProperty
	? string
	: T extends ObjectProperty
	? number
	: T extends NumberProperty
	? number
	: T extends SelectProperty
	? string
	: T extends BooleanProperty
	? boolean
	: never;
