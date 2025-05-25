<script lang="ts">
	import { animations, getAnimationCategory, type AnimationCategory, type ManimAnimation } from "../../api/manim/animations";
	import { addProjectAnimation, nextId } from "../../api/project.svelte";
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
		currentAnimation = null;
	}

	function addAnimationEntry(name: string) {
		return function () {
			menu.toggle();
			hideParent();
			addProjectAnimation({
				name: name,
				objects: [],
				id: nextId(),
				properties: {},
			});
		};
	}

	const categoryData = getAnimationCategory(category);
	const useAnimations = animations.filter(animation => animation.category === category);

	let currentAnimation: ManimAnimation | null = $state(null);
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add {category} Animation</span>
	{#each useAnimations as animation}
		<!-- svelte-ignore a11y_mouse_events_have_key_events -->
		<button onclick={addAnimationEntry(animation.name)} onmouseover={() => (currentAnimation = animation)}>
			<animation.icon stroke={categoryData.color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{animation.name}
		</button>
	{/each}
</ContextMenu>

{#if currentAnimation}
	<div class="info" style:top>
		<h1>{currentAnimation.name}</h1>
		<p>{currentAnimation.description}</p>
		<!-- svelte-ignore a11y_media_has_caption -->
		<video src={currentAnimation.demo} autoplay loop></video>
	</div>
{/if}

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	.info {
		position: absolute;
		left: -35rem;
		background-color: #1e1e2e;
		padding: 2rem;
		width: 20rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-radius: 0.5rem;

		p {
			color: #9399b2;
			margin-top: -0.5rem;
		}

		video {
			width: 16rem;
			height: 9rem;
		}
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;
	}
</style>
