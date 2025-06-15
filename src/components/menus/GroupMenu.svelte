<script lang="ts">
	import { removeProjectObject } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
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

	function deleteGroup() {
		menu.hide();
		removeProjectObject(id);
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Group Actions</span>
	<button onclick={deleteGroup}>
		<PlusIcon stroke="#a6e3a1" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Object")}
		<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button onclick={deleteGroup}>
		<TypeIcon stroke="var(--blue)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Rename Group")}
	</button>
	<button onclick={deleteGroup}>
		<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Delete Group")}
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
