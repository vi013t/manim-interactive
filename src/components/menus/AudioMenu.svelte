<script lang="ts">
	import { deleteProjectItem } from "../../api/project.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import TypeIcon from "../icons/TypeIcon.svelte";
	import ConfirmDeleteObjectWindow from "../windows/ConfirmDeleteObjectWindow.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let menu: ContextMenu;
	let id = $state(0);
	let top = $state("");
	let left = $state("");

	export function setId(newId: number) {
		id = newId;
	}

	export function showAt(newTop: string, newLeft: string) {
		top = newTop;
		left = newLeft;
		menu.show();
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
	}

	function deleteAudio() {
		menu.hide();
		deleteProjectItem(id);
	}

	let confirmDeleteObjectWindow: ConfirmDeleteObjectWindow;
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<ContextMenu bind:this={menu} {top} {left}>
	<span>Audio Actions</span>
	<button onclick={deleteAudio}>
		<TypeIcon stroke="var(--blue)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Rename Audio
	</button>
	<button onclick={deleteAudio}>
		<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Delete Audio
	</button>
</ContextMenu>

<ConfirmDeleteObjectWindow bind:this={confirmDeleteObjectWindow} {id} />

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
