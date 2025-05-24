<script lang="ts">
	import ContextMenu from "../ContextMenu.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import SparkleIcon from "../icons/SparkleIcon.svelte";
	import TransformIcon from "../icons/TransformIcon.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import AddAnimationSubmenu from "./AddAnimationSubmenu.svelte";

	let {
		top,
		left,
		expandTo = "left",
	}: {
		top: string;
		left: string;
		expandTo?: "left" | "right";
	} = $props();

	let menu: ContextMenu;
	let addCreateAnimationMenu: AddAnimationSubmenu;
	let addDestroyAnimationMenu: AddAnimationSubmenu;
	let addHighlightAnimationMenu: AddAnimationSubmenu;
	let addTransformAnimationMenu: AddAnimationSubmenu;

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
		addCreateAnimationMenu.hide();
		addDestroyAnimationMenu.hide();
		addHighlightAnimationMenu.hide();
		addTransformAnimationMenu.hide();
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add Animation</span>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addCreateAnimationMenu.show();
		}}
	>
		<PlusIcon stroke="#a6e3a1" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Create
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addDestroyAnimationMenu.show();
		}}
	>
		<TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Destroy
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addHighlightAnimationMenu.show();
		}}
	>
		<SparkleIcon stroke="#f9e2af" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Highlight
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addTransformAnimationMenu.show();
		}}
	>
		<TransformIcon stroke="#89b4fa" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Transform
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>

	<AddAnimationSubmenu bind:this={addCreateAnimationMenu} top="0px" left={expandTo === "left" ? "-100%" : "100%"} hideParent={hide} category="Create" />
	<AddAnimationSubmenu bind:this={addDestroyAnimationMenu} top="3.5rem" left={expandTo === "left" ? "-100%" : "100%"} hideParent={hide} category="Destroy" />
	<AddAnimationSubmenu bind:this={addHighlightAnimationMenu} top="5.25rem" left={expandTo === "left" ? "-100%" : "100%"} hideParent={hide} category="Highlight" />
	<AddAnimationSubmenu bind:this={addTransformAnimationMenu} top="7.5rem" left={expandTo === "left" ? "-100%" : "100%"} hideParent={hide} category="Transform" />
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
