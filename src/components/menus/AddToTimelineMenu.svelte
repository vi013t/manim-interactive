<script lang="ts">
	import ContextMenu from "../ContextMenu.svelte";
	import AnimationIcon from "../icons/AnimationIcon.svelte";
	import AudioIcon from "../icons/AudioIcon.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import AddAnimationMenu from "./AddAnimationMenu.svelte";

	let { top, left }: { top: string; left: string } = $props();

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
		hideSubmenus();
	}

	function hideSubmenus() {
		addAnimationMenu.hide();
	}

	type Submenu = "animation";

	let selectedMenu: Submenu | null = $state(null);

	function selectMenu(name: Submenu | null) {
		return function () {
			selectedMenu = name;
			if (name) {
				hideSubmenus();
				({
					animation: addAnimationMenu,
				})[name].show();
			}
		};
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Timeline Actions</span>
	<button onmouseenter={selectMenu(null)}>
		<AudioIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Audio
	</button>
	<button style:background={selectedMenu === "animation" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("animation")}>
		<AnimationIcon stroke="#94e2d5" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Animation
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button onmouseenter={selectMenu(null)}>
		<GearIcon stroke="#9399b2" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Open Timeline Preferences
	</button>

	<AddAnimationMenu bind:this={addAnimationMenu} top="3.5rem" left="-100%" hideParent={hide} />
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
