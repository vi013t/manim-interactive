import type { Component } from "svelte";
import appearDemo from "../../assets/videos/appear_demo.mp4";
import backspaceDemo from "../../assets/videos/backspace_demo.mp4";
import blinkDemo from "../../assets/videos/blink_demo.mp4";
import circumscribeDemo from "../../assets/videos/circumscribe_demo.mp4";
import createDemo from "../../assets/videos/create_demo.mp4";
import cyclicReplaceDemo from "../../assets/videos/cyclic_replace_demo.mp4";
import destroyDemo from "../../assets/videos/destroy_demo.mp4";
import disappearDemo from "../../assets/videos/disappear_demo.mp4";
import drawBorderThenFillDemo from "../../assets/videos/draw_border_then_fill_demo.mp4";
import eraseDemo from "../../assets/videos/erase_demo.mp4";
import fadeInDemo from "../../assets/videos/fade_in_demo.mp4";
import fadeOutDemo from "../../assets/videos/fade_out_demo.mp4";
import fadeTransformDemo from "../../assets/videos/fade_transform_demo.mp4";
import flashDemo from "../../assets/videos/flash_demo.mp4";
import focusDemo from "../../assets/videos/focus_demo.mp4";
import growInDemo from "../../assets/videos/grow_in_demo.mp4";
import indicateDemo from "../../assets/videos/indicate_demo.mp4";
import passingFlashDemo from "../../assets/videos/passing_flash_demo.mp4";
import restoreDemo from "../../assets/videos/restore_demo.mp4";
import scaleDemo from "../../assets/videos/scale_demo.mp4";
import shrinkAwayDemo from "../../assets/videos/shrink_away_demo.mp4";
import spiralInDemo from "../../assets/videos/spiral_in_demo.mp4";
import typeDemo from "../../assets/videos/type_demo.mp4";
import waveDemo from "../../assets/videos/wave_demo.mp4";
import wiggleDemo from "../../assets/videos/wiggle_demo.mp4";
import writeDemo from "../../assets/videos/write_demo.mp4";
import AsteriskIcon from "../../components/icons/AsteriskIcon.svelte";
import BlinkIcon from "../../components/icons/BlinkIcon.svelte";
import BorderIcon from "../../components/icons/BorderIcon.svelte";
import CircledLightningIcon from "../../components/icons/CircledLightningIcon.svelte";
import ClockIcon from "../../components/icons/ClockIcon.svelte";
import CycleIcon from "../../components/icons/CycleIcon.svelte";
import EraserIcon from "../../components/icons/EraserIcon.svelte";
import FadeInIcon from "../../components/icons/FadeInIcon.svelte";
import FadeOutIcon from "../../components/icons/FadeOutIcon.svelte";
import IncompleteCircle from "../../components/icons/IncompleteCircle.svelte";
import LightningIcon from "../../components/icons/LightningIcon.svelte";
import MegaphoneIcon from "../../components/icons/MegaphoneIcon.svelte";
import MinimizeIcon from "../../components/icons/MinimizeIcon.svelte";
import PencilIcon from "../../components/icons/PencilIcon.svelte";
import PlainTextIcon from "../../components/icons/PlainTextIcon.svelte";
import PlantIcon from "../../components/icons/PlantIcon.svelte";
import PlusIcon from "../../components/icons/PlusIcon.svelte";
import ReplaceIcon from "../../components/icons/ReplaceIcon.svelte";
import ReticleIcon from "../../components/icons/ReticleIcon.svelte";
import RevertIcon from "../../components/icons/RevertIcon.svelte";
import ScaleIcon from "../../components/icons/ScaleIcon.svelte";
import ShrinkIcon from "../../components/icons/ShrinkIcon.svelte";
import SparkleIcon from "../../components/icons/SparkleIcon.svelte";
import SpiralIcon from "../../components/icons/SpiralIcon.svelte";
import TransformIcon from "../../components/icons/TransformIcon.svelte";
import TrashIcon from "../../components/icons/TrashIcon.svelte";
import WaveIcon from "../../components/icons/WaveIcon.svelte";
import WiggleIcon from "../../components/icons/WiggleIcon.svelte";
import { property, type Property } from "./property";

