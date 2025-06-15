<script lang="ts">
	import { deleteProjectItem } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
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

	function deleteMarker() {
		menu.hide();
		deleteProjectItem(id);
	}

	function renameMarker() {
		menu.hide();
		document.getElementById(`marker-${id}-name`)!.focus();
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Marker Actions</span>
	<button onclick={renameMarker}>
		<TypeIcon stroke="var(--blue)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Rename Marker")}
	</button>
	<button onclick={deleteMarker}>
		<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Delete Marker")}
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
