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
	{ name: "Fill Color", internalName: "fill_color", type: "color", defaultValue: "#FFFFFF", category: "color" },
	{ name: "Fill Opacity", internalName: "fill_opacity", type: "float", defaultValue: 0, category: "color" },
	{ name: "Stroke Color", internalName: "stroke_color", type: "color", defaultValue: "#FFFFFF", category: "color" },
	{ name: "Stroke Opacity", internalName: "stroke_opacity", type: "float", defaultValue: 1, category: "color" },
	{ name: "Stroke Width", internalName: "stroke_width", type: "float", defaultValue: 4, category: "color" },
	{ name: "Background Stroke Color", internalName: "background_stroke_color", type: "color", defaultValue: "#000000", category: "color" },
	{ name: "Background Stroke Width", internalName: "background_stroke_width", type: "float", defaultValue: 0, category: "color" },
	{ name: "Sheen Factor", internalName: "sheen_factor", type: "float", defaultValue: 0, category: "color" },
	{ name: "Sheen Direction", internalName: "sheen_direction", type: "coordinate", defaultValue: [-1, 1, 0], category: "color" },
	{ name: "Background Image", internalName: "background_image", type: "float", defaultValue: 0, category: "color" },

	{ name: "Joint Type", internalName: "joint_type", type: "float", defaultValue: 0, category: "rendering" },
	{ name: "Close New Points", internalName: "close_new_points", type: "boolean", defaultValue: false, category: "rendering" },
	{ name: "Scale Function", internalName: "pre_function_handle_to_anchor_scale_factor", type: "float", defaultValue: 0.01, category: "rendering" },
	{ name: "Make Smooth", internalName: "make_smooth_after_applying_functions", type: "boolean", defaultValue: false, category: "rendering" },
	{ name: "Point Equality Tolerance", internalName: "tolerance_for_point_equality", type: "float", defaultValue: 1e-6, category: "rendering" },
	{ name: "Points Per Cubic Curve", internalName: "n_points_per_cubic_curve", type: "float", defaultValue: 4, category: "rendering" },
	{ name: "Cap Style", internalName: "cap_style", type: "float", defaultValue: 0, category: "rendering" },
	{ name: "Shade In 3D", internalName: "shade_in_3d", type: "boolean", defaultValue: false, category: "rendering" },
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
			{ name: "Radius", internalName: "radius", type: "float", defaultValue: 1, category: "size" },
			{ name: "Start Angle", internalName: "start_angle", type: "float", defaultValue: 0, category: "size" },
			{ name: "Angle", internalName: "angle", type: "float", defaultValue: 1.57, category: "size" },
			{ name: "Tip Length", internalName: "tip_length", type: "float", defaultValue: 0.35, category: "size" },
			{ name: "Components", internalName: "num_components", type: "float", defaultValue: 9, category: "rendering" },
			{ name: "Normal Vector", internalName: "normal_vector", type: "coordinate", defaultValue: [0, 0, 1], category: "rendering" },
			{ name: "Center", internalName: "center", type: "coordinate", defaultValue: [0, 0, 0], category: "position" },
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
			{ name: "Radius", internalName: "radius", type: "float", defaultValue: 1, category: "size" },
			{ name: "Center", internalName: "center", type: "coordinate", defaultValue: [0, 0, 0], category: "position" },
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
