<script lang="ts">
	import { addObjectEntry, nextId } from "../../api/codegen.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import AsteriskIcon from "../icons/AsteriskIcon.svelte";
	import CircleIcon from "../icons/CircleIcon.svelte";
	import LineIcon from "../icons/LineIcon.svelte";
	import PackageIcon from "../icons/PackageIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import TextIcon from "../icons/TextIcon.svelte";
	import AddLineMenu from "./AddLineMenu.svelte";
	import AddShapeMenu from "./AddShapeMenu.svelte";
	import AddTextMenu from "./AddTextMenu.svelte";

	let { top, left }: { top: string; left: string } = $props();

	let menu: ContextMenu;
	let addShapeMenu: AddShapeMenu;
	let addTextMenu: AddShapeMenu;
	let addLineMenu: AddLineMenu;

	export function show() {
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
	}

	function addGroup() {
		menu.toggle();
		addObjectEntry({
			name: "New Group",
			objects: [],
			groups: [],
			id: nextId(),
		});
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add New</span>
	<button
		onclick={addGroup}
		onmouseenter={() => {
			hideSubmenus();
		}}
	>
		<PackageIcon
			stroke="#89b4fa"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Group
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addLineMenu.show();
		}}
	>
		<LineIcon
			stroke="#cba6f7"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Line
		<RightArrow
			stroke="#89b4fa"
			style="width: 1rem; height: 0.8rem; margin-left: 0.5em;"
		/>
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addShapeMenu.show();
		}}
	>
		<CircleIcon
			stroke="#f38ba8"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Shape
		<RightArrow
			stroke="#89b4fa"
			style="width: 1rem; height: 0.8rem; margin-left: 0.5em;"
		/>
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addTextMenu.show();
		}}
	>
		<TextIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Text
		<RightArrow
			stroke="#89b4fa"
			style="width: 1rem; height: 0.7rem; margin-left: 0.5em;"
		/>
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addTextMenu.show();
		}}
	>
		<AsteriskIcon
			stroke="#9399b2"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Miscellaneous
		<RightArrow
			stroke="#89b4fa"
			style="width: 1rem; height: 0.7rem; margin-left: 0.5em;"
		/>
	</button>

	<AddShapeMenu
		bind:this={addShapeMenu}
		top="5rem"
		left="100%"
		hideOuter={hide}
	/>
	<AddTextMenu bind:this={addTextMenu} top="7rem" left="100%" />
	<AddLineMenu bind:this={addLineMenu} top="3.5rem" left="100%" />
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
