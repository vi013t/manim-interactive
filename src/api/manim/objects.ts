import type { Component } from "svelte";
import annulusDemo from "../../assets/images/annulus_demo.png";
import barChartDemo from "../../assets/images/bar_chart_demo.png";
import circleDemo from "../../assets/images/circle_demo.png";
import ellipseDemo from "../../assets/images/ellipse_demo.png";
import graphDemo from "../../assets/images/graph_demo.png";
import imageDemo from "../../assets/images/image_demo.png";
import mathTextDemo from "../../assets/images/math_text_demo.png";
import polygonDemo from "../../assets/images/polygon_demo.png";
import rectangleDemo from "../../assets/images/rectangle_demo.png";
import regularPolygonDemo from "../../assets/images/regular_polygon_demo.png";
import regularPolygramDemo from "../../assets/images/regular_polygram_demo.png";
import squareDemo from "../../assets/images/square_demo.png";
import starDemo from "../../assets/images/star_demo.png";
import streamLinesDemo from "../../assets/images/stream_lines_demo.png";
import triangleDemo from "../../assets/images/triangle_demo.png";
import AngleIcon from "../../components/icons/AngleIcon.svelte";
import AnnularSectorIcon from "../../components/icons/AnnularSectorIcon.svelte";
import AnnulusIcon from "../../components/icons/AnnulusIcon.svelte";
import ArcIcon from "../../components/icons/ArcIcon.svelte";
import AsteriskIcon from "../../components/icons/AsteriskIcon.svelte";
import BarChartIcon from "../../components/icons/BarChartIcon.svelte";
import BoundingPolygonIcon from "../../components/icons/BoundingPolygonIcon.svelte";
import BulletedListIcon from "../../components/icons/BulletedListIcon.svelte";
import CircleIcon from "../../components/icons/CircleIcon.svelte";
import CodeIcon from "../../components/icons/CodeIcon.svelte";
import CombinatorIcon from "../../components/icons/CombinatorIcon.svelte";
import ConeIcon from "../../components/icons/ConeIcon.svelte";
import CubeIcon from "../../components/icons/CubeIcon.svelte";
import CylinderIcon from "../../components/icons/CylinderIcon.svelte";
import DodecahedronIcon from "../../components/icons/DodecahedronIcon.svelte";
import EllipseIcon from "../../components/icons/EllipseIcon.svelte";
import GridIcon from "../../components/icons/GridIcon.svelte";
import HexagonIcon from "../../components/icons/HexagonIcon.svelte";
import IcosahedronIcon from "../../components/icons/IcosahedronIcon.svelte";
import ImageIcon from "../../components/icons/ImageIcon.svelte";
import ItalicIcon from "../../components/icons/ItalicIcon.svelte";
import LineIcon from "../../components/icons/LineIcon.svelte";
import NetworkIcon from "../../components/icons/NetworkIcon.svelte";
import OctahedronIcon from "../../components/icons/OctahedronIcon.svelte";
import PackageIcon from "../../components/icons/PackageIcon.svelte";
import ParagraphIcon from "../../components/icons/ParagraphIcon.svelte";
import PlainTextIcon from "../../components/icons/PlainTextIcon.svelte";
import PlusIcon from "../../components/icons/PlusIcon.svelte";
import PolygonIcon from "../../components/icons/PolygonIcon.svelte";
import RectangleIcon from "../../components/icons/RectangleIcon.svelte";
import RectangularPrismIcon from "../../components/icons/RectangularPrismIcon.svelte";
import SectorIcon from "../../components/icons/SectorIcon.svelte";
import SphereIcon from "../../components/icons/SphereIcon.svelte";
import SquareIcon from "../../components/icons/SquareIcon.svelte";
import StarIcon from "../../components/icons/StarIcon.svelte";
import StarOfDavidIcon from "../../components/icons/StarOfDavidIcon.svelte";
import TetrahedronIcon from "../../components/icons/TetrahedronIcon.svelte";
import TorusIcon from "../../components/icons/TorusIcon.svelte";
import TriangleIcon from "../../components/icons/TriangleIcon.svelte";
import VariableIcon from "../../components/icons/VariableIcon.svelte";
import WaveIcon from "../../components/icons/WaveIcon.svelte";
import { property, type Property } from "./property";

