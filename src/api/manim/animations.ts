import type { Component } from "svelte";
import BlinkIcon from "../../components/icons/BlinkIcon.svelte";
import BorderIcon from "../../components/icons/BorderIcon.svelte";
import CircledLightningIcon from "../../components/icons/CircledLightningIcon.svelte";
import CycleIcon from "../../components/icons/CycleIcon.svelte";
import EraserIcon from "../../components/icons/EraserIcon.svelte";
import FadeInIcon from "../../components/icons/FadeInIcon.svelte";
import FadeOutIcon from "../../components/icons/FadeOutIcon.svelte";
import IncompleteCircle from "../../components/icons/IncompleteCircle.svelte";
import LightningIcon from "../../components/icons/LightningIcon.svelte";
import MegaphoneIcon from "../../components/icons/MegaphoneIcon.svelte";
import PencilIcon from "../../components/icons/PencilIcon.svelte";
import PlainTextIcon from "../../components/icons/PlainTextIcon.svelte";
import PlantIcon from "../../components/icons/PlantIcon.svelte";
import PlusIcon from "../../components/icons/PlusIcon.svelte";
import ReplaceIcon from "../../components/icons/ReplaceIcon.svelte";
import ReticleIcon from "../../components/icons/ReticleIcon.svelte";
import RevertIcon from "../../components/icons/RevertIcon.svelte";
import RotateIcon from "../../components/icons/RotateIcon.svelte";
import ScaleIcon from "../../components/icons/ScaleIcon.svelte";
import ShrinkIcon from "../../components/icons/ShrinkIcon.svelte";
import SparkleIcon from "../../components/icons/SparkleIcon.svelte";
import SpiralIcon from "../../components/icons/SpiralIcon.svelte";
import TargetIcon from "../../components/icons/TargetIcon.svelte";
import TransformIcon from "../../components/icons/TransformIcon.svelte";
import WaveIcon from "../../components/icons/WaveIcon.svelte";
import WiggleIcon from "../../components/icons/WiggleIcon.svelte";
import type { Property } from "./shared";

export type ManimAnimation = { name: string; category: AnimationCategory; icon: Component<{ stroke: string }>; properties: Property[] };

export const animationCategories = {
	Create: { color: "#a6e3a1" },
	Destroy: { color: "#f38ba8" },
	Highlight: { color: "#f9e2af" },
	Transform: { color: "#89b4fa" },
} as const satisfies { [key: string]: { color: string } };

export function getAnimationCategory(name: AnimationCategory) {
	return animationCategories[name];
}

export type AnimationCategory = keyof typeof animationCategories;

export const animations = [
	{
		name: "Appear",
		category: "Create",
		icon: SparkleIcon,
		properties: [],
	},
	{
		name: "Backspace",
		category: "Destroy",
		icon: PlainTextIcon,
		properties: [],
	},
	{
		name: "Blink",
		category: "Highlight",
		icon: BlinkIcon,
		properties: [],
	},
	{
		name: "Circumscribe",
		category: "Highlight",
		icon: IncompleteCircle,
		properties: [],
	},
	{
		name: "Create",
		category: "Create",
		icon: PlusIcon,
		properties: [],
	},
	{
		name: "Cyclic Replace",
		category: "Transform",
		icon: CycleIcon,
		properties: [],
	},
	{
		name: "Destroy",
		category: "Destroy",
		icon: SparkleIcon,
		properties: [],
	},
	{
		name: "Draw Border Then Fill",
		category: "Create",
		icon: BorderIcon,
		properties: [],
	},
	{
		name: "Erase",
		category: "Destroy",
		icon: EraserIcon,
		properties: [],
	},
	{
		name: "Fade In",
		category: "Create",
		icon: FadeInIcon,
		properties: [],
	},
	{
		name: "Fade Out",
		category: "Destroy",
		icon: FadeOutIcon,
		properties: [],
	},
	{
		name: "Fade Transform",
		category: "Transform",
		icon: FadeOutIcon,
		properties: [],
	},
	{
		name: "Flash",
		category: "Highlight",
		icon: LightningIcon,
		properties: [],
	},
	{
		name: "Focus",
		category: "Highlight",
		icon: ReticleIcon,
		properties: [],
	},
	{
		name: "Grow In",
		category: "Create",
		icon: PlantIcon,
		properties: [],
	},
	{
		name: "Indicate",
		category: "Highlight",
		icon: MegaphoneIcon,
		properties: [],
	},
	{
		name: "Move To Target",
		category: "Transform",
		icon: TargetIcon,
		properties: [],
	},
	{
		name: "Passing Flash",
		category: "Highlight",
		icon: CircledLightningIcon,
		properties: [],
	},
	{
		name: "ReplacementTransform",
		category: "Transform",
		icon: ReplaceIcon,
		properties: [],
	},
	{
		name: "Restore",
		category: "Transform",
		icon: RevertIcon,
		properties: [],
	},
	{
		name: "Rotate",
		category: "Transform",
		icon: RotateIcon,
		properties: [],
	},
	{
		name: "Scale",
		category: "Transform",
		icon: ScaleIcon,
		properties: [],
	},
	{
		name: "Shrink Away",
		category: "Destroy",
		icon: ShrinkIcon,
		properties: [],
	},
	{
		name: "Spiral In",
		category: "Create",
		icon: SpiralIcon,
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
		icon: PlainTextIcon,
		properties: [],
	},
	{
		name: "Wave",
		category: "Highlight",
		icon: WaveIcon,
		properties: [],
	},
	{
		name: "Wiggle",
		category: "Highlight",
		icon: WiggleIcon,
		properties: [],
	},
	{
		name: "Write",
		category: "Create",
		icon: PencilIcon,
		properties: [],
	},
] as const satisfies ManimAnimation[];
