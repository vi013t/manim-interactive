export type Property = {
	name: string;
	type: PropertyType;
	defaultValue: unknown;
	category: PropertyCategory;
	internalName: string;
	prioritized?: true;
	required?: true;
	position?: number;
};

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
	isMath: boolean;
	notEmpty(): StringProperty;
	math(): StringProperty;
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

export function propertyValueToString(property: Property, value: unknown): string {
	return `${["string", "color"].includes(property.type.base) ? `r"${value}"` : value}`;
}
