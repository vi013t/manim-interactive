import angleDemo from "../../assets/images/angle_demo.png";
import annularSectorDemo from "../../assets/images/annular_sector_demo.png";
import annulusDemo from "../../assets/images/annulus_demo.png";
import arcDemo from "../../assets/images/arc_demo.png";
import axesDemo from "../../assets/images/axes_demo.png";
import barChartDemo from "../../assets/images/bar_chart_demo.png";
import boundingPolygonDemo from "../../assets/images/bounding_polygon_demo.png";
import bulletedListDemo from "../../assets/images/bulleted_list_demo.png";
import circleDemo from "../../assets/images/circle_demo.png";
import codeDemo from "../../assets/images/code_demo.png";
import combinatorDemo from "../../assets/images/combinator_demo.png";
import coneDemo from "../../assets/images/cone_demo.png";
import cubeDemo from "../../assets/images/cube_demo.png";
import cylinderDemo from "../../assets/images/cylinder_demo.png";
import dodecahedronDemo from "../../assets/images/dodecahedron_demo.png";
import ellipseDemo from "../../assets/images/ellipse_demo.png";
import graphDemo from "../../assets/images/graph_demo.png";
import groupDemo from "../../assets/images/group_demo.png";
import icosahedronDemo from "../../assets/images/icosahedron_demo.png";
import imageDemo from "../../assets/images/image_demo.png";
import lineDemo from "../../assets/images/line_demo.png";
import mathTextDemo from "../../assets/images/math_text_demo.png";
import networkDemo from "../../assets/images/network_demo.png";
import octahedronDemo from "../../assets/images/octahedron_demo.png";
import paragraphDemo from "../../assets/images/paragraph_demo.png";
import plainTextDemo from "../../assets/images/plain_text_demo.png";
import polygonDemo from "../../assets/images/polygon_demo.png";
import rectangleDemo from "../../assets/images/rectangle_demo.png";
import rectangularPrismDemo from "../../assets/images/rectangular_prism_demo.png";
import regularPolygonDemo from "../../assets/images/regular_polygon_demo.png";
import regularPolygramDemo from "../../assets/images/regular_polygram_demo.png";
import sectorDemo from "../../assets/images/sector_demo.png";
import sphereDemo from "../../assets/images/sphere_demo.png";
import squareDemo from "../../assets/images/square_demo.png";
import starDemo from "../../assets/images/star_demo.png";
import streamLinesDemo from "../../assets/images/stream_lines_demo.png";
import tangentLineDemo from "../../assets/images/tangent_line_demo.png";
import tetrahedronDemo from "../../assets/images/tetrahedron_demo.png";
import torusDemo from "../../assets/images/torus_demo.png";
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
import DifferenceIcon from "../../components/icons/DifferenceIcon.svelte";
import DodecahedronIcon from "../../components/icons/DodecahedronIcon.svelte";
import EllipseIcon from "../../components/icons/EllipseIcon.svelte";
import GridIcon from "../../components/icons/GridIcon.svelte";
import HexagonIcon from "../../components/icons/HexagonIcon.svelte";
import type { Icon } from "../../components/icons/Icon";
import IcosahedronIcon from "../../components/icons/IcosahedronIcon.svelte";
import ImageIcon from "../../components/icons/ImageIcon.svelte";
import IntersectionIcon from "../../components/icons/IntersectionIcon.svelte";
import JustifyCenterIcon from "../../components/icons/JustifyCenterIcon.svelte";
import JustifyLeftIcon from "../../components/icons/JustifyLeftIcon.svelte";
import JustifyRightIcon from "../../components/icons/JustifyRightIcon.svelte";
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
import UnionIcon from "../../components/icons/UnionIcon.svelte";
import VariableIcon from "../../components/icons/VariableIcon.svelte";
import WaveIcon from "../../components/icons/WaveIcon.svelte";
import { getFonts } from "../system.svelte";
import { property, type Property, type PropertyType, type PropertyValue } from "./property";

export const objectCategories = [
	{ color: "var(--peach)", icon: LineIcon, name: "Line" },
	{ color: "var(--green)", icon: VariableIcon, name: "Math" },
	{ color: "var(--red)", icon: CircleIcon, name: "Shape" },
	{ color: "var(--blue)", icon: CubeIcon, name: "Solid" },
	{ color: "var(--yellow)", icon: PlainTextIcon, name: "Text" },
	{ color: "var(--lavender)", icon: AsteriskIcon, name: "Miscellaneous" },
] as const satisfies { name: string; color: string; icon: Icon }[];

