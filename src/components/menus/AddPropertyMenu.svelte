<script lang="ts">
	import { getHorizontalExpandDirection, getVerticalExpandDirection } from "../../api/client.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import AsteriskIcon from "../icons/AsteriskIcon.svelte";
	import CameraIcon from "../icons/CameraIcon.svelte";
	import PaintRollerIcon from "../icons/PaintRollerIcon.svelte";
	import ReticleIcon from "../icons/ReticleIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import ScaleIcon from "../icons/ScaleIcon.svelte";
	import AddObjectSubmenu from "./AddObjectSubmenu.svelte";
	import AddPropertySubmenu from "./AddPropertySubmenu.svelte";

	let { top, left, openers = [], background = "#1e1e2e" }: { top: string; left: string; openers?: HTMLElement[]; background?: string } = $props();

	let menu: ContextMenu;
	let sizeMenu: AddObjectSubmenu;
	let positionMenu: AddObjectSubmenu;
	let colorMenu: AddObjectSubmenu;
	let renderingMenu: AddObjectSubmenu;
	let miscellaneousMenu: AddObjectSubmenu;

	let horizontalExpand = $state("right");
	let verticalExpand = $state("bottom");

	export function show() {
		horizontalExpand = getHorizontalExpandDirection();
		verticalExpand = getVerticalExpandDirection();
		menu.show();
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
	}

	function hideSubmenus() {
		colorMenu.hide();
		renderingMenu.hide();
		sizeMenu.hide();
		positionMenu.hide();
		miscellaneousMenu.hide();
	}
</script>

<ContextMenu {background} bind:this={menu} {top} {left} {openers}>
	<span>Add Property</span>
	<button
		onmouseenter={() => {
			hideSubmenus();
			colorMenu.show();
		}}
	>
		<PaintRollerIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Color
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			sizeMenu.show();
		}}
	>
		<ScaleIcon stroke="#89b4fa" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Size
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.7rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			positionMenu.show();
		}}
	>
		<ReticleIcon stroke="#f9e2af" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Position
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.7rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			renderingMenu.show();
		}}
	>
		<CameraIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Details
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			miscellaneousMenu.show();
		}}
	>
		<AsteriskIcon stroke="#9399b2" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Miscellaneous
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.7rem; margin-left: 0.5em;" />
	</button>

	<AddPropertySubmenu
		{background}
		bind:this={colorMenu}
		top={verticalExpand === "bottom" ? "1.9rem" : "-8.5rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="color"
	/>
	<AddPropertySubmenu
		{background}
		bind:this={sizeMenu}
		top={verticalExpand === "bottom" ? "3.5rem" : "-8.5rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="size"
	/>
	<AddPropertySubmenu
		{background}
		bind:this={positionMenu}
		top={verticalExpand === "bottom" ? "5.25rem" : "-8.5rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="position"
	/>
	<AddPropertySubmenu
		{background}
		bind:this={renderingMenu}
		top={verticalExpand === "bottom" ? "7rem" : "-8.5rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="rendering"
	/>
	<AddPropertySubmenu
		{background}
		bind:this={miscellaneousMenu}
		top={verticalExpand === "bottom" ? "8.8rem" : "-8.5rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="miscellaneous"
	/>
</ContextMenu>

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;
	}
</style>
