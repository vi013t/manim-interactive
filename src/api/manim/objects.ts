import type { Component } from "svelte";
import AnnulusIcon from "../../components/icons/AnnulusIcon.svelte";
import ArcIcon from "../../components/icons/ArcIcon.svelte";
import CircleIcon from "../../components/icons/CircleIcon.svelte";
import EllipseIcon from "../../components/icons/EllipseIcon.svelte";
import HexagonIcon from "../../components/icons/HexagonIcon.svelte";
import ItalicIcon from "../../components/icons/ItalicIcon.svelte";
import LineIcon from "../../components/icons/LineIcon.svelte";
import PlainTextIcon from "../../components/icons/PlainTextIcon.svelte";
import RectangleIcon from "../../components/icons/RectangleIcon.svelte";
import SquareIcon from "../../components/icons/SquareIcon.svelte";
import StarIcon from "../../components/icons/StarIcon.svelte";
import TriangleIcon from "../../components/icons/TriangleIcon.svelte";
import UpArrowIcon from "../../components/icons/UpArrowIcon.svelte";
import VariableIcon from "../../components/icons/VariableIcon.svelte";
import type { Property } from "./shared";

export const objectCategories = {
	Line: { color: "#cba6f7" },
	Shape: { color: "#f38ba8" },
	Text: { color: "#f9e2af" },
	Miscellaneous: { color: "#9399b2" },
} as const satisfies { [key: string]: { color: string } };

export type ObjectCategory = keyof typeof objectCategories;
export type ManimObject = { name: string; category: ObjectCategory; icon: Component<{ stroke: string }>; properties: Property[] };

export function getObjectCategory(name: ObjectCategory) {
	return objectCategories[name];
}

export const objects = [
	{
		name: "Annulus",
		category: "Shape",
		icon: AnnulusIcon,
		properties: [],
	},
	{
		name: "Arc",
		category: "Line",
		icon: ArcIcon,
		properties: [],
	},
	{
		name: "Arrow",
		category: "Line",
		icon: UpArrowIcon,
		properties: [],
	},
	{
		name: "Circle",
		category: "Shape",
		icon: CircleIcon,
		properties: [{ name: "Radius", type: "float", defaultValue: 1 }],
	},
	{
		name: "Ellipse",
		category: "Shape",
		icon: EllipseIcon,
		properties: [],
	},
	{
		name: "Line",
		category: "Line",
		icon: LineIcon,
		properties: [],
	},
	{
		name: "Math Text",
		category: "Text",
		icon: VariableIcon,
		properties: [],
	},
	{
		name: "Plain Text",
		category: "Text",
		icon: PlainTextIcon,
		properties: [],
	},
	{
		name: "Polygon",
		category: "Shape",
		icon: HexagonIcon,
		properties: [],
	},
	{
		name: "Rectangle",
		category: "Shape",
		icon: RectangleIcon,
		properties: [],
	},
	{
		name: "Square",
		category: "Shape",
		icon: SquareIcon,
		properties: [],
	},
	{
		name: "Star",
		category: "Shape",
		icon: StarIcon,
		properties: [],
	},
	{
		name: "Styled Text",
		category: "Text",
		icon: ItalicIcon,
		properties: [],
	},
	{
		name: "Triangle",
		category: "Shape",
		icon: TriangleIcon,
		properties: [],
	},
] as const satisfies ManimObject[];
