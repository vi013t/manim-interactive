import type { Component } from "svelte";
import annulusDemo from "../../assets/images/annulus_demo.png";
import circleDemo from "../../assets/images/circle_demo.png";
import ellipseDemo from "../../assets/images/ellipse_demo.png";
import polygonDemo from "../../assets/images/polygon_demo.png";
import rectangleDemo from "../../assets/images/rectangle_demo.png";
import regularPolygonDemo from "../../assets/images/regular_polygon_demo.png";
import regularPolygramDemo from "../../assets/images/regular_polygram_demo.png";
import squareDemo from "../../assets/images/square_demo.png";
import starDemo from "../../assets/images/star_demo.png";
import triangleDemo from "../../assets/images/triangle_demo.png";
import AngleIcon from "../../components/icons/AngleIcon.svelte";
import AnnularSectorIcon from "../../components/icons/AnnularSectorIcon.svelte";
import AnnulusIcon from "../../components/icons/AnnulusIcon.svelte";
import ArcIcon from "../../components/icons/ArcIcon.svelte";
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

export const objectCategories = {
	Line: { color: "#cba6f7" },
	Math: { color: "#fab387" },
	Shape: { color: "#f38ba8" },
	Solid: { color: "#89b4fa" },
	Text: { color: "#f9e2af" },
	Miscellaneous: { color: "#9399b2" },
} as const satisfies { [key: string]: { color: string } };

