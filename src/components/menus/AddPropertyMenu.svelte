<script lang="ts">
	import { getHorizontalExpandDirection, getVerticalExpandDirection } from "../../api/client.svelte";
	import { addProjectObject, nextId } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import AsteriskIcon from "../icons/AsteriskIcon.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import PaintRollerIcon from "../icons/PaintRollerIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import ScaleIcon from "../icons/ScaleIcon.svelte";
	import AddObjectSubmenu from "./AddObjectSubmenu.svelte";
	import AddPropertySubmenu from "./AddPropertySubmenu.svelte";

	let { top, left, openers = [] }: { top: string; left: string; openers?: HTMLElement[] } = $props();

	let menu: ContextMenu;
	let sizeMenu: AddObjectSubmenu;
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
		miscellaneousMenu.hide();
	}

	function addGroup() {
		menu.toggle();
		addProjectObject({
			name: "New Group",
			objects: [],
			groups: [],
			id: nextId(),
		});
	}
</script>

<ContextMenu bind:this={menu} {top} {left} {openers}>
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
			renderingMenu.show();
		}}
	>
		<GearIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Rendering
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

	<AddPropertySubmenu bind:this={colorMenu} top={verticalExpand === "bottom" ? "5rem" : "-8.5rem"} left={horizontalExpand === "right" ? "100%" : "-100%"} category="color" />
	<AddPropertySubmenu bind:this={sizeMenu} top={verticalExpand === "bottom" ? "5rem" : "-8.5rem"} left={horizontalExpand === "right" ? "100%" : "-100%"} category="size" />
	<AddPropertySubmenu
		bind:this={renderingMenu}
		top={verticalExpand === "bottom" ? "5rem" : "-8.5rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="rendering"
	/>
	<AddPropertySubmenu
		bind:this={miscellaneousMenu}
		top={verticalExpand === "bottom" ? "5rem" : "-8.5rem"}
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
