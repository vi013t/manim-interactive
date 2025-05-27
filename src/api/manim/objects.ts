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
import { property, type Property } from "./property";

export const objectCategories = {
	Line: { color: "#cba6f7" },
	Shape: { color: "#f38ba8" },
	Text: { color: "#f9e2af" },
	Miscellaneous: { color: "#9399b2" },
} as const satisfies { [key: string]: { color: string } };

export type ObjectCategory = keyof typeof objectCategories;
export type ManimObject = { name: string; internalName?: string; category: ObjectCategory; icon: Component<{ stroke: string }>; properties: Property[] };

export function getObjectCategory(name: ObjectCategory) {
	return objectCategories[name];
}

const mobjectProperties = [
	{ name: "Fill Color", internalName: "fill_color", type: property().color(), defaultValue: "#FFFFFF", category: "color", prioritized: true },
	{ name: "Fill Opacity", internalName: "fill_opacity", type: property().number(), defaultValue: 0, category: "color" },
	{ name: "Stroke Color", internalName: "stroke_color", type: property().color(), defaultValue: "#FFFFFF", category: "color", prioritized: true },
	{ name: "Stroke Opacity", internalName: "stroke_opacity", type: property().number(), defaultValue: 1, category: "color" },
	{ name: "Stroke Width", internalName: "stroke_width", type: property().number(), defaultValue: 4, category: "color" },
	{ name: "Background Stroke Color", internalName: "background_stroke_color", type: property().color(), defaultValue: "#000000", category: "color" },
	{ name: "Background Stroke Width", internalName: "background_stroke_width", type: property().number(), defaultValue: 0, category: "color" },
	{ name: "Sheen Factor", internalName: "sheen_factor", type: property().number(), defaultValue: 0, category: "color" },
	{ name: "Sheen Direction", internalName: "sheen_direction", type: property().coordinate(), defaultValue: [-1, 1, 0], category: "color" },
	{ name: "Background Image", internalName: "background_image", type: property().coordinate(), defaultValue: 0, category: "color" },

	{ name: "Joint Type", internalName: "joint_type", type: property().number(), defaultValue: 0, category: "rendering" },
	{ name: "Close New Points", internalName: "close_new_points", type: property().boolean(), defaultValue: false, category: "rendering" },
	{ name: "Scale Function", internalName: "pre_function_handle_to_anchor_scale_factor", type: property().number(), defaultValue: 0.01, category: "rendering" },
	{ name: "Make Smooth", internalName: "make_smooth_after_applying_functions", type: property().boolean(), defaultValue: false, category: "rendering" },
	{ name: "Point Equality Tolerance", internalName: "tolerance_for_point_equality", type: property().number(), defaultValue: 1e-6, category: "rendering" },
	{ name: "Points Per Cubic Curve", internalName: "n_points_per_cubic_curve", type: property().number(), defaultValue: 4, category: "rendering" },
	{ name: "Cap Style", internalName: "cap_style", type: property().number(), defaultValue: 0, category: "rendering" },
	{ name: "Shade In 3D", internalName: "shade_in_3d", type: property().boolean(), defaultValue: false, category: "rendering" },
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
			{ name: "Radius", internalName: "radius", type: property().number().nonnegative(), defaultValue: 1, category: "size", prioritized: true },
			{ name: "Start Angle", internalName: "start_angle", type: property().number(), defaultValue: 0, category: "size", prioritized: true },
			{ name: "Angle", internalName: "angle", type: property().number(), defaultValue: 1.57, category: "size", prioritized: true },
			{ name: "Tip Length", internalName: "tip_length", type: property().number().nonnegative(), defaultValue: 0.35, category: "rendering" },
			{ name: "Components", internalName: "num_components", type: property().number().integeric().nonnegative(), defaultValue: 9, category: "rendering" },
			{ name: "Normal Vector", internalName: "normal_vector", type: property().coordinate(), defaultValue: [0, 0, 1], category: "rendering" },
			{ name: "Center", internalName: "center", type: property().coordinate(), defaultValue: [0, 0, 0], category: "position", prioritized: true },
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
			{ name: "Radius", internalName: "radius", type: property().number().nonnegative(), defaultValue: 1, category: "size", prioritized: true },
			{ name: "Center", internalName: "center", type: property().coordinate(), defaultValue: [0, 0, 0], category: "position", prioritized: true },
			...mobjectProperties,
		],
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
		internalName: "MathTex",
		category: "Text",
		icon: VariableIcon,
		properties: [
			{
				name: "Text",
				internalName: "tex_strings",
				type: property().string().notEmpty().math(),
				defaultValue: null,
				category: "size",
				prioritized: true,
				required: true,
				position: 0,
			},
		],
	},
	{
		name: "Plain Text",
		category: "Text",
		icon: PlainTextIcon,
		internalName: "Text",
		properties: [
			{ name: "Text", internalName: "text", type: property().string().notEmpty(), defaultValue: null, category: "size", prioritized: true, required: true },
			{ name: "Line Spacing", internalName: "line_spacing", type: property().number(), defaultValue: -1, category: "size" },
			{ name: "Tab Width", internalName: "tab_width", type: property().number().integeric().nonnegative(), defaultValue: 4, category: "rendering" },
			{ name: "Align To Center", internalName: "should_center", type: property().boolean(), defaultValue: true, category: "rendering" },
			...mobjectProperties,
		],
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
		properties: [
			{ name: "Width", internalName: "width", type: property().number().nonnegative(), defaultValue: 4, category: "size", prioritized: true },
			{ name: "Height", internalName: "height", type: property().number().nonnegative(), defaultValue: 2, category: "size", prioritized: true },
			{ name: "Horizontal Grid Spacing", internalName: "grid_xstep", type: property().number().nonnegative(), defaultValue: null, category: "rendering" },
			{ name: "Vertical Grid Spacing", internalName: "grid_ystep", type: property().number().nonnegative(), defaultValue: null, category: "rendering" },
			...mobjectProperties,
		],
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
		properties: [
			{ name: "Points", internalName: "n", type: property().number().integeric().positive(), defaultValue: 1, category: "size", prioritized: true },
			{ name: "Outer Radius", internalName: "outer_radius", type: property().number().nonnegative(), defaultValue: 1, category: "size", prioritized: true },
			{ name: "Inner Radius", internalName: "outer_radius", type: property().number().nonnegative(), defaultValue: null, category: "size" },
			{ name: "Density", internalName: "density", type: property().number().integeric().positive(), defaultValue: 2, category: "rendering" },
			{ name: "Start Angle", internalName: "density", type: property().number(), defaultValue: 1.57, category: "rendering" },
			...mobjectProperties,
		],
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