export type ObjectCategoryName = typeof objectCategories extends (infer Category)[] ? (Category extends { name: string } ? Category["name"] : never) : never;

export type ManimObject = Readonly<{
	name: string;
	internalName?: string;
	categories: readonly ObjectCategoryName[];
	icon: Icon;
	demo: string;
	description: string;
	properties: readonly Property[];
	documentation: string[];
	create?: (properties: { [key: string]: unknown }) => string;
	getConstructorName?: (properties: { [key: string]: unknown }) => string;
}>;

export function getObjectCategory(name: ObjectCategoryName) {
	return objectCategories.find(category => category.name === name)!;
}

const VMobjectProperties = [
	{
		name: "Fill Color",
		internalName: "fill_color",
		type: property().color(),
		categories: ["Color"],
		description: "The color that the object is filled in with.",
	},
	{
		name: "Fill Opacity",
		internalName: "fill_opacity",
		type: property().number().percent(),
		categories: ["Color"],
		description: "The opacity of the fill for the object",
	},
	{
		name: "Stroke Color",
		internalName: "stroke_color",
		type: property().color(),
		categories: ["Color"],
		description: "The color of the stroke used to draw this object.",
	},
	{
		name: "Stroke Opacity",
		internalName: "stroke_opacity",
		type: property().number().percent().default(1),
		categories: ["Color"],
		description: "The opacity of the stroke used to draw this object.",
	},
	{
		name: "Stroke Width",
		internalName: "stroke_width",
		type: property().number().default(4),
		categories: ["Color"],
		description: "The width of the stroke used to draw this object.",
	},
	{
		name: "Position",
		function: "move_to",
		type: property().coordinate(),
		description: "The position of where the object is placed.",
		categories: ["Transform"],
	},
	{
		name: "Rotation",
		function: "rotate",
		type: property().number().nonnegative(),
		description: "The counterclockwise rotation of the object.",
		categories: ["Transform"],
	},
	{
		name: "Scale",
		function: "scale",
		type: property().number().positive().default(1),
		description: "The size of the object.",
		categories: ["Transform"],
	},
	{
		name: "Background Stroke Color",
		internalName: "background_stroke_color",
		type: property().color().default("#000000"),
		description: "The color of the object's background stroke.",
		categories: ["Color"],
	},
	{
		name: "Background Stroke Width",
		internalName: "background_stroke_width",
		type: property().number(),
		description: "The thickness of the object's background stroke.",
		categories: ["Color"],
	},
	{ name: "Sheen Factor", internalName: "sheen_factor", type: property().number(), description: "The sheen factor of the object.", categories: ["Color"] },
	{
		name: "Sheen Direction",
		internalName: "sheen_direction",
		type: property().coordinate().default([-1, 1, 0]),
		description: "The direction of the object's sheen.",
		categories: ["Color"],
	},
	{
		name: "Background Image",
		internalName: "background_image",
		type: property().string().notEmpty(),
		description: "The image of the object's background.",
		categories: ["Color"],
	},
	{ name: "Joint Type", internalName: "joint_type", type: property().number(), description: "The type of joint used to connect lines on the object.", categories: ["Details"] },
	{
		name: "Close New Points",
		internalName: "close_new_points",
		type: property().boolean(),
		description: "Whether to close new points on the object.",
		categories: ["Details"],
	},
	{
		name: "Scale Function",
		internalName: "pre_function_handle_to_anchor_scale_factor",
		type: property().number().default(0.01),
		description: "The scale function used on the object.",
		categories: ["Details"],
	},
	{
		name: "Make Smooth",
		internalName: "make_smooth_after_applying_functions",
		type: property().boolean(),
		description: "Whether to make the object smooth after applying functions.",
		categories: ["Details"],
	},
	{
		name: "Point Equality Tolerance",
		internalName: "tolerance_for_point_equality",
		type: property().number().default(1e-6),
		description: "The maximum distance apart two points can be and considered equal.",
		categories: ["Details"],
	},
	{
		name: "Points Per Cubic Curve",
		internalName: "n_points_per_cubic_curve",
		type: property().number().default(4),
		description: "The number of points per cubic curve.",
		categories: ["Details"],
	},
	{
		name: "Cap Style",
		internalName: "cap_style",
		type: property().number(),
		description: "The cap style of the object.",
		categories: ["Details"],
	},
	{
		name: "Shade In 3D",
		internalName: "shade_in_3d",
		type: property().boolean(),
		description: "Whether to shade the object in 3D.",
		categories: ["Details"],
	},
] as const satisfies Property[];

