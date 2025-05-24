<script lang="ts">
	import { addObjectEntry, nextId } from "../../api/codegen.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import EraserIcon from "../icons/EraserIcon.svelte";
	import FadeIcon from "../icons/FadeIcon.svelte";
	import PlainTextIcon from "../icons/PlainTextIcon.svelte";
	import ShrinkIcon from "../icons/ShrinkIcon.svelte";
	import SparkleIcon from "../icons/SparkleIcon.svelte";
	import AddLineMenu from "./AddLineMenu.svelte";
	import AddShapeMenu from "./AddShapeMenu.svelte";

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
	<span>Add Create Animation</span>
	<button onclick={addGroup}>
		<PlainTextIcon
			stroke="#f38ba8"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Backspace
	</button>
	<button onclick={addGroup}>
		<SparkleIcon
			stroke="#f38ba8"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Destroy
	</button>
	<button onclick={addGroup}>
		<EraserIcon
			stroke="#f38ba8"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Erase
	</button>
	<button onclick={addGroup}>
		<FadeIcon
			stroke="#f38ba8"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Fade Out
	</button>
	<button onclick={addGroup}>
		<ShrinkIcon
			stroke="#f38ba8"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Shrink Away
	</button>
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
