<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { onMount } from "svelte";
	import { runAction } from "../../../api/actions.svelte";
	import { animations, getAnimationCategory } from "../../../api/manim/animations";
	import { getProjectAnimations, select, type ProjectAnimation } from "../../../api/project.svelte";
	import { currentTime, isPlaying, moveFrames, togglePlaying } from "../../../api/timeline.svelte";
	import PlayIcon from "../../icons/PlayIcon.svelte";
	import SquareIcon from "../../icons/SquareIcon.svelte";
	import AddToTimelineMenu from "../../menus/AddToTimelineMenu.svelte";
	import AnimationActionsMenu from "../../menus/AnimationActionsMenu.svelte";

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

	function animationColor(animation: ProjectAnimation): string {
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
		animationActionsMenu.hide();
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

	function animationMouseDown(animation: ProjectAnimation) {
		return function (event: MouseEvent) {
			if (event.offsetY > (event.target as HTMLElement).clientHeight - BORDER_SIZE) {
				height = event.offsetY;
				document.addEventListener("mousemove", resize(event.target as HTMLElement), false);
			} else {
				draggingElement = event.target as HTMLElement;
				draggingAnimation = animation;
			}
		};
	}

	async function createAudio() {
		const base64Audio = await invoke("load_audio_base64", {
			path: "C:\\Users\\violet\\OneDrive\\Documents\\Coding\\manim-interactive\\test\\audio.mp3",
		});

		const audio = document.getElementById("my-audio") as HTMLAudioElement;
		audio.src = `data:audio/mp3;base64,${base64Audio}`;
		audio.play();
	}

	let draggingElement: HTMLElement | null = $state(null);
	let draggingAnimation: ProjectAnimation | null = $state(null);
	let timeSlider: HTMLElement;
	let timelineElement: HTMLElement;

	onMount(() => {
		document.addEventListener("keydown", event => {
			if (event.key === "ArrowRight") {
				moveFrames(1);
				return;
			}

			if (event.key === "ArrowLeft") {
				moveFrames(-1);
				return;
			}
		});

		document.addEventListener("mousemove", event => {
			if (draggingElement) {
				let newTop = event.clientY - timelineElement.getBoundingClientRect().top - draggingElement.clientHeight / 2;
				draggingElement.style.top = `${newTop}px`;
				draggingElement.style.cursor = "grabbing";
			}
		});

		document.addEventListener("mouseup", event => {
			if (draggingElement) {
				let snapping = !(event.ctrlKey || event.shiftKey);
				let newTop = event.clientY - timelineElement.getBoundingClientRect().top - draggingElement.clientHeight / 2;
				let cellHeight = 64;
				if (snapping) {
					if (newTop % cellHeight < cellHeight / 2) newTop = newTop - (newTop % cellHeight);
					else newTop = newTop + (cellHeight - (newTop % cellHeight));
				}
				draggingElement.style.top = `${newTop}px`;
				draggingElement.style.cursor = "pointer";
				if (draggingAnimation) draggingAnimation.startTime = newTop / cellHeight;
				runAction("Save Project");
			}
			draggingElement = null;
			draggingAnimation = null;
		});
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section oncontextmenu={addAnimation}>
	<div class="header">
		<h1>Timeline</h1>
		<button onclick={togglePlaying}>
			{#if isPlaying()}
				<SquareIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
			{:else}
				<PlayIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
			{/if}
		</button>
	</div>

	<div bind:this={timelineElement} id="timeline-wrapper">
		<div id="timeline-content">
			{#each getProjectAnimations() as animation}
				<button
					oncontextmenu={animationActions}
					onmousedown={animationMouseDown(animation)}
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
	<div bind:this={timeSlider} class="time" style:top="calc({currentTime() * 4}rem + 2.5rem)"></div>
</section>

<AddToTimelineMenu bind:this={addAnimationMenu} {top} {left} />
<AnimationActionsMenu bind:this={animationActionsMenu} {top} {left} />

<style>
	.header {
		display: flex;

		> *:first-child {
			margin-right: auto;
		}

		> *:last-child {
			margin-right: 0.5rem;
		}
	}

	.time {
		height: 2px;
		width: 100%;
		background-color: #b4befe;
		position: absolute;
		left: 0px;
		cursor: move;
	}

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
		margin-left: 8rem;
		border-radius: 0.3rem;
		color: #000000;
		position: absolute;
		width: 68%;
		cursor: pointer;
		text-align: left;
		padding: 1rem;
		height: 4rem;
		z-index: 99999;

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
		height: 95vh;
	}

	#timeline-content {
		:global(> div) {
			height: 4rem;
			border-bottom: 1px solid #313244;
			display: flex;
			flex-direction: column;

			&:first-child {
				border-top: 1px solid #313244;
			}
		}
	}

	:global(.timestamp) {
		position: relative;
		top: -1.6em;
		padding: 0.75em;
		background-color: #1e1e2e;
		color: #585b70;
		font-size: 0.75rem;
		left: 0px;
		width: fit-content;
	}
</style>
