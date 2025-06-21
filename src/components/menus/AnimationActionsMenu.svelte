<script lang="ts">
	import { deleteProjectItem } from "../../api/project.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import TypeIcon from "../icons/TypeIcon.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left, id }: { top: string; left: string; id: number } = $props();

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

	function deleteAnimation() {
		deleteProjectItem(id);
		hide();
	}

	function renameAnimation() {
		document.getElementById(`animation-${id}-name`)!.focus();
		hide();
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Animation Actions</span>
	<button onclick={renameAnimation}>
		<TypeIcon stroke="var(--blue)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Rename Animation
	</button>
	<button onclick={deleteAnimation}>
		<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Delete Animation
	</button>
</ContextMenu>

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid var(--surface-0);
	}
</style>