export type ManimAnimation = {
	name: string;
	category: AnimationCategoryName;
	icon: Component<{ stroke: string; [key: string]: unknown }>;
	properties: Property[];
	description: string;
	demo: string;
	internalName?: string;
};

export const animationCategories = [
	{ color: "var(--green)", name: "Create", icon: PlusIcon },
	{ color: "var(--red)", name: "Destroy", icon: TrashIcon },
	{ color: "var(--yellow)", name: "Highlight", icon: SparkleIcon },
	{ color: "var(--blue)", name: "Transform", icon: TransformIcon },
	{ color: "var(--overlay-2)", name: "Miscellaneous", icon: AsteriskIcon },
] as const satisfies { name: string; color: string; icon: Component<{ stroke: string; [key: string]: unknown }> }[];

export function getAnimationCategory(name: AnimationCategoryName) {
	return animationCategories.find(category => category.name === name)!;
}

export function getManimAnimationByName(name: string): ManimAnimation | null {
	return animations.find(manimAnimation => manimAnimation.name === name) ?? null;
}

export type AnimationCategoryName = typeof animationCategories extends (infer Category)[] ? (Category extends { name: unknown } ? Category["name"] : never) : never;

const singleObjectProperties = [
	{
		name: "Duration",
		categories: ["Timing"],
		description: "The duration of the animation",
		internalName: "run_time",
		type: property().number().nonnegative().default(1),
		required: true,
	},
	{
		name: "Object",
		categories: ["Special"],
		description: "The object to animate",
		position: 0,
		type: property().object(),
		required: true,
	},
	{
		name: "Start Time",
		categories: ["Timing"],
		description: "The starting time of the animation",
		special: true,
		type: property().number().nonnegative(),
		required: true,
	},
	{
		name: "Rate Function",
		internalName: "rate_function",
		type: property()
			.select()
			.choices(
				"Sigmoid",
				"Linear",
				"Smooth",
				"Smooth Step",
				"Smoother Step",
				"Rush Into",
				"Rush From",
				"Slow Into",
				"Double Smooth",
				"There And Back",
				"There And Back With Pause",
				"Running Start",
				"Wiggle",
				"Lingering",
				"Exponential Decay",
				"Ease In Sine",
				"Ease Out Sine",
				"Ease In Quad",
				"Ease Out Quad",
				"Ease In Cubic",
				"Ease Out Cubic",
				"Ease In Out Cubic",
				"Ease In Quartic",
				"Ease Out Quartic",
				"Ease In Out Quartic",
				"Ease In Quintic",
				"Ease Out Quintic",
				"Ease In Out Quintic",
				"Ease In Exponential",
				"Ease Out Exponential",
				"Ease In Out Exponential",
				"Ease In Circular",
				"Ease Out Circular",
				"Ease In Out Circular",
				"Ease In Back",
				"Ease Out Back",
				"Ease In Out Back",
				"Ease In Elastic",
				"Ease Out Elastic",
				"Ease In Out Elastic",
				"Ease In Bounce",
				"Ease Out Bounce",
				"Ease In Out Bounce"
			)
			.default("Smooth")
			.codegen(value => {
				return (
					"rate_functions." +
					{
						Sigmoid: "sigmoid",
						Linear: "linear",
						Smooth: "smooth",
						"Smooth Step": "smoothstep",
						"Smoother Step": "smootherstep",
						"Rush Into": "rush_into",
						"Rush From": "rush_from",
						"Slow Into": "slow_into",
						"Double Smooth": "double_smooth",
						"There And Back": "there_and_back",
						"There And Back With Pause": "there_and_back_with_pause",
						"Running Start": "running_start",
						Wiggle: "wiggle",
						Lingering: "lingering",
						"Exponential Decay": "exponential_decay",
						"Ease In Sine": "ease_in_sine",
						"Ease Out Sine": "ease_out_sine",
						"Ease In Out Sine": "ease_in_out_sine",
						"Ease In Quadratic": "ease_in_quad",
						"Ease Out Quadratic": "ease_out_quad",
						"Ease In Out Quadratic": "ease_in_out_quad",
						"Ease In Cubic": "ease_in_cubic",
						"Ease Out Cubic": "ease_out_cubic",
						"Ease In Out Cubic": "ease_in_out_cubic",
						"Ease In Quartic": "ease_in_quart",
						"Ease Out Quartic": "ease_out_quart",
						"Ease In Out Quartic": "ease_in_out_quart",
						"Ease In Quintic": "ease_in_quint",
						"Ease Out Quintic": "ease_out_quint",
						"Ease In Out Quintic": "ease_in_out_quint",
						"Ease In Exponential": "ease_in_expo",
						"Ease Out Exponential": "ease_out_expo",
						"Ease In Out Exponential": "ease_in_out_expo",
						"Ease In Circular": "ease_in_circ",
						"Ease Out Circular": "ease_out_circ",
						"Ease In Out Circular": "ease_in_out_circ",
						"Ease In Back": "ease_in_back",
						"Ease Out Back": "ease_out_back",
						"Ease In Out Back": "ease_in_out_back",
						"Ease In Elastic": "ease_in_elastic",
						"Ease Out Elastic": "ease_out_elastic",
						"Ease In Out Elastic": "ease_in_out_elastic",
						"Ease In Bounce": "ease_in_bounce",
						"Ease Out Bounce": "ease_out_bounce",
						"Ease In Out Bounce": "ease_in_out_bounce",
					}[value]
				);
			}),
		categories: ["Timing"],
		description: "The easing of the animation",
	},
] as const satisfies Property[];

