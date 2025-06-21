import AnimationIcon from "../../components/icons/AnimationIcon.svelte";
import BulletedListIcon from "../../components/icons/BulletedListIcon.svelte";
import CameraIcon from "../../components/icons/CameraIcon.svelte";
import ClockIcon from "../../components/icons/ClockIcon.svelte";
import CubeIcon from "../../components/icons/CubeIcon.svelte";
import type { Icon } from "../../components/icons/Icon";
import NumberSignIcon from "../../components/icons/NumberSignIcon.svelte";
import PaintRollerIcon from "../../components/icons/PaintRollerIcon.svelte";
import ReticleIcon from "../../components/icons/ReticleIcon.svelte";
import StarIcon from "../../components/icons/StarIcon.svelte";
import SwitchIcon from "../../components/icons/SwitchIcon.svelte";
import TextIcon from "../../components/icons/TextIcon.svelte";
import TransformIcon from "../../components/icons/TransformIcon.svelte";
import type { SelectOption } from "../../components/util/Select.svelte";
import { getProjectAnimations, getProjectObjects, getProjectVariableFromId, type ProjectAnimation, type ProjectObject } from "../project.svelte";
import { animations, type AnimationProperties, type AnimationProperty, type AnimationPropertyName, type AnimationPropertyValue } from "./animations";
import { objects, type ObjectProperties, type ObjectProperty, type ObjectPropertyName, type ObjectPropertyValue } from "./objects";

type PositionalPropertyPart = {
	/**
	 * Indicates that this property is positional, with the given position. This relates to Python code generation.
	 * Positional properties are passed as positional arguments to their Python constructor. For example, a property
	 * `radius = 5` with position `0` may generate the code:
	 *
	 * ```python
	 * Circle(5)
	 * ```
	 *
	 * as opposed to a keyword property, which would instead convert to:
	 *
	 * ```python
	 * Circle(radius = 5)
	 * ```
	 */
	position: number;
};

type KeywordPropertyPart = {
	internalName: string;
};

type FunctionPropertyPart = {
	function: string;
};

type SpecialPropertyPart = {
	/**
	 * Indicates that this property has it's own special handling when code generation occurs. It's not a keyword argument,
	 * nor a positional argument, or anything like that; It gets its own unique handling during codegen.
	 */
	special: true;
};

export type BaseProperty = {
	name: string;
	type: PropertyType;
	categories: readonly ObjectPropertyCategory[] | readonly AnimationPropertyCategory[];
	description: string;

	/**
	 * Whether this property is required for the user to set explicitly.
	 */
	required?: true;
};

export type PositionalProperty = BaseProperty & PositionalPropertyPart;
export type KeywordProperty = BaseProperty & KeywordPropertyPart;
export type FunctionProperty = BaseProperty & FunctionPropertyPart;
export type SpecialProperty = BaseProperty & SpecialPropertyPart;

export type Property = PositionalProperty | KeywordProperty | FunctionProperty | SpecialProperty;

export const objectPropertyCategories = [
	{ color: "var(--yellow)", icon: StarIcon, name: "Special" },
	{ color: "var(--red)", icon: PaintRollerIcon, name: "Color" },
	{ color: "var(--blue)", icon: TransformIcon, name: "Transform" },
	{ color: "var(--mauve)", icon: CameraIcon, name: "Details" },
] as const satisfies { name: string; color: string; icon: Icon }[];

export const animationPropertyCategories = [
	{ color: "var(--yellow)", icon: StarIcon, name: "Special" },
	{ color: "var(--blue)", icon: ClockIcon, name: "Timing" },
] as const satisfies { name: string; color: string; icon: Icon }[];

/**
 * Narrows the value associated with a specific key in an object type. For example, if we take the type:
 *
 * ```ts
 * type Base = { value: boolean }
 * ```
 *
 * We can pass it to `Narrow`, like so:
 *
 * ```ts
 * type Narrowed = Narrow<Base, "value", true>
 * ```
 *
 * Then the new type, `Narrowed`, is equal to:
 *
 * ```ts
 * type Narrowed = { value: true }
 * ```
 */
export type Narrow<Base extends { [key: keyof any]: unknown }, Key extends keyof any, Value extends Base[Key]> = Omit<Base, Key> & { [K in Key]: Value };

export type ObjectPropertyCategory = typeof objectPropertyCategories extends (infer Category)[] ? (Category extends { name: unknown } ? Category["name"] : never) : never;
export type AnimationPropertyCategory = typeof animationPropertyCategories extends (infer Category)[] ? (Category extends { name: unknown } ? Category["name"] : never) : never;

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
	defaultValue: string | null;
	codegenOverride?: (value: string) => string;
	default(value: string): SelectProperty;
	choices(...options: SelectOption[]): SelectProperty;
	requires<const This extends SelectProperty, const Names extends string[]>(this: This, ...name: Names): Narrow<This, "requiredProperties", Names>;
	codegen(value: (value: string) => string): SelectProperty;
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
	 * @param length The required amount of elements as a `NumberProperty`.
	 */
	length(length: Narrow<NumberProperty, "isIntegeric", true>): ListProperty;

	requires<const This extends ListProperty, const Names extends string[]>(this: This, ...name: Names): Narrow<This, "requiredProperties", Names>;
};

