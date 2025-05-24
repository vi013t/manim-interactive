const objects = {
	Circle: {
		properties: [
			{ name: "radius", type: "float", defaultValue: 1 },
			{ name: "color", type: "color", defaultValue: "#FFFFFF" },
		],
	},
} as const;

export type PropertyType = "color" | "float" | "integer" | "string";

export type ItemData = {
	properties: { name: string; type: PropertyType; defaultValue: unknown }[];
};

export function getItemData(itemType: string): ItemData {
	return (objects as any)[itemType];
}
