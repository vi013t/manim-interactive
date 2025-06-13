<script lang="ts">
	import { getProjectAnimations, removeProjectObject } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import AnimationIcon from "../icons/AnimationIcon.svelte";
	import PropertiesIcon from "../icons/PropertiesIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import TypeIcon from "../icons/TypeIcon.svelte";
	import ConfirmDeleteObjectWindow from "../windows/ConfirmDeleteObjectWindow.svelte";
	import AddAnimationMenu from "./AddAnimationMenu.svelte";
	import AddPropertyMenu from "./AddPropertyMenu.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left, id }: { top: string; left: string; id: number } = $props();

	let menu: ContextMenu;
	let addAnimationMenu: AddAnimationMenu;
	let addPropertyMenu: AddPropertyMenu;

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
		addPropertyMenu.hide();
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
		{translate("Rename Object")}
	</button>

	<button
		onmouseover={() => {
			hideSubmenus();
			addAnimationMenu.show();
		}}
	>
		<AnimationIcon stroke="#94e2d5" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Animation")}
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseover={() => {
			hideSubmenus();
			addPropertyMenu.show();
		}}
	>
		<PropertiesIcon stroke="#f9e2af" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Property")}
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>

	<button onclick={deleteObject} onmouseover={hideSubmenus}>
		<TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Delete Object")}
	</button>

	<AddAnimationMenu bind:this={addAnimationMenu} top="3.5rem" left="100%" {id} />
	<AddPropertyMenu bind:this={addPropertyMenu} top="5.25rem" left="100%" />
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
