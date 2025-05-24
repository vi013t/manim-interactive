import type { Component } from "svelte";
import PlusIcon from "../components/icons/PlusIcon.svelte";

export type PropertyType = "color" | "float" | "integer" | "string";
export type Property = { name: string; type: PropertyType; defaultValue: unknown };
export type AnimationCategory = "Create" | "Destroy" | "Transform" | "Highlight";
export type ManimAnimation = { name: string; category: AnimationCategory; icon: Component<{ stroke: string }>; properties: Property[] };

export const animations = [
	{
		name: "Create",
		category: "Create",
		icon: PlusIcon,
		properties: [],
	},
] as const satisfies ManimAnimation[];

export const objects = {
	Circle: {
		properties: [
			{ name: "radius", type: "float", defaultValue: 1 },
			{ name: "color", type: "color", defaultValue: "#FFFFFF" },
		],
	},
} as const;

export type ItemData = {
	properties: Property[];
};

export function getItemData(itemType: string): ItemData {
	return (objects as any)[itemType];
}