export type ObjectTypeProperty = {
	base: "objectType";
	requiredProperties: string[];
	requires(...name: string[]): ObjectTypeProperty;
};

export type ObjectPropertyType = {
	base: "object";
	allowedTypes: string[];
	requiredProperties: string[];
	only(...allowedTypes: string[]): ObjectPropertyType;
	requires(...name: string[]): ObjectPropertyType;
};

export type AnimationTypeProperty = {
	base: "animationType";
	requiredProperties: string[];
	requires(...name: string[]): AnimationTypeProperty;
};

export type StringProperty = {
	base: "string";
	canBeEmpty: boolean;
	isMath: boolean;
	isPath: boolean;
	defaultValue: string;
	requiredProperties: string[];
	requiredNotProperties: string[];
	notEmpty(): StringProperty;
	math(): StringProperty;
	default(value: string): StringProperty;
	requires(...name: string[]): StringProperty;
	requiresNot(...name: string[]): StringProperty;
	path<This extends StringProperty>(this: This): Narrow<This, "isPath", true>;
};

export type NumberProperty = {
	base: "number";
	maximumValue: number;
	minimumValue: number;
	isIntegeric: boolean;
	defaultValue: number;
	isAngle: boolean;
	requiredProperties: string[];

	requires(...name: string[]): NumberProperty;

	equal<This extends NumberProperty>(this: This, value: number): This;
	angle<This extends NumberProperty>(this: This): Narrow<This, "isAngle", true>;

	default(value: number): NumberProperty;

	/**
	 * Restricts a number property to be at most a certain maximum value. The new property is returned without modifying this one.
	 *
	 * @param value The maximum value
	 */
	max<This extends NumberProperty, Value extends number>(this: This, value: Value): Narrow<This, "maximumValue", Value>;

	/**
	 * Restricts a number property to be at least a certain minimum value. The new property is returned without modifying this one.
	 *
	 * @param value The minimum value
	 */
	min<This extends NumberProperty, Value extends number>(this: This, value: Value): Narrow<This, "minimumValue", Value>;

	/**
	 * Restricts a number property to be an integer.
	 */
	integeric<This extends NumberProperty>(this: This): Narrow<This, "isIntegeric", true>;

	/**
	 * Restricts a number property to be greater than or equal to 0. To make a number property greater than *and not equal to* 0, use {positive()} instead.
	 * The new property is returned without modifying this one.
	 */
	nonnegative<This extends NumberProperty>(this: This): Narrow<This, "minimumValue", 0>;

	/**
	 * Restricts a number property to be greater than 0. To make a number property greater than *or equal to* 0, use {nonnegative()} instead.
	 * The new property is returned without modifying this one.
	 */
	positive<This extends NumberProperty>(this: This): Narrow<This, "minimumValue", 0.000001>;

	/**
	 * Restricts a number property to be in `[0, 1]`.
	 * The new property is returned without modifying this one.
	 */
	percent<This extends NumberProperty>(this: This): Narrow<Narrow<This, "minimumValue", 0>, "maximumValue", 1>;
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
	| ObjectPropertyType
	| ListProperty
	| CompoundProperty;
export type PropertyTypeBase = PropertyType["base"];

/**
 * Returns a factory for creating properties.
 */
export function property() {
	return {
		number(): NumberProperty {
			return {
				base: "number",
				maximumValue: Number.MAX_VALUE,
				minimumValue: -Number.MAX_VALUE,
				isIntegeric: false,
				defaultValue: 0,
				isAngle: false,
				requiredProperties: [],

				angle() {
					return {
						...this,
						isAngle: true,
						minimumValue: 0,
					};
				},
				max<This extends NumberProperty, Value extends number>(this: This, value: Value): Narrow<This, "maximumValue", Value> {
					return {
						...this,
						maximumValue: value,
					};
				},
				min<This extends NumberProperty, Value extends number>(this: This, value: Value): Narrow<This, "minimumValue", Value> {
					return {
						...this,
						minimumValue: value,
					};
				},
				equal<This extends NumberProperty>(this: This, value: number): This {
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
				integeric<This extends NumberProperty>(this: This): Narrow<This, "isIntegeric", true> {
					return {
						...this,
						isIntegeric: true,
					};
				},
				nonnegative<This extends NumberProperty>(this: This): Narrow<This, "minimumValue", 0> {
					return {
						...this,
						minimumValue: 0,
					};
				},
				positive<This extends NumberProperty>(this: This): Narrow<This, "minimumValue", 0.000001> {
					return {
						...this,
						minimumValue: 0.000001,
					};
				},
				percent<This extends NumberProperty>(this: This): Narrow<Narrow<This, "minimumValue", 0>, "maximumValue", 1> {
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
				isPath: false,
				requiredNotProperties: [],
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
				requiresNot(...name: string[]): StringProperty {
					return {
						...this,
						requiredNotProperties: name,
					};
				},
				path() {
					return {
						...this,
						isPath: true,
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
				length(length: Narrow<NumberProperty, "isIntegeric", true>) {
					return {
						...this,
						requiredLength: length,
					};
				},
				requires<const This extends ListProperty, const Names extends string[]>(this: This, ...name: Names): Narrow<This, "requiredProperties", Names> {
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
		object(): ObjectPropertyType {
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
		animationType(): AnimationTypeProperty {
			return {
				requiredProperties: [],
				base: "animationType",
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
				requires<const This extends SelectProperty, const Names extends string[]>(this: This, ...name: Names): Narrow<This, "requiredProperties", Names> {
					return { ...this, requiredProperties: name };
				},
				codegen(value: (value: string) => string): SelectProperty {
					return {
						...this,
						codegenOverride: value,
					};
				},
			};
		},
	};
}

export function propertyValueToString(type: PropertyType, value: unknown): string {
	if ((value as any).variableId) {
		let variable = getProjectVariableFromId((value as any).variableId)!;
		return `variable_${variable.id}`;
	}

	if (type.base === "list") {
		let result = (value as unknown[]).map(element => propertyValueToString(type.type, element)).join(", ");
		if (!type.shouldSpread) result = `[${result}]`;
		return result;
	}

	if (type.base === "coordinate") {
		return `[${(value as number[]).map(element => `${element}`).join(", ")}]`;
	}

	if (type.base === "string" && "codegenOverride" in type && type.codegenOverride !== undefined) {
		return type.codegenOverride(value as string);
	}

	if (["string", "color"].includes(type.base)) return `r"${value}"`;
	if (type.base === "object") return `object_${value}`;
	return `${value}`;
}

export type PropertyValue<T extends PropertyType> = T extends ObjectPropertyType ? number : T extends { defaultValue: unknown } ? T["defaultValue"] : never;

export function getPropertyObjects(properties: Map<PropertyType, unknown>): number[] {
	return properties
		.entries()
		.map(([property, value]) => {
			if (property.base === "object") return [value as number];
			if (property.base === "list") return (value as unknown[]).map(element => getPropertyObjects(new Map([[property.type, element]]))).flat();
			return [];
		})
		.toArray()
		.flat();
}

export type Properties<T extends ProjectObject | ProjectAnimation> = T extends ProjectObject ? ObjectProperties : AnimationProperties;

export function getPossibleProperties(item: string): readonly ObjectProperty[];
export function getPossibleProperties(item: Omit<ProjectObject, "previewData"> & { previewData?: string }): readonly ObjectProperty[];
export function getPossibleProperties(item: Omit<ProjectAnimation, "previewData"> & { previewData?: string }): readonly AnimationProperty[];
export function getPossibleProperties(item: ProjectObject): readonly ObjectProperty[];
export function getPossibleProperties(item: ProjectAnimation): readonly AnimationProperty[];

export function getPossibleProperties(
	item: (Omit<ProjectObject, "previewData"> & { previewData?: string }) | (Omit<ProjectAnimation, "previewData"> & { previewData?: string }) | ProjectAnimation | string
): readonly ObjectProperty[] | readonly AnimationProperty[] {
	if (typeof item === "string") return objects.find(object => object.name === item)!.properties as readonly ObjectProperty[];
	if (item.type === "object") return objects.find(object => object.name === item.properties["Object Type"]!)!.properties as readonly ObjectProperty[];
	return animations.find(manimAnimation => manimAnimation.name === item.properties["Animation Type"]!)!.properties as readonly AnimationProperty[];
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
				.map(property => [property.type, animation.properties[property.name]!])
		)
	);
}

export function getPropertyTypeIcon(base: PropertyTypeBase): Icon {
	return {
		number: NumberSignIcon,
		string: TextIcon,
		list: BulletedListIcon,
		compound: BulletedListIcon,
		coordinate: ReticleIcon,
		object: CubeIcon,
		objectType: CubeIcon,
		animation: AnimationIcon,
		animationType: AnimationIcon,
		boolean: SwitchIcon,
		color: PaintRollerIcon,
	}[base];
}

export function getPropertyTypeColor(base: PropertyTypeBase): string {
	return {
		number: "var(--lavender)",
		string: "var(--blue)",
		list: "var(--yellow)",
		compound: "var(--mauve)",
		coordinate: "var(--mauve)",
		object: "var(--peach)",
		objectType: "var(--peach)",
		animation: "var(--teal)",
		animationType: "var(--teal)",
		boolean: "var(--green)",
		color: "var(--red)",
	}[base];
}

export function propertyIsNumber<T>(propertyType: PropertyType): propertyType is NumberProperty {
	return propertyType.base === "number";
}
