<script lang="ts">
	import { getHorizontalExpandDirection, getVerticalExpandDirection, isAddMenuOpen, toggleAddMenuVisible } from "../../api/client.svelte";
	import AnimationIcon from "../icons/AnimationIcon.svelte";
	import AudioIcon from "../icons/AudioIcon.svelte";
	import CubeIcon from "../icons/CubeIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import VariableIcon from "../icons/VariableIcon.svelte";
	import AddAnimationMenu from "./AddAnimationMenu.svelte";
	import AddObjectMenu from "./AddObjectMenu.svelte";
	import AddVariableMenu from "./AddVariableMenu.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left }: { top: string; left: string } = $props();

	let horizontalExpand = $state("right");
	let verticalExpand = $state("bottom");

	let menu: ContextMenu;
	let addAnimationMenu: AddAnimationMenu;
	let addObjectMenu: AddObjectMenu;
	let addVariableMenu: AddVariableMenu;

	type Submenu = "animation" | "object" | "variable";
	let selectedMenu: Submenu | null = $state(null);

	function selectMenu(name: Submenu) {
		return function () {
			selectedMenu = name;
			hideSubmenus();
			({
				object: addObjectMenu,
				animation: addAnimationMenu,
				variable: addVariableMenu,
			})[name].show();
		};
	}

	export function show() {
		horizontalExpand = getHorizontalExpandDirection();
		verticalExpand = getVerticalExpandDirection();
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
		addObjectMenu.hide();
		addVariableMenu.hide();
	}
</script>

<ContextMenu bind:this={menu} {top} {left} getVisible={isAddMenuOpen} setVisible={toggleAddMenuVisible}>
	<span>Add</span>
	<button style:background={selectedMenu === "animation" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("animation")}>
		<AnimationIcon stroke="var(--teal)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Animation
		<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button onmouseenter={hideSubmenus}>
		<AudioIcon stroke="var(--mauve)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Audio
	</button>
	<button style:background={selectedMenu === "object" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("object")}>
		<CubeIcon stroke="var(--peach)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Object
		<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button style:background={selectedMenu === "variable" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("variable")}>
		<VariableIcon stroke="var(--lavender)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Variable
		<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>

	<AddAnimationMenu bind:this={addAnimationMenu} top={verticalExpand === "bottom" ? "1.9rem" : "-5.25rem"} left={horizontalExpand === "right" ? "100%" : "-100%"} />
	<AddObjectMenu bind:this={addObjectMenu} top={verticalExpand === "bottom" ? "5.25rem" : "-3.5rem"} left={horizontalExpand === "right" ? "100%" : "-100%"} />
	<AddVariableMenu bind:this={addVariableMenu} top={verticalExpand === "bottom" ? "7rem" : "-3.5rem"} left={horizontalExpand === "right" ? "100%" : "-100%"} />
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
