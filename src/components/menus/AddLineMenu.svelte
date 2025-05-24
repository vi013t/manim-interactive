<script lang="ts">
	import { addObjectEntry, nextId } from "../../api/codegen.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import ArcIcon from "../icons/ArcIcon.svelte";
	import LineIcon from "../icons/LineIcon.svelte";
	import UpArrowIcon from "../icons/UpArrowIcon.svelte";

	let { top, left }: { top: string; left: string } = $props();

	let menu: ContextMenu;

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
	<span>Add Line</span>
	<button onclick={addGroup}>
		<ArcIcon
			stroke="#cba6f7"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Arc
	</button>
	<button onclick={addGroup}>
		<UpArrowIcon
			stroke="#cba6f7"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Arrow
	</button>
	<button onclick={addGroup}>
		<LineIcon
			stroke="#cba6f7"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Line
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