export const objects = [
	{
		name: "Angle",
		categories: ["Line"],
		icon: AngleIcon,
		description: "A geometric angle.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.line.Angle.html"],
		demo: angleDemo,
		properties: [
			{
				name: "Line 1",
				internalName: "line1",
				type: property().object().only("Line"),
				description: "The first line of the angle.",
				categories: ["Special"],
				required: true,
			},
			{
				name: "Line 2",
				internalName: "line2",
				type: property().object().only("Line"),
				description: "The second line of the angle.",
				categories: ["Special"],
				required: true,
			},
			{
				name: "Radius",
				internalName: "radius",
				type: property().number().positive(),
				description: "The radius of the angle arc.",
				categories: ["Special"],
			},
			{
				name: "Quadrant",
				internalName: "quadrant",
				type: property().select().choices("1", "2", "3", "4").default("1"),
				description: "The quadrant to draw the angle in",
				categories: ["Special"],
			},
			{
				name: "Direction",
				internalName: "other_angle",
				type: property().select().choices("Clockwise", "Counterclockwise").default("Counterclockwise"),
				description: "Which side of the angle to draw.",
				categories: ["Special"],
			},
			{
				name: "Dot",
				internalName: "dot",
				type: property().boolean(),
				description: "Whether to draw a dot inside of the angle.",
				categories: ["Special"],
			},
			{
				name: "Dot Radius",
				internalName: "dot_radius",
				type: property().number().positive().requires("Dot"),
				description: "The radius of the dot inside the angle.",
				categories: ["Special"],
			},
			{
				name: "Dot Distance",
				internalName: "dot_distance",
				type: property().number().percent().requires("Dot"),
				description: "The distance between the dot and the angle.",
				categories: ["Special"],
			},
			{
				name: "Dot Color",
				internalName: "dot_color",
				type: property().color().requires("Dot"),
				description: "The color of the dot drawn.",
				categories: ["Special"],
			},
			{
				name: "Elbow",
				internalName: "elbow",
				type: property().boolean(),
				description: "Whether to drawn an elbow in the angle.",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Annular Sector",
		internalName: "AnnularSector",
		categories: ["Shape"],
		icon: AnnularSectorIcon,
		demo: annularSectorDemo,
		description: "An angular slice of an annulus.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.arc.AnnularSector.html"],
		properties: [
			{
				name: "Inner Radius",
				internalName: "inner_radius",
				type: property().number().nonnegative().default(1),
				description: "The radius of the inner circle of the annulus that this sector slices from",
				categories: ["Special"],
			},
			{
				name: "Outer Radius",
				internalName: "outer_radius",
				type: property().number().nonnegative().default(2),
				description: "The radius of the outer circle of the annulus that this sector slices from",
				categories: ["Special"],
			},
			{
				name: "Angle",
				internalName: "angle",
				type: property().number().nonnegative().max(360).default(1.57),
				description: "The elapsed angle to slice the annulus from",
				categories: ["Special"],
			},
			{
				name: "Start Angle",
				internalName: "start_angle",
				type: property().number().nonnegative().max(360).default(0),
				description: "The angle to slice the annulus from",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Annulus",
		categories: ["Shape"],
		icon: AnnulusIcon,
		demo: annulusDemo,
		description: "A ring; The space between two concentric circles.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.arc.Annulus.html"],
		properties: [
			{
				name: "Inner Radius",
				internalName: "inner_radius",
				type: property().number().nonnegative().default(1),
				description: "The radius of the inner circle of the annulus",
				categories: ["Special"],
			},
			{
				name: "Outer Radius",
				internalName: "outer_radius",
				type: property().number().nonnegative().default(2),
				description: "The radius of the outer circle of the annulus",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Arc",
		categories: ["Line"],
		icon: ArcIcon,
		description: "Part of a circle.",
		demo: arcDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.arc.Arc.html"],
		properties: [
			{
				name: "Radius",
				internalName: "radius",
				type: property().number().nonnegative().default(1),
				description: "The radius of the circle that the arc is cut from.",
				categories: ["Special"],
			},
			{ name: "Start Angle", internalName: "start_angle", type: property().number(), description: "The angle that the arc starts at", categories: ["Special"] },
			{ name: "Angle", internalName: "angle", type: property().number().default(1.57), description: "The angle that the arc elapses.", categories: ["Special"] },
			{
				name: "Tip Length",
				internalName: "tip_length",
				type: property().number().nonnegative().default(0.35),
				description: "The length of the tips of the angle.",
				categories: ["Details"],
			},
			{
				name: "Components",
				internalName: "num_components",
				type: property().number().integeric().nonnegative().default(9),
				description: "The number of components in the arc.",
				categories: ["Details"],
			},
			{
				name: "Normal Vector",
				internalName: "normal_vector",
				type: property().coordinate().default([0, 0, 1]),
				description: "The direction of the normal vector of the arc",
				categories: ["Details"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Axes",
		categories: ["Math"],
		icon: PlusIcon,
		description: "Mathematical axis lines.",
		demo: axesDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.graphing.coordinate_systems.Axes.html"],
		properties: [
			{
				name: "X-Length",
				internalName: "x_length",
				description: "The length of the X axis.",
				type: property().number().positive(),
				categories: ["Special"],
			},
			{
				name: "X-Range",
				internalName: "x_range",
				description: "The range of the X axis.",
				type: property().compound().property("Minimum", property().number()).property("Maximum", property().number()).property("Step", property().number()),
				categories: ["Special"],
			},
			{
				name: "Y-Length",
				internalName: "y_length",
				type: property().number().positive(),
				description: "The length of the Y axis.",
				categories: ["Special"],
			},
			{
				name: "Y-Range",
				internalName: "y_range",
				type: property().compound().property("Minimum", property().number()).property("Maximum", property().number()).property("Step", property().number()),
				description: "The range of the Y axis.",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Bar Chart",
		internalName: "BarChart",
		categories: ["Math"],
		icon: BarChartIcon,
		description: "A statistical bar graph.",
		demo: barChartDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.graphing.probability.BarChart.html"],
		properties: [],
	},
	{
		name: "Bounding Polygon",
		internalName: "ConvexHull",
		categories: ["Shape"],
		icon: BoundingPolygonIcon,
		description: "A polygon that connects the outermost points in a group of points.",
		demo: boundingPolygonDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.ConvexHull.html"],
		properties: [
			{
				name: "Points",
				position: 0,
				type: property().list(property().coordinate()).spread().length(property().number().integeric().min(3)),
				description: "The points for the polygon to wrap around.",
				categories: ["Special"],
			},
		],
	},
	{
		name: "Bulleted List",
		internalName: "BulletedList",
		categories: ["Text"],
		icon: BulletedListIcon,
		description: "A list of text items with bullets.",
		demo: bulletedListDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.text.tex_mobject.BulletedList.html"],
		properties: [
			{
				name: "Items",
				type: property().list(property().string()).spread().length(property().number().integeric().min(1)),
				position: 0,
				description: "The items in the list.",
				categories: ["Special"],
				required: true,
			},
		],
	},
	{
		name: "Circle",
		categories: ["Shape"],
		icon: CircleIcon,
		demo: circleDemo,
		description: "All points equidistant from a center point.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.arc.Circle.html"],
		properties: [
			{
				name: "Radius",
				internalName: "radius",
				type: property().number().nonnegative().default(1),
				categories: ["Special"],
				description: "The distance between each point on the circle and the circle's center.",
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Combinator",
		categories: ["Miscellaneous"],
		icon: CombinatorIcon,
		description: "Allows combining two objects in different ways.",
		demo: combinatorDemo,
		properties: [
			{
				name: "Method",
				type: property()
					.select()
					.choices(
						{ name: "Difference", icon: DifferenceIcon, color: "#b4befe" },
						{ name: "Exclusion", icon: IntersectionIcon, color: "#b4befe" },
						{ name: "Intersection", icon: IntersectionIcon, color: "#b4befe" },
						{ name: "Union", icon: UnionIcon, color: "#b4befe" }
					),
				categories: ["Special"],
				description: "The method by which the objects are combined.",
				required: true,
				special: true,
			},
			{
				name: "First Object",
				type: property().object(),
				categories: ["Special"],
				description: "The first object to combine.",
				required: true,
				position: 0,
			},
			{
				name: "Second Object",
				type: property().object(),
				categories: ["Special"],
				description: "The second object to combine.",
				required: true,
				position: 1,
			},
			...VMobjectProperties,
		],
		documentation: [
			"https://docs.manim.community/en/stable/reference/manim.mobject.geometry.boolean_ops.Exclusion.html",
			"https://docs.manim.community/en/stable/reference/manim.mobject.geometry.boolean_ops.Difference.html",
			"https://docs.manim.community/en/stable/reference/manim.mobject.geometry.boolean_ops.Intersection.html",
			"https://docs.manim.community/en/stable/reference/manim.mobject.geometry.boolean_ops.Union.html",
		],
		getConstructorName(properties: { [key: string]: unknown }): string {
			return properties.Method as string;
		},
	},
	{
		name: "Code",
		categories: ["Text"],
		icon: CodeIcon,
		description: "A block of code or script.",
		demo: codeDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.text.code_mobject.Code.html"],
		properties: [],
	},
	{
		name: "Cone",
		categories: ["Solid"],
		icon: ConeIcon,
		description: "The set of all lines between a circle and a point on the axis normal to its center.",
		demo: coneDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.three_dimensions.Cone.html"],
		properties: [],
	},
	{
		name: "Cube",
		categories: ["Solid"],
		icon: CubeIcon,
		demo: cubeDemo,
		description: "A square extruded into 3D space by its side length.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.three_dimensions.Cube.html"],
		properties: [],
	},
	{
		name: "Cylinder",
		categories: ["Solid"],
		icon: CylinderIcon,
		description: "A circle extruded into 3D space.",
		demo: cylinderDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.three_dimensions.Cylinder.html"],
		properties: [],
	},
	{
		name: "Dodecahedron",
		categories: ["Solid"],
		icon: DodecahedronIcon,
		description: "A regular polyhedron with 12 sides.",
		demo: dodecahedronDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.polyhedra.Dodecahedron.html"],
		properties: [],
	},
	{
		name: "Ellipse",
		categories: ["Shape"],
		icon: EllipseIcon,
		demo: ellipseDemo,
		description: "All points with an equal sum of distances from two focal points.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.arc.Ellipse.html"],
		properties: [
			{
				name: "Width",
				internalName: "width",
				type: property().number().positive().default(2),
				description: "The width of the ellipse.",
				categories: ["Special"],
			},
			{
				name: "Height",
				internalName: "height",
				type: property().number().positive().default(1),
				description: "The height of the ellipse.",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Graph",
		internalName: "NumberPlane",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.graphing.coordinate_systems.NumberPlane.html"],
		categories: ["Math"],
		icon: GridIcon,
		demo: graphDemo,
		description: "A mathematical graph.",
		properties: [],
	},
	{
		name: "Group",
		internalName: "VGroup",
		categories: ["Miscellaneous"],
		icon: PackageIcon,
		description: "A group of other objects, allowing animating them at the same time.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.types.vectorized_mobject.VGroup.html"],
		demo: groupDemo,
		properties: [
			{
				name: "Group in Hierarchy",
				type: property().boolean().default(true),
				categories: ["Special"],
				description: "Whether to visually group objects in the hierarchy under this group. Objects can only be grouped in one such group.",
				special: true,
			},
			{
				name: "Objects",
				type: property().list(property().object()).unique().spread(),
				required: true,
				categories: ["Special"],
				description: "The objects in this group.",
				position: 0,
			},
		],
	},
	{
		name: "Icosahedron",
		categories: ["Solid"],
		icon: IcosahedronIcon,
		description: "A regular polyhedron with 20 sides.",
		demo: icosahedronDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.polyhedra.Icosahedron.html"],
		properties: [],
	},
	{
		name: "Image",
		internalName: "ImageMobject",
		categories: ["Miscellaneous"],
		icon: ImageIcon,
		description: "An image loaded from a file.",
		demo: imageDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.types.image_mobject.ImageMobject.html"],
		properties: [
			{
				name: "Location",
				type: property().string().path(),
				categories: ["Special"],
				special: true,
				description: "The path to the image",
			},
			{
				name: "Image",
				type: property().string(),
				categories: ["Special"],
				special: true,
				description: "The path to the image",
			},
		],
	},
	{
		name: "Line",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.line.Line.html"],
		categories: ["Line"],
		icon: LineIcon,
		description: "A customizeable line.",
		demo: lineDemo,
		properties: [],
	},
	{
		name: "Equation",
		internalName: "MathTex",
		categories: ["Text", "Math"],
		icon: VariableIcon,
		description: "A mathematical equation formatted with LaTeX",
		demo: mathTextDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.text.tex_mobject.MathTex.html"],
		properties: [
			{
				name: "Equation",
				type: property().string().notEmpty().math(),
				categories: ["Special"],
				description: "The equation itself.",
				required: true,
				position: 0,
			},
		],
	},
	{
		name: "Network",
		internalName: "Graph",
		categories: ["Line"],
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.graph.Graph.html"],
		icon: NetworkIcon,
		description: "A connected graph of node points.",
		demo: networkDemo,
		properties: [],
	},
	{
		name: "Octahedron",
		categories: ["Solid"],
		description: "A regular polyhedron with 8 sides.",
		icon: OctahedronIcon,
		demo: octahedronDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.polyhedra.Octahedron.html"],
		properties: [],
	},
	{
		name: "Paragraph",
		categories: ["Text"],
		icon: ParagraphIcon,
		description: "Text with multiple lines.",
		demo: paragraphDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.text.text_mobject.Paragraph.html"],
		properties: [
			{
				name: "Text",
				internalName: "text",
				type: property().list(property().string()).length(property().number().integeric().min(1)).spread(),
				categories: ["Special"],
				required: true,
				description: "The lines of text to display.",
			},
			{
				name: "Line Spacing",
				internalName: "line_spacing",
				type: property().number().default(-1),
				categories: ["Special"],
				description: "The spacing between the lines of the text.",
			},
			{
				name: "Justify",
				internalName: "alignment",
				type: property()
					.select()
					.choices(
						{ name: "left", icon: JustifyLeftIcon, color: "var(--yellow)" },
						{ name: "right", icon: JustifyRightIcon, color: "var(--yellow)" },
						{ name: "center", icon: JustifyCenterIcon, color: "var(--yellow)" }
					),
				categories: ["Special"],
				description: "The justification of the text.",
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Text",
		categories: ["Text"],
		icon: PlainTextIcon,
		internalName: "Text",
		description: "Plain text.",
		demo: plainTextDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.text.text_mobject.Text.html"],
		properties: [
			{
				name: "Text",
				internalName: "text",
				type: property().string().notEmpty(),
				categories: ["Special"],
				required: true,
				description: "The text to display",
			},
			{
				name: "Parts",
				type: property().list(
					property()
						.compound()
						.property("Text", property().string().notEmpty())
						.property(
							"Style",
							property()
								.compound()
								.property("Bold", property().boolean())
								.property("Italic", property().boolean())
								.property("Underline", property().boolean())
								.property("Strikethrough", property().boolean())
								.property("Color", property().color())
						)
				),
				special: true,
				description: "The parts of the text.",
				categories: ["Special"],
			},
			{
				name: "Line Spacing",
				internalName: "line_spacing",
				type: property().number().default(-1),
				categories: ["Special"],
				description: "The spacing between the lines of the text.",
			},
			{
				name: "Tab Width",
				internalName: "tab_width",
				type: property().number().integeric().nonnegative().default(4),
				categories: ["Details"],
				description: "The amount of spaces to render a tab character as.",
			},
			{
				name: "Align To Center",
				internalName: "should_center",
				type: property().boolean(),
				categories: ["Details"],
				description: "Whether to center-justify the text.",
			},
			{
				name: "Font",
				type: property()
					.select()
					.choices(...(await getFonts()).map(font => ({ name: font, style: `font-family: "${font}"` }))),
				description: "The font of the text.",
				categories: ["Special"],
				internalName: "font",
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Polygon",
		categories: ["Shape"],
		icon: PolygonIcon,
		demo: polygonDemo,
		description: "A set of points connected by straight lines.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.Polygon.html"],
		properties: [
			{
				name: "Vertices",
				position: 0,
				type: property().list(property().coordinate()).length(property().number().integeric().min(3)).spread(),
				categories: ["Special"],
				description: "The width of the rectangle.",
				required: true,
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Polygram",
		categories: ["Shape"],
		icon: NetworkIcon,
		description: "A polygon with intersecting edges.",
		demo: circleDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.Polygram.html"],
		properties: [
			{
				name: "Vertex Groups",
				position: 0,
				type: property()
					.list(property().list(property().coordinate()).length(property().number().integeric().min(3)))
					.length(property().number().integeric().min(1))
					.spread(),
				description: "The sets of closed points of the polygram.",
				categories: ["Special"],
				required: true,
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Rectangle",
		categories: ["Shape"],
		icon: RectangleIcon,
		demo: rectangleDemo,
		description: "A quadrilateral with four right angles.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.Rectangle.html"],
		properties: [
			{
				name: "Width",
				internalName: "width",
				type: property().number().positive().default(4),
				categories: ["Special"],
				description: "The width of the rectangle.",
			},
			{
				name: "Height",
				internalName: "height",
				type: property().number().positive().default(2),
				categories: ["Special"],
				description: "The height of the rectangle.",
			},
			{
				name: "Horizontal Grid Spacing",
				internalName: "grid_xstep",
				type: property().number().nonnegative(),
				categories: ["Details"],
				description: "The spacing of horizontal grid lines.",
			},
			{
				name: "Vertical Grid Spacing",
				internalName: "grid_ystep",
				type: property().number().nonnegative(),
				categories: ["Details"],
				description: "The spacing of vertical grid lines.",
			},
			{
				name: "Corner Radius",
				internalName: "corner_radius",
				type: property().number().nonnegative(),
				description: "The rounding of the rectangles corners.",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
		getConstructorName(properties: { [key: string]: unknown }) {
			return properties["Corner Radius"] !== undefined ? "RoundedRectangle" : "Rectangle";
		},
	},
	{
		name: "Rectangular Prism",
		internalName: "Prism",
		categories: ["Solid"],
		description: "A rectangle extruded into 3D space.",
		icon: RectangularPrismIcon,
		demo: rectangularPrismDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.three_dimensions.Prism.html"],
		properties: [],
	},
	{
		name: "Regular Polygon",
		internalName: "RegularPolygon",
		categories: ["Shape"],
		icon: HexagonIcon,
		demo: regularPolygonDemo,
		description: "A polygon with any number of equal sides and angles.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.RegularPolygon.html"],
		properties: [
			{
				name: "Number of Sides",
				internalName: "n",
				type: property().number().integeric().min(3).default(6),
				description: "The number of sides the regular polygon has.",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Regular Polygram",
		internalName: "RegularPolygram",
		categories: ["Shape"],
		icon: StarOfDavidIcon,
		demo: regularPolygramDemo,
		description: "A polygram with any number of equal sides and angles.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.RegularPolygram.html"],
		properties: [
			{
				name: "Number of Vertices",
				internalName: "num_vertices",
				type: property().number().integeric().min(3),
				description: "The number of vertices the regular polygram has.",
				categories: ["Special"],
				required: true,
			},
			{
				name: "Radius",
				internalName: "radius",
				type: property().number().positive().default(1),
				description: "The radius of the regular polygram.",
				categories: ["Special"],
			},
			{
				name: "Density",
				internalName: "density",
				type: property().number().positive().integeric().default(2),
				description: "The number of vertices to jump before connecting them.",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Scripted Object",
		categories: ["Miscellaneous"],
		icon: CodeIcon,
		description: "An object custom scripted in Python.",
		demo: circleDemo,
		documentation: ["https://github.com/vi013t/manim-interactive/docs/scripted-objects.md"],
		properties: [],
	},
	{
		name: "Sector",
		categories: ["Shape"],
		icon: SectorIcon,
		demo: sectorDemo,
		description: "All points equidistant from a center point.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.arc.Sector.html"],
		properties: [
			{
				name: "Radius",
				internalName: "radius",
				type: property().number().positive().default(1),
				description: "The radius of the circle the sector is cut from.",
				categories: ["Special"],
			},
			{
				name: "Angle",
				internalName: "angle",
				type: property().number().nonnegative().max(360).default(1.57),
				description: "The elapsed angle to slice the annulus from",
				categories: ["Special"],
			},
			{
				name: "Start Angle",
				internalName: "start_angle",
				type: property().number().nonnegative().max(360).default(0),
				description: "The angle to slice the annulus from",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Sphere",
		categories: ["Solid"],
		icon: SphereIcon,
		description: "All three-dimensional points equidistant from a center point.",
		demo: sphereDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.three_dimensions.Sphere.html"],
		properties: [],
	},
	{
		name: "Square",
		categories: ["Shape"],
		icon: SquareIcon,
		demo: squareDemo,
		description: "A rectangle with equal side lengths.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.Square.html"],
		properties: [
			{
				name: "Side Length",
				internalName: "side_length",
				type: property().number().positive().default(2),
				description: "The width of the ellipse.",
				categories: ["Special"],
			},
			...VMobjectProperties,
		],
	},
	{
		name: "Star",
		categories: ["Shape"],
		icon: StarIcon,
		demo: starDemo,
		description: "A regular polygram without intersecting lines.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.Star.html"],
		properties: [
			{
				name: "Number of Points",
				internalName: "n",
				type: property().number().integeric().positive(),
				categories: ["Special"],
				description: "The number of points the star has.",
			},
			{
				name: "Outer Radius",
				internalName: "outer_radius",
				type: property().number().nonnegative().default(1),
				description: "The outer radius of the star.",
				categories: ["Special"],
			},
			{
				name: "Inner Radius",
				internalName: "outer_radius",
				type: property().number().nonnegative(),
				description: "The inner radius of the star.",
				categories: ["Special"],
			},
			{
				name: "Density",
				internalName: "density",
				type: property().number().integeric().positive().default(2),
				description: "The point density of the star.",
				categories: ["Details"],
			},
			{ name: "Start Angle", internalName: "start_angle", type: property().number().default(1.57), description: "The starting angle of the star.", categories: ["Details"] },
			...VMobjectProperties,
		],
	},
	{
		name: "Stream Lines",
		categories: ["Math"],
		icon: WaveIcon,
		demo: streamLinesDemo,
		description: "A visualization of flow in a vector field.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.vector_field.StreamLines.html"],
		properties: [],
	},
	{
		name: "Tangent Line",
		internalName: "TangentLine",
		description: "A line tangent to an object at some point.",
		categories: ["Line"],
		icon: LineIcon,
		demo: tangentLineDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.line.TangentLine.html"],
		properties: [],
	},
	{
		name: "Tetrahedron",
		description: "A regular polyhedron with 4 sides.",
		categories: ["Solid"],
		icon: TetrahedronIcon,
		demo: tetrahedronDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.polyhedra.Tetrahedron.html"],
		properties: [],
	},
	{
		name: "Torus",
		description: "A circle revolved around a coplanar axis.",
		categories: ["Solid"],
		icon: TorusIcon,
		demo: torusDemo,
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.three_d.three_dimensions.Torus.html"],
		properties: [],
	},
	{
		name: "Triangle",
		categories: ["Shape"],
		icon: TriangleIcon,
		demo: triangleDemo,
		description: "A regular polygon with three sides.",
		documentation: ["https://docs.manim.community/en/stable/reference/manim.mobject.geometry.polygram.Triangle.html"],
		properties: [...VMobjectProperties],
	},
] as const satisfies ManimObject[];

export type ObjectPropertyName =
	| "Object Type"
	| "Name"
	| (typeof objects extends (infer O)[] ? (O extends { readonly properties: readonly (infer P)[] } ? (P extends { name: string } ? P["name"] : never) : never) : never);

export type ObjectPropertyValue<Name extends ObjectPropertyName> = typeof objects extends (infer O)[]
	? O extends { readonly properties: readonly (infer P)[] }
		? P extends { name: Name; type: infer T }
			? T extends PropertyType
				? PropertyValue<T>
				: never
			: never
		: never
	: never;

export type ObjectProperty = Omit<Property, "name"> & { name: ObjectPropertyName };
export type ObjectProperties = { [Key in Exclude<ObjectPropertyName, "Object Type" | "Name">]?: ObjectPropertyValue<Key> } & { "Object Type": string; Name: string };