export const animations = [
	{
		name: "Appear",
		category: "Create",
		description: "Add an object without any kind of animation.",
		icon: SparkleIcon,
		demo: appearDemo,
		internalName: "Add",
		properties: [...singleObjectProperties],
	},
	{
		name: "Backspace",
		category: "Destroy",
		description: "Delete text one letter at a time.",
		icon: PlainTextIcon,
		demo: backspaceDemo,
		internalName: "RemoveTextLetterByLetter",
		properties: [...singleObjectProperties],
	},
	{
		name: "Blink",
		category: "Highlight",
		description: "Flicker an object.",
		demo: blinkDemo,
		icon: BlinkIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Circumscribe",
		category: "Highlight",
		description: "Draw a shape around an object.",
		demo: circumscribeDemo,
		icon: IncompleteCircle,
		properties: [...singleObjectProperties],
	},
	{
		name: "Create",
		category: "Create",
		description: "Incrementally show an object.",
		demo: createDemo,
		icon: PlusIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Cyclic Replace",
		category: "Transform",
		description: "Cycle objects in a group.",
		demo: cyclicReplaceDemo,
		icon: CycleIcon,
		internalName: "CyclicReplace",
		properties: [...singleObjectProperties],
	},
	{
		name: "Destroy",
		category: "Destroy",
		description: "Incrementally remove an object.",
		internalName: "Uncreate",
		demo: destroyDemo,
		icon: MinimizeIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Disappear",
		category: "Destroy",
		description: "Remove an object with no animation.",
		demo: disappearDemo,
		icon: SparkleIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Draw Border Then Fill",
		category: "Create",
		description: "Draw an object's border, then fill it in.",
		demo: drawBorderThenFillDemo,
		icon: BorderIcon,
		internalName: "DrawBorderThenFill",
		properties: [...singleObjectProperties],
	},
	{
		name: "Erase",
		category: "Destroy",
		demo: eraseDemo,
		description: "Erase text away like handwriting.",
		icon: EraserIcon,
		internalName: "Unwrite",
		properties: [...singleObjectProperties],
	},
	{
		name: "Fade In",
		category: "Create",
		demo: fadeInDemo,
		description: "Fade an object in from nothing.",
		icon: FadeInIcon,
		internalName: "FadeIn",
		properties: [...singleObjectProperties],
	},
	{
		name: "Fade Out",
		category: "Destroy",
		description: "Fade an object away into nothing.",
		demo: fadeOutDemo,
		icon: FadeOutIcon,
		internalName: "FadeOut",
		properties: [...singleObjectProperties],
	},
	{
		name: "Fade Transform",
		category: "Transform",
		description: "Fade one object into another object.",
		demo: fadeTransformDemo,
		icon: FadeOutIcon,
		internalName: "FadeTransform",
		properties: [...singleObjectProperties],
	},
	{
		name: "Flash",
		category: "Highlight",
		description: "Flash lines around an object.",
		demo: flashDemo,
		icon: LightningIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Focus",
		category: "Highlight",
		description: "Draw focus to an object.",
		demo: focusDemo,
		icon: ReticleIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Grow In",
		category: "Create",
		icon: PlantIcon,
		description: "Grow an object in from nothing.",
		demo: growInDemo,
		internalName: "GrowFromCenter",
		properties: [...singleObjectProperties],
	},
	{
		name: "Indicate",
		category: "Highlight",
		description: "Highlight and expand an object.",
		demo: indicateDemo,
		icon: MegaphoneIcon,
		properties: [...singleObjectProperties],
	},
	// {
	// 	name: "Move To Target",
	// 	category: "Transform",
	// 	icon: TargetIcon,
	// 	properties: [objectProperty],
	// },
	{
		name: "Passing Flash",
		category: "Highlight",
		description: "Show a passing flash over an object.",
		demo: passingFlashDemo,
		icon: CircledLightningIcon,
		internalName: "ShowPassingFlash",
		properties: [...singleObjectProperties],
	},
	{
		name: "Replacement Transform",
		category: "Transform",
		description: "Transforms one object into another, replacing it.",
		icon: ReplaceIcon,
		internalName: "ReplacementTransform",
		properties: [...singleObjectProperties],
	},
	{
		name: "Restore",
		category: "Transform",
		description: "Restore an object to a previously saved state.",
		demo: restoreDemo,
		icon: RevertIcon,
		properties: [...singleObjectProperties],
	},
	// {
	// 	name: "Rotate",
	// 	category: "Transform",
	// 	description: "Rotate an object.",
	// 	demo: rotateDemo,
	// 	icon: RotateIcon,
	// 	properties: [objectProperty],
	// },
	{
		name: "Scale",
		category: "Transform",
		description: "Change the size of an object.",
		demo: scaleDemo,
		icon: ScaleIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Shrink Away",
		category: "Destroy",
		description: "Shrink an object away into nothing.",
		demo: shrinkAwayDemo,
		icon: ShrinkIcon,
		internalName: "ShrinkToCenter",
		properties: [...singleObjectProperties],
	},
	{
		name: "Spiral In",
		category: "Create",
		description: "Creates a group by spiraling in its objects.",
		demo: spiralInDemo,
		icon: SpiralIcon,
		internalName: "SpiralIn",
		properties: [...singleObjectProperties],
	},
	{
		name: "Transform",
		category: "Transform",
		description: "Transforms one object into another.",
		icon: TransformIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Type",
		category: "Create",
		description: "Add text in one letter at a time.",
		demo: typeDemo,
		icon: PlainTextIcon,
		internalName: "AddTextLetterByLetter",
		properties: [...singleObjectProperties],
	},
	{
		name: "Wait",
		category: "Miscellaneous",
		description: "Wait for some time and do nothing in between animations",
		demo: focusDemo,
		icon: ClockIcon,
		properties: [
			{
				name: "Duration",
				categories: ["Timing"],
				description: "The duration of the animation",
				internalName: "run_time",
				type: property().number().nonnegative().default(1),
				required: true,
			},
			{
				name: "Start Time",
				categories: ["Timing"],
				description: "The starting time of the animation",
				special: true,
				type: property().number().nonnegative(),
				required: true,
			},
		],
	},
	{
		name: "Wave",
		category: "Highlight",
		description: "Apply a wave effect to an object.",
		demo: waveDemo,
		icon: WaveIcon,
		internalName: "ApplyWave",
		properties: [...singleObjectProperties],
	},
	{
		name: "Wiggle",
		category: "Highlight",
		description: "Wiggle an object.",
		demo: wiggleDemo,
		icon: WiggleIcon,
		properties: [...singleObjectProperties],
	},
	{
		name: "Write",
		category: "Create",
		demo: writeDemo,
		description: "Write text in like handwriting.",
		icon: PencilIcon,
		properties: [...singleObjectProperties],
	},
] as const satisfies ManimAnimation[];

export type AnimationPropertyName =
	| "Animation Type"
	| "Name"
	| (typeof animations extends (infer A)[] ? (A extends { properties: (infer P)[] } ? (P extends { name: string } ? P["name"] : never) : never) : never);

export type AnimationProperty = Omit<Property, "name"> & { name: AnimationPropertyName };
