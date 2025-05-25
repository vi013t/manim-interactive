<script lang="ts">
	import { isDeveloperMode } from "../../api/preferences.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import CodeIcon from "../icons/CodeIcon.svelte";
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
		hideParent,
	}: {
		top: string;
		left: string;
		expandTo?: "left" | "right";
		hideParent: () => void;
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

	type Submenu = "create" | "destroy" | "transform" | "highlight";

	let selectedMenu: Submenu | null = $state(null);

	function selectMenu(name: Submenu) {
		return function () {
			selectedMenu = name;
			hideSubmenus();
			({
				create: addCreateAnimationMenu,
				destroy: addDestroyAnimationMenu,
				highlight: addHighlightAnimationMenu,
				transform: addTransformAnimationMenu,
			})[name].show();
		};
	}

	function hideAll() {
		hide();
		hideParent();
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add Animation</span>
	<button style:background={selectedMenu === "create" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("create")}>
		<PlusIcon stroke="#a6e3a1" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Create
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button style:background={selectedMenu === "destroy" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("destroy")}>
		<TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Destroy
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button style:background={selectedMenu === "highlight" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("highlight")}>
		<SparkleIcon stroke="#f9e2af" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Highlight
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button style:background={selectedMenu === "transform" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("transform")}>
		<TransformIcon stroke="#89b4fa" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Transform
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	{#if isDeveloperMode()}
		<button
			onmouseenter={() => {
				hideSubmenus();
			}}
		>
			<CodeIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			Script
		</button>
	{/if}

	<AddAnimationSubmenu bind:this={addCreateAnimationMenu} top="0px" left={expandTo === "left" ? "-100%" : "100%"} hideParent={hideAll} category="Create" />
	<AddAnimationSubmenu bind:this={addDestroyAnimationMenu} top="3.5rem" left={expandTo === "left" ? "-100%" : "100%"} hideParent={hideAll} category="Destroy" />
	<AddAnimationSubmenu bind:this={addHighlightAnimationMenu} top="5.25rem" left={expandTo === "left" ? "-100%" : "100%"} hideParent={hideAll} category="Highlight" />
	<AddAnimationSubmenu bind:this={addTransformAnimationMenu} top="7.5rem" left={expandTo === "left" ? "-100%" : "100%"} hideParent={hideAll} category="Transform" />
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