export type ObjectCategory = keyof typeof objectCategories;
export type ManimObject = {
	name: string;
	internalName?: string;
	category: ObjectCategory;
	icon: Component<{ stroke: string }>;
	demo: string;
	description: string;
	properties: Property[];
};

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
		name: "Angle",
		category: "Line",
		icon: AngleIcon,
		description: "A geometric angle.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Annular Sector",
		internalName: "AnnularSector",
		category: "Shape",
		icon: AnnularSectorIcon,
		demo: circleDemo,
		description: "An angular slice of an annulus.",
		properties: [],
	},
	{
		name: "Annulus",
		category: "Shape",
		icon: AnnulusIcon,
		demo: annulusDemo,
		description: "A ring; The space between two concentric circles.",
		properties: [],
	},
	{
		name: "Arc",
		category: "Line",
		icon: ArcIcon,
		description: "Part of a circle.",
		demo: circleDemo,
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
		name: "Axes",
		category: "Math",
		icon: PlusIcon,
		description: "Mathematical axis lines.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Bar Chart",
		internalName: "BarChart",
		category: "Math",
		icon: BarChartIcon,
		description: "A statistical bar chart.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Bounding Polygon",
		internalName: "ConvexHull",
		category: "Shape",
		icon: BoundingPolygonIcon,
		description: "A polygon that connects the outermost points in a group of points.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Bulleted List",
		internalName: "BulletedList",
		category: "Text",
		icon: BulletedListIcon,
		description: "A list of text items with bullets.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Circle",
		category: "Shape",
		icon: CircleIcon,
		demo: circleDemo,
		description: "All points equidistant from a center point.",
		properties: [
			{ name: "Radius", internalName: "radius", type: property().number().nonnegative(), defaultValue: 1, category: "size", prioritized: true },
			{ name: "Center", internalName: "center", type: property().coordinate(), defaultValue: [0, 0, 0], category: "position", prioritized: true },
			...mobjectProperties,
		],
	},
	{
		name: "Combinator",
		category: "Miscellaneous",
		icon: CombinatorIcon,
		description: "Allows combining two objects in different ways.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Code",
		category: "Text",
		icon: CodeIcon,
		description: "A block of code or script.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Cone",
		category: "Solid",
		icon: ConeIcon,
		description: "The set of all lines between a circle and a point on the axis normal to its center.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Cube",
		category: "Solid",
		icon: CubeIcon,
		demo: circleDemo,
		description: "All points equidistant from a center point.",
		properties: [],
	},
	{
		name: "Cylinder",
		category: "Solid",
		icon: CylinderIcon,
		description: "A circle extruded into 3D space.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Dodecahedron",
		category: "Solid",
		icon: DodecahedronIcon,
		description: "A regular polyhedron with 12 sides.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Ellipse",
		category: "Shape",
		icon: EllipseIcon,
		demo: ellipseDemo,
		description: "All points with an equal sum of distances from two focal points.",
		properties: [],
	},
	{
		name: "Graph",
		category: "Math",
		icon: GridIcon,
		demo: annulusDemo,
		description: "A mathematical graph.",
		properties: [],
	},
	{
		name: "Group",
		category: "Miscellaneous",
		icon: PackageIcon,
		description: "A group of other objects, allowing animating them at the same time.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Icosahedron",
		category: "Solid",
		icon: IcosahedronIcon,
		description: "A regular polyhedron with 20 sides.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Image",
		category: "Miscellaneous",
		icon: ImageIcon,
		description: "An image loaded from a file.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Line",
		category: "Line",
		icon: LineIcon,
		description: "A customizeable line.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Equation",
		internalName: "MathTex",
		category: "Text",
		icon: VariableIcon,
		description: "A mathematical equation formatted with LaTeX",
		demo: circleDemo,
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
		name: "Network",
		internalName: "Graph",
		category: "Line",
		icon: NetworkIcon,
		description: "A connected graph of node points.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Octahedron",
		category: "Solid",
		description: "A regular polyhedron with 8 sides.",
		icon: OctahedronIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Paragraph",
		category: "Text",
		icon: ParagraphIcon,
		description: "Text with multiple lines.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Plain Text",
		category: "Text",
		icon: PlainTextIcon,
		internalName: "Text",
		description: "Plain text.",
		demo: circleDemo,
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
		icon: PolygonIcon,
		demo: polygonDemo,
		description: "A set of points connected by straight lines.",
		properties: [],
	},
	{
		name: "Polygram",
		category: "Shape",
		icon: NetworkIcon,
		description: "A polygon with intersecting edges.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Rectangle",
		category: "Shape",
		icon: RectangleIcon,
		demo: rectangleDemo,
		description: "A quadrilateral with four right angles.",
		properties: [
			{ name: "Width", internalName: "width", type: property().number().nonnegative(), defaultValue: 4, category: "size", prioritized: true },
			{ name: "Height", internalName: "height", type: property().number().nonnegative(), defaultValue: 2, category: "size", prioritized: true },
			{ name: "Horizontal Grid Spacing", internalName: "grid_xstep", type: property().number().nonnegative(), defaultValue: null, category: "rendering" },
			{ name: "Vertical Grid Spacing", internalName: "grid_ystep", type: property().number().nonnegative(), defaultValue: null, category: "rendering" },
			...mobjectProperties,
		],
	},
	{
		name: "Rectangular Prism",
		internalName: "Prism",
		category: "Solid",
		description: "A rectangle extruded into 3D space.",
		icon: RectangularPrismIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Regular Polygon",
		internalName: "RegularPolygon",
		category: "Shape",
		icon: HexagonIcon,
		demo: regularPolygonDemo,
		description: "A polygon with any number of equal sides and angles.",
		properties: [],
	},
	{
		name: "Regular Polygram",
		internalName: "RegularPolygram",
		category: "Shape",
		icon: StarOfDavidIcon,
		demo: regularPolygramDemo,
		description: "A polygram with any number of equal sides and angles.",
		properties: [],
	},
	{
		name: "Scripted Object",
		category: "Miscellaneous",
		icon: CodeIcon,
		description: "An object custom scripted in Python.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Sector",
		category: "Shape",
		icon: SectorIcon,
		demo: circleDemo,
		description: "All points equidistant from a center point.",
		properties: [],
	},
	{
		name: "Sphere",
		category: "Solid",
		icon: SphereIcon,
		description: "All three-dimensional points equidistant from a center point.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Square",
		category: "Shape",
		icon: SquareIcon,
		demo: squareDemo,
		description: "A rectangle with equal side lengths.",
		properties: [],
	},
	{
		name: "Star",
		category: "Shape",
		icon: StarIcon,
		demo: starDemo,
		description: "A regular polygram without intersecting lines.",
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
		name: "Stream Lines",
		category: "Math",
		icon: WaveIcon,
		demo: triangleDemo,
		description: "A regular polygon with three sides.",
		properties: [],
	},
	{
		name: "Styled Text",
		category: "Text",
		icon: ItalicIcon,
		description: "Text with formatting and styling.",
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Tangent Line",
		internalName: "TangentLine",
		description: "A line tangent to an object at some point.",
		category: "Line",
		icon: LineIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Tetrahedron",
		description: "A regular polyhedron with 4 sides.",
		category: "Solid",
		icon: TetrahedronIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Torus",
		description: "A circle revolved around a coplanar axis.",
		category: "Solid",
		icon: TorusIcon,
		demo: circleDemo,
		properties: [],
	},
	{
		name: "Triangle",
		category: "Shape",
		icon: TriangleIcon,
		demo: triangleDemo,
		description: "A regular polygon with three sides.",
		properties: [],
	},
] as const satisfies ManimObject[];