export const objectCategories = [
	{ color: "#fab387", icon: LineIcon, name: "Line" },
	{ color: "#a6e3a1", icon: VariableIcon, name: "Math" },
	{ color: "#f38ba8", icon: CircleIcon, name: "Shape" },
	{ color: "#89b4fa", icon: CubeIcon, name: "Solid" },
	{ color: "#f9e2af", icon: PlainTextIcon, name: "Text" },
	{ color: "#b4befe", icon: AsteriskIcon, name: "Miscellaneous" },
] as const satisfies { name: string; color: string; icon: Component<{ stroke: string; [key: string]: unknown }> }[];

export type ObjectCategoryName = typeof objectCategories extends (infer Category)[] ? (Category extends { name: unknown } ? Category["name"] : never) : never;

export type ManimObject = {
	name: string;
	internalName?: string;
	categories: ObjectCategoryName[];
	icon: Component<{ stroke: string; [key: string]: unknown }>;
	demo: string;
	description: string;
	properties: Property[];
};

export function getObjectCategory(name: ObjectCategoryName) {
	return objectCategories.find(category => category.name === name)!;
}

const mobjectProperties = [
	{
		name: "Fill Color",
		internalName: "fill_color",
		type: property().color(),
		defaultValue: "#FFFFFF",
		categories: ["Color"],
		prioritized: true,
		description: "The color that the object is filled in with.",
	},
	{
		name: "Fill Opacity",
		internalName: "fill_opacity",
		type: property().number().percent(),
		defaultValue: 0,
		categories: ["Color"],
		description: "The opacity of the fill for the object",
	},
	{
		name: "Stroke Color",
		internalName: "stroke_color",
		type: property().color(),
		defaultValue: "#FFFFFF",
		categories: ["Color"],
		prioritized: true,
		description: "The color of the stroke used to draw this object.",
	},
	{
		name: "Stroke Opacity",
		internalName: "stroke_opacity",
		type: property().number().percent(),
		defaultValue: 1,
		categories: ["Color"],
		description: "The opacity of the stroke used to draw this object.",
	},
	{
		name: "Stroke Width",
		internalName: "stroke_width",
		type: property().number(),
		defaultValue: 4,
		categories: ["Color"],
		description: "The width of the stroke used to draw this object.",
	},
	{ name: "Background Stroke Color", internalName: "background_stroke_color", type: property().color(), defaultValue: "#000000", categories: ["Color"] },
	{ name: "Background Stroke Width", internalName: "background_stroke_width", type: property().number(), defaultValue: 0, categories: ["Color"] },
	{ name: "Sheen Factor", internalName: "sheen_factor", type: property().number(), defaultValue: 0, categories: ["Color"] },
	{ name: "Sheen Direction", internalName: "sheen_direction", type: property().coordinate(), defaultValue: [-1, 1, 0], categories: ["Color"] },
	{ name: "Background Image", internalName: "background_image", type: property().coordinate(), defaultValue: 0, categories: ["Color"] },

	{ name: "Joint Type", internalName: "joint_type", type: property().number(), defaultValue: 0, categories: ["Details"] },
	{ name: "Close New Points", internalName: "close_new_points", type: property().boolean(), defaultValue: false, categories: ["Details"] },
	{ name: "Scale Function", internalName: "pre_function_handle_to_anchor_scale_factor", type: property().number(), defaultValue: 0.01, categories: ["Details"] },
	{ name: "Make Smooth", internalName: "make_smooth_after_applying_functions", type: property().boolean(), defaultValue: false, categories: ["Details"] },
	{ name: "Point Equality Tolerance", internalName: "tolerance_for_point_equality", type: property().number(), defaultValue: 1e-6, categories: ["Details"] },
	{ name: "Points Per Cubic Curve", internalName: "n_points_per_cubic_curve", type: property().number(), defaultValue: 4, categories: ["Details"] },
	{ name: "Cap Style", internalName: "cap_style", type: property().number(), defaultValue: 0, categories: ["Details"] },
	{ name: "Shade In 3D", internalName: "shade_in_3d", type: property().boolean(), defaultValue: false, categories: ["Details"] },
] as const satisfies Property[];

