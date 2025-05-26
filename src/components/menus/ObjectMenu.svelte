<script lang="ts">
	import { getProjectAnimations, removeProjectObject } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import AnimationIcon from "../icons/AnimationIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import TypeIcon from "../icons/TypeIcon.svelte";
	import ConfirmDeleteObjectWindow from "../windows/ConfirmDeleteObjectWindow.svelte";
	import AddAnimationMenu from "./AddAnimationMenu.svelte";

	let { top, left, id }: { top: string; left: string; id: number } = $props();

	let menu: ContextMenu;
	let addAnimationMenu: AddAnimationMenu;

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
		addAnimationMenu.hide();
	}

	function deleteObject() {
		menu.hide();
		if (getProjectAnimations().some(animation => animation.objects.includes(id))) {
			confirmDeleteObjectWindow.show();
		} else {
			removeProjectObject(id);
		}
	}

	let confirmDeleteObjectWindow: ConfirmDeleteObjectWindow;
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<ContextMenu bind:this={menu} {top} {left}>
	<span>Object Actions</span>
	<button onclick={deleteObject} onmouseover={hideSubmenus}>
		<TypeIcon stroke="#89b4fa" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Rename Object
	</button>

	<button
		onclick={deleteObject}
		onmouseover={() => {
			hideSubmenus();
			addAnimationMenu.show();
		}}
	>
		<AnimationIcon stroke="#94e2d5" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Animation
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>

	<button onclick={deleteObject} onmouseover={hideSubmenus}>
		<TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Delete Object
	</button>

	<AddAnimationMenu bind:this={addAnimationMenu} top="3.5rem" left="100%" hideParent={hide} {id} />
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
