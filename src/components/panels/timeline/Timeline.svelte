<script lang="ts">
	import { onMount } from "svelte";
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { getPreferences } from "../../../api/preferences.svelte";
	import { getProjectAnimations, getProjectAudios, getProjectMarkers } from "../../../api/project.svelte";
	import { currentTime, isPlaying, togglePlaying } from "../../../api/timeline.svelte";
	import { translate } from "../../../api/translate.svelte";
	import PlayIcon from "../../icons/PlayIcon.svelte";
	import SquareIcon from "../../icons/SquareIcon.svelte";
	import AddToTimelineMenu from "../../menus/AddToTimelineMenu.svelte";
	import AudioMenu from "../../menus/AudioMenu.svelte";
	import Animation from "./Animation.svelte";
	import Audio from "./Audio.svelte";

	// svelte-ignore non_reactive_update
	let timelineElement: HTMLElement;
	let timeSlider: HTMLElement;
	let addAnimationMenu: AddToTimelineMenu;
	let audioActionsMenu: AudioMenu | null = $state(null);

	let top = $state("100%");
	let left = $state("94%");
	let audioId: number = $state(0);

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

		document.addEventListener("keydown", event => {
			getPreferences().timelineSnapping = !event.ctrlKey;
		});
		document.addEventListener("keyup", event => {
			getPreferences().timelineSnapping = !event.ctrlKey;
		});
		document.addEventListener("mousemove", event => {
			getPreferences().timelineSnapping = !event.ctrlKey;
		});

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
<section id="timeline">
	<div class="header">
		<h1>{translate("Timeline")}</h1>
		<button onclick={togglePlaying}>
			{#if isPlaying()}
				<SquareIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
			{:else}
				<PlayIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
			{/if}
		</button>
	</div>

	<div bind:this={timelineElement} id="timeline-wrapper">
		<div id="timeline-content">
			<!-- Animations -->
			{#each getProjectAnimations() as animation (animation.id)}
				<Animation {animation} {timelineElement} />
			{/each}

			<!-- Audios -->
			{#each getProjectAudios() as audio (audio.id)}
				<Audio {audio} menu={audioActionsMenu} />
			{/each}

			<!-- Markers -->
			{#each getProjectMarkers() as marker (marker.id)}
				<div class="marker" style:top="{marker.time * 4}rem"></div>
			{/each}

			<div oncontextmenu={addAnimation}></div>

			<div bind:this={timeSlider} class="time" style:top="{currentTime() * 4}rem"></div>
		</div>
	</div>
</section>
<AddToTimelineMenu bind:this={addAnimationMenu} {top} {left} />
<AudioMenu bind:this={audioActionsMenu} />

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
		background-color: #ffff00;
		left: 0px;
		transform: translateY(-50%);

		&:hover {
			cursor: grab;
		}
	}

	.time {
		height: 2px;
		width: 100%;
		background-color: var(--lavender);
		position: absolute;
		left: 0px;
		cursor: move;
		z-index: 99;

		&::after {
			content: "";
			width: 0px;
			height: 0px;
			border-top: 0.5rem solid transparent;
			border-bottom: 0.5rem solid transparent;
			border-left: 0.5rem solid var(--lavender);
			z-index: 9999;
			position: absolute;
			top: 50%;
			left: 0px;
			transform: translateY(-50%);
		}
	}

	section {
		background-color: var(--base);
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	h1 {
		text-transform: uppercase;
		font-size: 0.75rem;
		color: var(--overlay-2);
		padding: 1em;
	}

	#timeline-wrapper {
		position: relative;
		overflow: auto;
		height: 95vh;
		background-color: inherit;
	}

	#timeline-content {
		background-color: inherit;

		:global(> div:not(.time, .marker)) {
			background-color: inherit;
			height: 4rem;
			border-bottom: 1px solid var(--surface-0);
			display: flex;
			flex-direction: column;

			&:first-child {
				border-top: 1px solid var(--surface-0);
			}
		}
	}

	:global(.timestamp) {
		position: relative;
		top: -1.6em;
		padding: 0.75em;
		background-color: inherit;
		color: var(--surface-2);
		font-size: 0.75rem;
		left: 0px;
		width: fit-content;
	}
</style>