export const objects = [
	{
		name: "Angle",
		categories: ["Line"],
		icon: AngleIcon,
		description: "A geometric angle.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Annular Sector",
		internalName: "AnnularSector",
		categories: ["Shape"],
		icon: AnnularSectorIcon,
		demo: circleDemo,
		description: "An angular slice of an annulus.",
		properties: [],
	},
	{
		name: "Annulus",
		categories: ["Shape"],
		icon: AnnulusIcon,
		demo: annulusDemo,
		description: "A ring; The space between two concentric circles.",
		properties: [],
	},
	{
		name: "Arc",
		categories: ["Line"],
		icon: ArcIcon,
		description: "Part of a circle.",
		demo: circleDemo,
		properties: [
			{ name: "Radius", internalName: "radius", type: property().number().nonnegative(), defaultValue: 1, categories: ["Size"], prioritized: true },
			{ name: "Start Angle", internalName: "start_angle", type: property().number(), defaultValue: 0, categories: ["Size"], prioritized: true },
			{ name: "Angle", internalName: "angle", type: property().number(), defaultValue: 1.57, categories: ["Size"], prioritized: true },
			{ name: "Tip Length", internalName: "tip_length", type: property().number().nonnegative(), defaultValue: 0.35, categories: ["Details"] },
			{ name: "Components", internalName: "num_components", type: property().number().integeric().nonnegative(), defaultValue: 9, categories: ["Details"] },
			{ name: "Normal Vector", internalName: "normal_vector", type: property().coordinate(), defaultValue: [0, 0, 1], categories: ["Details"] },
			{ name: "Center", internalName: "center", type: property().coordinate(), defaultValue: [0, 0, 0], categories: ["Position"], prioritized: true },
			...mobjectProperties,
		],
	},
	{
		name: "Axes",
		categories: ["Math"],
		icon: PlusIcon,
		description: "Mathematical axis lines.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Bar Chart",
		internalName: "BarChart",
		categories: ["Math"],
		icon: BarChartIcon,
		description: "A statistical bar graph.",
		demo: barChartDemo,
		properties: [],
	},
	{
		name: "Bounding Polygon",
		internalName: "ConvexHull",
		categories: ["Shape"],
		icon: BoundingPolygonIcon,
		description: "A polygon that connects the outermost points in a group of points.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Bulleted List",
		internalName: "BulletedList",
		categories: ["Text"],
		icon: BulletedListIcon,
		description: "A list of text items with bullets.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Circle",
		categories: ["Shape"],
		icon: CircleIcon,
		demo: circleDemo,
		description: "All points equidistant from a center point.",
		properties: [
			{
				name: "Radius",
				internalName: "radius",
				type: property().number().nonnegative(),
				defaultValue: 1,
				categories: ["Size"],
				prioritized: true,
				description: "The distance between each point on the circle and the circle's center.",
			},
			{ name: "Center", internalName: "center", type: property().coordinate(), defaultValue: [0, 0, 0], categories: ["Position"], prioritized: true },
			...mobjectProperties,
		],
	},
	{
		name: "Combinator",
		categories: ["Miscellaneous"],
		icon: CombinatorIcon,
		description: "Allows combining two objects in different ways.",
		demo: circleDemo,
		properties: [
			{
				name: "Method",
				type: property().select().choices("Difference", "Intersection", "Exclusion"),
				defaultValue: "Difference",
				categories: ["Special"],
				required: true,
				internalName: null!,
			},
		],
	},
	{
		name: "Code",
		categories: ["Text"],
		icon: CodeIcon,
		description: "A block of code or script.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Cone",
		categories: ["Solid"],
		icon: ConeIcon,
		description: "The set of all lines between a circle and a point on the axis normal to its center.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Cube",
		categories: ["Solid"],
		icon: CubeIcon,
		demo: circleDemo,
		description: "All points equidistant from a center point.",
		properties: [],
	},
	{
		name: "Cylinder",
		categories: ["Solid"],
		icon: CylinderIcon,
		description: "A circle extruded into 3D space.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Dodecahedron",
		categories: ["Solid"],
		icon: DodecahedronIcon,
		description: "A regular polyhedron with 12 sides.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Ellipse",
		categories: ["Shape"],
		icon: EllipseIcon,
		demo: ellipseDemo,
		description: "All points with an equal sum of distances from two focal points.",
		properties: [],
	},
	{
		name: "Graph",
		categories: ["Math"],
		icon: GridIcon,
		demo: graphDemo,
		description: "A mathematical graph.",
		properties: [],
	},
	{
		name: "Group",
		categories: ["Miscellaneous"],
		icon: PackageIcon,
		description: "A group of other objects, allowing animating them at the same time.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Icosahedron",
		categories: ["Solid"],
		icon: IcosahedronIcon,
		description: "A regular polyhedron with 20 sides.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Image",
		categories: ["Miscellaneous"],
		icon: ImageIcon,
		description: "An image loaded from a file.",
		demo: imageDemo,
		properties: [
			// Custom
			{
				name: "Dynamic",
				type: property().boolean(),
				defaultValue: false,
				categories: ["Color"],
				internalName: null!,
				description:
					"Whether to reference an image by path instead of saving the image data. If dynamic is on, changes to the image file will be reflected in the animation. If dynamic is off (default), the image data is saved when it's first loaded, and the image file can be modified or deleted without affecting the animation.",
			},
		],
	},
	{
		name: "Line",
		categories: ["Line"],
		icon: LineIcon,
		description: "A customizeable line.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Equation",
		internalName: "MathTex",
		categories: ["Text", "Math"],
		icon: VariableIcon,
		description: "A mathematical equation formatted with LaTeX",
		demo: mathTextDemo,
		properties: [
			{
				name: "Text",
				internalName: "tex_strings",
				type: property().string().notEmpty().math(),
				defaultValue: null,
				categories: ["Size"],
				prioritized: true,
				required: true,
				position: 0,
			},
		],
	},
	{
		name: "Network",
		internalName: "Graph",
		categories: ["Line"],
		icon: NetworkIcon,
		description: "A connected graph of node points.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Octahedron",
		categories: ["Solid"],
		description: "A regular polyhedron with 8 sides.",
		icon: OctahedronIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Paragraph",
		categories: ["Text"],
		icon: ParagraphIcon,
		description: "Text with multiple lines.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Plain Text",
		categories: ["Text"],
		icon: PlainTextIcon,
		internalName: "Text",
		description: "Plain text.",
		demo: circleDemo,
		properties: [
			{
				name: "Text",
				internalName: "text",
				type: property().string().notEmpty(),
				defaultValue: null,
				categories: ["Size"],
				prioritized: true,
				required: true,
				description: "The text to display",
			},
			{ name: "Line Spacing", internalName: "line_spacing", type: property().number(), defaultValue: -1, categories: ["Size"] },
			{
				name: "Tab Width",
				internalName: "tab_width",
				type: property().number().integeric().nonnegative(),
				defaultValue: 4,
				categories: ["Details"],
				description: "The amount of spaces to render a tab character as.",
			},
			{
				name: "Align To Center",
				internalName: "should_center",
				type: property().boolean(),
				defaultValue: true,
				categories: ["Details"],
				description: "Whether to center-justify the text.",
			},
			...mobjectProperties,
		],
	},
	{
		name: "Polygon",
		categories: ["Shape"],
		icon: PolygonIcon,
		demo: polygonDemo,
		description: "A set of points connected by straight lines.",
		properties: [],
	},
	{
		name: "Polygram",
		categories: ["Shape"],
		icon: NetworkIcon,
		description: "A polygon with intersecting edges.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Rectangle",
		categories: ["Shape"],
		icon: RectangleIcon,
		demo: rectangleDemo,
		description: "A quadrilateral with four right angles.",
		properties: [
			{
				name: "Width",
				internalName: "width",
				type: property().number().nonnegative(),
				defaultValue: 4,
				categories: ["Size"],
				prioritized: true,
				description: "The width of the rectangle.",
			},
			{
				name: "Height",
				internalName: "height",
				type: property().number().nonnegative(),
				defaultValue: 2,
				categories: ["Size"],
				prioritized: true,
				description: "The height of the rectangle.",
			},
			{ name: "Horizontal Grid Spacing", internalName: "grid_xstep", type: property().number().nonnegative(), defaultValue: null, categories: ["Details"] },
			{ name: "Vertical Grid Spacing", internalName: "grid_ystep", type: property().number().nonnegative(), defaultValue: null, categories: ["Details"] },
			...mobjectProperties,
		],
	},
	{
		name: "Rectangular Prism",
		internalName: "Prism",
		categories: ["Solid"],
		description: "A rectangle extruded into 3D space.",
		icon: RectangularPrismIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Regular Polygon",
		internalName: "RegularPolygon",
		categories: ["Shape"],
		icon: HexagonIcon,
		demo: regularPolygonDemo,
		description: "A polygon with any number of equal sides and angles.",
		properties: [],
	},
	{
		name: "Regular Polygram",
		internalName: "RegularPolygram",
		categories: ["Shape"],
		icon: StarOfDavidIcon,
		demo: regularPolygramDemo,
		description: "A polygram with any number of equal sides and angles.",
		properties: [],
	},
	{
		name: "Scripted Object",
		categories: ["Miscellaneous"],
		icon: CodeIcon,
		description: "An object custom scripted in Python.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Sector",
		categories: ["Shape"],
		icon: SectorIcon,
		demo: circleDemo,
		description: "All points equidistant from a center point.",
		properties: [],
	},
	{
		name: "Sphere",
		categories: ["Solid"],
		icon: SphereIcon,
		description: "All three-dimensional points equidistant from a center point.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Square",
		categories: ["Shape"],
		icon: SquareIcon,
		demo: squareDemo,
		description: "A rectangle with equal side lengths.",
		properties: [],
	},
	{
		name: "Star",
		categories: ["Shape"],
		icon: StarIcon,
		demo: starDemo,
		description: "A regular polygram without intersecting lines.",
		properties: [
			{
				name: "Number of Points",
				internalName: "n",
				type: property().number().integeric().positive(),
				defaultValue: 1,
				categories: ["Size"],
				prioritized: true,
				description: "The number of points the star has.",
			},
			{ name: "Outer Radius", internalName: "outer_radius", type: property().number().nonnegative(), defaultValue: 1, categories: ["Size"], prioritized: true },
			{ name: "Inner Radius", internalName: "outer_radius", type: property().number().nonnegative(), defaultValue: null, categories: ["Size"] },
			{ name: "Density", internalName: "density", type: property().number().integeric().positive(), defaultValue: 2, categories: ["Details"] },
			{ name: "Start Angle", internalName: "density", type: property().number(), defaultValue: 1.57, categories: ["Details"] },
			...mobjectProperties,
		],
	},
	{
		name: "Stream Lines",
		categories: ["Math"],
		icon: WaveIcon,
		demo: streamLinesDemo,
		description: "A visualization of flow in a vector field.",
		properties: [],
	},
	{
		name: "Styled Text",
		categories: ["Text"],
		icon: ItalicIcon,
		description: "Text with formatting and styling.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Tangent Line",
		internalName: "TangentLine",
		description: "A line tangent to an object at some point.",
		categories: ["Line"],
		icon: LineIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Tetrahedron",
		description: "A regular polyhedron with 4 sides.",
		categories: ["Solid"],
		icon: TetrahedronIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Torus",
		description: "A circle revolved around a coplanar axis.",
		categories: ["Solid"],
		icon: TorusIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Triangle",
		categories: ["Shape"],
		icon: TriangleIcon,
		demo: triangleDemo,
		description: "A regular polygon with three sides.",
		properties: [],
	},
] as const satisfies ManimObject[];
