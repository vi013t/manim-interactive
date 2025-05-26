import type { Component } from "svelte";
import AnnulusIcon from "../../components/icons/AnnulusIcon.svelte";
import ArcIcon from "../../components/icons/ArcIcon.svelte";
import CircleIcon from "../../components/icons/CircleIcon.svelte";
import EllipseIcon from "../../components/icons/EllipseIcon.svelte";
import HexagonIcon from "../../components/icons/HexagonIcon.svelte";
import ItalicIcon from "../../components/icons/ItalicIcon.svelte";
import LineIcon from "../../components/icons/LineIcon.svelte";
import PackageIcon from "../../components/icons/PackageIcon.svelte";
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
export type ManimObject = { name: string; category: ObjectCategory; icon: Component<{ stroke: string }>; properties: Property[]; base?: string };

export function getObjectCategory(name: ObjectCategory) {
	return objectCategories[name];
}

const mobjectProperties = [
	{ name: "Fill Color", type: "color", defaultValue: "#FFFFFF", category: "color" },
	{ name: "Fill Opacity", type: "float", defaultValue: 0, category: "color" },
	{ name: "Stroke Color", type: "color", defaultValue: "#FFFFFF", category: "color" },
	{ name: "Stroke Opacity", type: "float", defaultValue: 1, category: "color" },
	{ name: "Stroke Width", type: "float", defaultValue: 4, category: "color" },
	{ name: "Background Stroke Color", type: "color", defaultValue: "#000000", category: "color" },
	{ name: "Background Stroke Width", type: "float", defaultValue: 0, category: "color" },
	{ name: "Sheen Factor", type: "float", defaultValue: 0, category: "color" },
	{ name: "Sheen Direction", type: "coordinate", defaultValue: [-1, 1, 0], category: "color" },
	{ name: "Background Image", type: "float", defaultValue: 0, category: "color" },

	{ name: "Joint Type", type: "float", defaultValue: 0, category: "rendering" },
	{ name: "Close New Points", type: "boolean", defaultValue: false, category: "rendering" },
	{ name: "Scale Function", type: "float", defaultValue: 0.01, category: "rendering" },
	{ name: "Make Smooth", type: "boolean", defaultValue: false, category: "rendering" },
	{ name: "Point Equality Tolerance", type: "float", defaultValue: 1e-6, category: "rendering" },
	{ name: "Points Per Cubic Curve", type: "float", defaultValue: 4, category: "rendering" },
	{ name: "Cap Style", type: "float", defaultValue: 0, category: "rendering" },
	{ name: "Shade In 3D", type: "boolean", defaultValue: false, category: "rendering" },
] as const satisfies Property[];

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
		properties: [
			{ name: "Radius", type: "float", defaultValue: 1, category: "size" },
			{ name: "Start Angle", type: "float", defaultValue: 0, category: "size" },
			{ name: "Angle", type: "float", defaultValue: 1.57, category: "size" },
			{ name: "Tip Length", type: "float", defaultValue: 0.35, category: "size" },
			{ name: "Components", type: "float", defaultValue: 9, category: "rendering" },
			{ name: "Normal Vector", type: "coordinate", defaultValue: [0, 0, 1], category: "rendering" },
			{ name: "Center", type: "coordinate", defaultValue: [0, 0, 0], category: "position" },
			...mobjectProperties,
		],
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
		properties: [
			{ name: "Radius", type: "float", defaultValue: 1, category: "size" },
			{ name: "Center", type: "coordinate", defaultValue: [0, 0, 0], category: "position" },
			...mobjectProperties,
		],
		base: "Arc",
	},
	{
		name: "Ellipse",
		category: "Shape",
		icon: EllipseIcon,
		properties: [],
	},
	{
		name: "Group",
		category: "Miscellaneous",
		icon: PackageIcon,
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
