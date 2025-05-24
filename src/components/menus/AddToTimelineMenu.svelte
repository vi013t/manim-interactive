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
	}

	function hideSubmenus() {
		addAnimationMenu.hide();
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Timeline Actions</span>
	<button onmouseenter={hideSubmenus}>
		<AudioIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Audio
	</button>
	<button
		onmouseenter={() => {
			hideSubmenus();
			addAnimationMenu.show();
		}}
	>
		<AnimationIcon stroke="#94e2d5" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Animation
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button onmouseenter={hideSubmenus}>
		<GearIcon stroke="#9399b2" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Open Timeline Preferences
	</button>

	<AddAnimationMenu bind:this={addAnimationMenu} top="3.5rem" left="-100%" />
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
