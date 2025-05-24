<script lang="ts">
	import { addAnimation, nextId } from "../../api/codegen.svelte";
	import type { AnimationCategory } from "../../api/manim";
	import { animations, getAnimationCategory } from "../../api/manim/animations";
	import ContextMenu from "../ContextMenu.svelte";

	let { top, left, hideParent, category }: { top: string; left: string; hideParent: () => void; id?: number; category: AnimationCategory } = $props();

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

	function addAnimationEntry(name: string) {
		return function () {
			menu.toggle();
			hideParent();
			addAnimation({
				name: name,
				objects: [],
				id: nextId(),
				properties: {},
			});
		};
	}

	const categoryData = getAnimationCategory(category);
	const useAnimations = animations.filter(animation => animation.category === category);
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add {category} Animation</span>
	{#each useAnimations as animation}
		<button onclick={addAnimationEntry(animation.name)}>
			<animation.icon stroke={categoryData.color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{animation.name}
		</button>
	{/each}
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
