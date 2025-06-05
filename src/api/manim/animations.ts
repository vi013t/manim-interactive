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
import type { Property } from "./property";

export type ManimAnimation = {
	name: string;
	category: AnimationCategoryName;
	icon: Component<{ stroke: string; [key: string]: unknown }>;
	properties: Property[];
	description?: string;
	demo?: string;
	internalName?: string;
};

export const animationCategories = [
	{ color: "#a6e3a1", name: "Create", icon: PlusIcon },
	{ color: "#f38ba8", name: "Destroy", icon: TrashIcon },
	{ color: "#f9e2af", name: "Highlight", icon: SparkleIcon },
	{ color: "#89b4fa", name: "Transform", icon: TransformIcon },
	{ color: "#9399b2", name: "Miscellaneous", icon: AsteriskIcon },
] as const satisfies { name: string; color: string; icon: Component<{ stroke: string; [key: string]: unknown }> }[];

export function getAnimationCategory(name: AnimationCategoryName) {
	return animationCategories.find(category => category.name === name)!;
}

export function getManimAnimationByName(name: string): ManimAnimation | null {
	return animations.find(animation => animation.name === name) ?? null;
}

export type AnimationCategoryName = typeof animationCategories extends (infer Category)[] ? (Category extends { name: unknown } ? Category["name"] : never) : never;

export const animations = [
	{
		name: "Appear",
		category: "Create",
		description: "Add an object without any kind of animation.",
		icon: SparkleIcon,
		demo: appearDemo,
		internalName: "Add",
		properties: [],
	},
	{
		name: "Backspace",
		category: "Destroy",
		description: "Delete text one letter at a time.",
		icon: PlainTextIcon,
		demo: backspaceDemo,
		internalName: "RemoveTextLetterByLetter",
		properties: [],
	},
	{
		name: "Blink",
		category: "Highlight",
		description: "Flicker an object.",
		demo: blinkDemo,
		icon: BlinkIcon,
		properties: [],
	},
	{
		name: "Circumscribe",
		category: "Highlight",
		description: "Draw a shape around an object.",
		demo: circumscribeDemo,
		icon: IncompleteCircle,
		properties: [],
	},
	{
		name: "Create",
		category: "Create",
		description: "Incrementally show an object.",
		demo: createDemo,
		icon: PlusIcon,
		properties: [],
	},
	{
		name: "Cyclic Replace",
		category: "Transform",
		description: "Cycle objects in a group.",
		demo: cyclicReplaceDemo,
		icon: CycleIcon,
		internalName: "CyclicReplace",
		properties: [],
	},
	{
		name: "Destroy",
		category: "Destroy",
		description: "Incrementally remove an object.",
		internalName: "Uncreate",
		demo: destroyDemo,
		icon: MinimizeIcon,
		properties: [],
	},
	{
		name: "Disappear",
		category: "Destroy",
		description: "Remove an object with no animation.",
		demo: disappearDemo,
		icon: SparkleIcon,
		properties: [],
	},
	{
		name: "Draw Border Then Fill",
		category: "Create",
		description: "Draw an object's border, then fill it in.",
		demo: drawBorderThenFillDemo,
		icon: BorderIcon,
		internalName: "DrawBorderThenFill",
		properties: [],
	},
	{
		name: "Erase",
		category: "Destroy",
		demo: eraseDemo,
		description: "Erase text away like handwriting.",
		icon: EraserIcon,
		internalName: "Unwrite",
		properties: [],
	},
	{
		name: "Fade In",
		category: "Create",
		demo: fadeInDemo,
		description: "Fade an object in from nothing.",
		icon: FadeInIcon,
		internalName: "FadeIn",
		properties: [],
	},
	{
		name: "Fade Out",
		category: "Destroy",
		description: "Fade an object away into nothing.",
		demo: fadeOutDemo,
		icon: FadeOutIcon,
		internalName: "FadeOut",
		properties: [],
	},
	{
		name: "Fade Transform",
		category: "Transform",
		description: "Fade one object into another object.",
		demo: fadeTransformDemo,
		icon: FadeOutIcon,
		internalName: "FadeTransform",
		properties: [],
	},
	{
		name: "Flash",
		category: "Highlight",
		description: "Flash lines around an object.",
		demo: flashDemo,
		icon: LightningIcon,
		properties: [],
	},
	{
		name: "Focus",
		category: "Highlight",
		description: "Draw focus to an object.",
		demo: focusDemo,
		icon: ReticleIcon,
		properties: [],
	},
	{
		name: "Grow In",
		category: "Create",
		icon: PlantIcon,
		description: "Grow an object in from nothing.",
		demo: growInDemo,
		internalName: "GrowFromCenter",
		properties: [],
	},
	{
		name: "Indicate",
		category: "Highlight",
		description: "Highlight and expand an object.",
		demo: indicateDemo,
		icon: MegaphoneIcon,
		properties: [],
	},
	// {
	// 	name: "Move To Target",
	// 	category: "Transform",
	// 	icon: TargetIcon,
	// 	properties: [],
	// },
	{
		name: "Passing Flash",
		category: "Highlight",
		description: "Show a passing flash over an object.",
		demo: passingFlashDemo,
		icon: CircledLightningIcon,
		internalName: "ShowPassingFlash",
		properties: [],
	},
	{
		name: "Replacement Transform",
		category: "Transform",
		icon: ReplaceIcon,
		internalName: "ReplacementTransform",
		properties: [],
	},
	{
		name: "Restore",
		category: "Transform",
		description: "Restore an object to a previously saved state.",
		demo: restoreDemo,
		icon: RevertIcon,
		properties: [],
	},
	// {
	// 	name: "Rotate",
	// 	category: "Transform",
	// 	description: "Rotate an object.",
	// 	demo: rotateDemo,
	// 	icon: RotateIcon,
	// 	properties: [],
	// },
	{
		name: "Scale",
		category: "Transform",
		description: "Change the size of an object.",
		demo: scaleDemo,
		icon: ScaleIcon,
		properties: [],
	},
	{
		name: "Shrink Away",
		category: "Destroy",
		description: "Shrink an object away into nothing.",
		demo: shrinkAwayDemo,
		icon: ShrinkIcon,
		internalName: "ShrinkToCenter",
		properties: [],
	},
	{
		name: "Spiral In",
		category: "Create",
		description: "Creates a group by spiraling in its objects.",
		demo: spiralInDemo,
		icon: SpiralIcon,
		internalName: "SpiralIn",
		properties: [],
	},
	{
		name: "Transform",
		category: "Transform",
		icon: TransformIcon,
		properties: [],
	},
	{
		name: "Type",
		category: "Create",
		description: "Add text in one letter at a time.",
		demo: typeDemo,
		icon: PlainTextIcon,
		internalName: "AddTextLetterByLetter",
		properties: [],
	},
	{
		name: "Wait",
		category: "Miscellaneous",
		description: "Wait for some time and do nothing in between animations",
		demo: focusDemo,
		icon: ClockIcon,
		properties: [],
	},
	{
		name: "Wave",
		category: "Highlight",
		description: "Apply a wave effect to an object.",
		demo: waveDemo,
		icon: WaveIcon,
		internalName: "ApplyWave",
		properties: [],
	},
	{
		name: "Wiggle",
		category: "Highlight",
		description: "Wiggle an object.",
		demo: wiggleDemo,
		icon: WiggleIcon,
		properties: [],
	},
	{
		name: "Write",
		category: "Create",
		demo: writeDemo,
		description: "Write text in like handwriting.",
		icon: PencilIcon,
		properties: [],
	},
] as const satisfies ManimAnimation[];
