<script lang="ts">
	import { addObjectEntry, nextId } from "../../api/codegen.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import ItalicIcon from "../icons/ItalicIcon.svelte";
	import PlainTextIcon from "../icons/PlainTextIcon.svelte";
	import VariableIcon from "../icons/VariableIcon.svelte";

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
	<span>Add Text</span>
	<button onclick={addGroup}>
		<VariableIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Math
	</button>
	<button onclick={addGroup}>
		<PlainTextIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Plain Text
	</button>
	<button onclick={addGroup}>
		<ItalicIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Styled Text
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
