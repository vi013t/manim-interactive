<script lang="ts">
	import { onMount } from "svelte";
	import { allAnimations, select, type Animation } from "../api/codegen.svelte";
	import { animations, getAnimationCategory } from "../api/manim/animations";
	import AddToTimelineMenu from "./menus/AddToTimelineMenu.svelte";
	import AnimationActionsMenu from "./menus/AnimationActionsMenu.svelte";

	let seconds = 1;

	function formatTime(seconds: number): string {
		if (seconds < 60) return `${seconds}s`;
		if (seconds / 60 < 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
		return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds / 3600) % 60}m ${seconds % 60}s`;
	}

	onMount(() => {
		const wrapper = document.getElementById("timeline-wrapper")!;
		wrapper.addEventListener("scroll", checkForNewDiv);

		function checkForNewDiv() {
			const lastDiv = document.querySelector("#timeline-content > div:last-child") as HTMLElement;
			const lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
			const pageOffset = wrapper.scrollTop + wrapper.clientHeight;

			if (pageOffset > lastDivOffset - 500) {
				const newDiv = document.createElement("div");
				document.getElementById("timeline-content")!.appendChild(newDiv);

				const timestamp = document.createElement("span");
				timestamp.classList.add("timestamp");
				timestamp.innerHTML = formatTime(seconds);
				newDiv.appendChild(timestamp);

				seconds++;
				checkForNewDiv();
			}
		}

		checkForNewDiv();
	});

	function animationColor(animation: Animation): string {
		return getAnimationCategory(animations.find(manimation => manimation.name === animation.name)!.category).color;
	}

	let addAnimationMenu: AddToTimelineMenu;
	let animationActionsMenu: AnimationActionsMenu;

	let top = $state("100%");
	let left = $state("94%");

	function addAnimation(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		addAnimationMenu.show();
	}

	function animationActions(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		animationActionsMenu.show();
	}

	const BORDER_SIZE = 4;
	let height: number;

	function resize(element: HTMLElement) {
		return function (event: MouseEvent) {
			element.style.height = `${event.y - element.clientTop}px`;
		};
	}

	function animationMouseDown(event: MouseEvent) {
		if (event.offsetY > (event.target as HTMLElement).clientHeight - BORDER_SIZE) {
			height = event.offsetY;
			document.addEventListener("mousemove", resize(event.target as HTMLElement), false);
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section oncontextmenu={addAnimation}>
	<h1>Timeline</h1>
	<div id="timeline-wrapper">
		<div id="timeline-content">
			{#each allAnimations() as animation}
				<button
					oncontextmenu={animationActions}
					onmousedown={animationMouseDown}
					class="animation"
					style:background-color={animationColor(animation)}
					onclick={() => select(animation)}
				>
					{animation.name}
				</button>
			{/each}
			<div></div>
		</div>
	</div>
</section>

<AddToTimelineMenu bind:this={addAnimationMenu} {top} {left} />
<AnimationActionsMenu bind:this={animationActionsMenu} {top} {left} />

<style>
	section {
		background-color: #1e1e2e;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	h1 {
		text-transform: uppercase;
		font-size: 0.75rem;
		color: #9399b2;
		padding: 1em;
	}

	.animation {
		margin-left: 3rem;
		border-radius: 0.3rem;
		color: #000000;
		position: absolute;
		width: 80%;
		cursor: pointer;
		text-align: left;
		height: 5vh;
		z-index: 99;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			top: calc(100% - 4px);
			width: 100%;
			height: 4px;
			cursor: ns-resize;
		}
	}

	#timeline-wrapper {
		position: relative;
		overflow: auto;
		height: 90vh;
	}

	#timeline-content {
		:global(> div) {
			height: 5vh;
			border-bottom: 1px solid #313244;

			&:first-child {
				border-top: 1px solid #313244;
			}
		}
	}

	:global(.timestamp) {
		position: relative;
		top: -1.2em;
		padding: 0.75em;
		background-color: #1e1e2e;
		color: #585b70;
		font-size: 0.75rem;
		left: 0px;
	}
</style>
