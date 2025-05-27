<script lang="ts">
	import { getHorizontalExpandDirection, getVerticalExpandDirection } from "../../api/client.svelte";
	import { objects } from "../../api/manim/objects";
	import { addProjectObject, nextId } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import AsteriskIcon from "../icons/AsteriskIcon.svelte";
	import CircleIcon from "../icons/CircleIcon.svelte";
	import LineIcon from "../icons/LineIcon.svelte";
	import PackageIcon from "../icons/PackageIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import TextIcon from "../icons/TextIcon.svelte";
	import AddObjectSubmenu from "./AddObjectSubmenu.svelte";

	let { top, left, openers = [] }: { top: string; left: string; openers?: HTMLElement[] } = $props();

	let menu: ContextMenu;
	let addLineMenu: AddObjectSubmenu;
	let addShapeMenu: AddObjectSubmenu;
	let addTextMenu: AddObjectSubmenu;
	let addMiscellaneousMenu: AddObjectSubmenu;

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
		addShapeMenu.hide();
		addTextMenu.hide();
		addLineMenu.hide();
		addMiscellaneousMenu.hide();
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
	<span>Add Object</span>
	<button onclick={addGroup} onmouseenter={hideSubmenus}>
		<PackageIcon stroke="#89b4fa" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Group
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addLineMenu.show();
		}}
	>
		<LineIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Line
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addShapeMenu.show();
		}}
	>
		<CircleIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Shape
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addTextMenu.show();
		}}
	>
		<TextIcon stroke="#f9e2af" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Text
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.7rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addMiscellaneousMenu.show();
		}}
	>
		<AsteriskIcon stroke="#9399b2" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Miscellaneous
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.7rem; margin-left: 0.5em;" />
	</button>

	<AddObjectSubmenu
		bind:this={addLineMenu}
		top={verticalExpand === "bottom" ? "3.5rem" : "-2rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="Line"
		hideOuter={hide}
	/>
	<AddObjectSubmenu
		bind:this={addShapeMenu}
		top={verticalExpand === "bottom" ? "5rem" : "-8.5rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="Shape"
		hideOuter={hide}
	/>
	<AddObjectSubmenu
		bind:this={addTextMenu}
		top={verticalExpand === "bottom" ? "7rem" : "1.75rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="Text"
		hideOuter={hide}
	/>
	<AddObjectSubmenu
		bind:this={addMiscellaneousMenu}
		top={verticalExpand === "bottom" ? "9rem" : "1.75rem"}
		left={horizontalExpand === "right" ? "100%" : "-100%"}
		category="Miscellaneous"
		hideOuter={hide}
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
