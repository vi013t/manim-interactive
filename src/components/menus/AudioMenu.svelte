<script lang="ts">
	import { getProjectAnimations, removeProjectObject } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import BookmarkIcon from "../icons/BookmarkIcon.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import TypeIcon from "../icons/TypeIcon.svelte";
	import ConfirmDeleteObjectWindow from "../windows/ConfirmDeleteObjectWindow.svelte";
	import { addAudioMarker } from "../../api/project.svelte";

	let { top, left, id, clickTime }: { top: string; left: string; id: number, clickTime: number } = $props();

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

	function deleteObject() {
		menu.hide();
		if (getProjectAnimations().some(animation => animation.objects.includes(id))) {
			confirmDeleteObjectWindow.show();
		} else {
			removeProjectObject(id);
		}
	}

	function addMarker() {
		hide();	
		addAudioMarker(id, "", clickTime);
	}

	let confirmDeleteObjectWindow: ConfirmDeleteObjectWindow;
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<ContextMenu bind:this={menu} {top} {left}>
	<span>Audio Actions</span>
	<button onclick={deleteObject}>
		<TypeIcon stroke="#89b4fa" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Rename Audio
	</button>
	<button onclick={addMarker}>
		<BookmarkIcon stroke="#f9e2af" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Marker
	</button>

	<button onclick={deleteObject}>
		<TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
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
		border-bottom: 1px solid #313244;
	}
</style>
