<script lang="ts">
	import { onMount } from "svelte";
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { getProjectAnimations, getProjectAudios, getProjectMarkers } from "../../../api/project.svelte";
	import { currentTime, isPlaying, togglePlaying } from "../../../api/timeline.svelte";
	import PlayIcon from "../../icons/PlayIcon.svelte";
	import SquareIcon from "../../icons/SquareIcon.svelte";
	import AddToTimelineMenu from "../../menus/AddToTimelineMenu.svelte";
	import Audio from "./Audio.svelte";
	import Animation from "./Animation.svelte";

	// svelte-ignore non_reactive_update
	let timelineElement: HTMLElement;
	let timeSlider: HTMLElement;
	let addAnimationMenu: AddToTimelineMenu;

	let top = $state("100%");
	let left = $state("94%");

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
				newDiv.oncontextmenu = addAnimation;

				seconds++;
				checkForNewDiv();
			}
		}

		checkForNewDiv();
	});


	function addAnimation(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
		addAnimationMenu.show();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section>
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

			<!-- Animations -->
			{#each getProjectAnimations() as animation}
				<Animation {animation} {timelineElement}/>
			{/each}

			<!-- Audios -->
			{#each getProjectAudios() as audio}
				<Audio {audio} />
			{/each}

			<!-- Markers -->
			{#each getProjectMarkers() as marker}
				<div class="marker" style:top="{marker.time * 4}rem"></div>
			{/each}

			<div oncontextmenu={addAnimation}></div>

			<div bind:this={timeSlider} class="time" style:top="calc({currentTime() * 4}rem + 2.5rem)"></div>
		</div>
	</div>
</section>
<AddToTimelineMenu bind:this={addAnimationMenu} {top} {left} />

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

	.marker {
		position: absolute;
		width: 100%;
		height: 2px;
		background-color: #FFFF00;
		left: 0px;
		transform: translateY(-50%);

		&:hover {
			cursor: grab;
		}
	}

	.time {
		height: 2px;
		width: 100%;
		background-color: #b4befe;
		position: absolute;
		left: 0px;
		cursor: move;

		&::after {
			content: "";
			width: 0px;
			height: 0px;
			border-top: 0.5rem solid transparent;
			border-bottom: 0.5rem solid transparent;
			border-left: 0.5rem solid #b4befe;
			z-index: 9999;
			position: absolute;
			top: 50%;
			left: 0px;
			transform: translateY(-50%);
		}
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

	#timeline-wrapper {
		position: relative;
		overflow: auto;
		height: 95vh;
	}

	#timeline-content {
		:global(> div:not(.time, .marker)) {
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
