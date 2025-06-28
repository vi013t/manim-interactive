<script lang="ts">
	import { onMount } from "svelte";
	import type { HTMLVideoAttributes } from "svelte/elements";
	import FilledPlayIcon from "../../icons/FilledPlayIcon.svelte";
	import FullscreenIcon from "../../icons/FullscreenIcon.svelte";
	import PauseIcon from "../../icons/PauseIcon.svelte";

	let attributes: Omit<HTMLVideoAttributes, "controls"> = $props();

	let video: HTMLVideoElement | null = $state(null);
	let progressBar: HTMLButtonElement | null = $state(null);
	let paused = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let seeking = $state(false);

	export function element() {
		return video;
	}

	function progressMouseDown() {}

	function fullscreen() {
		video?.requestFullscreen();
	}

	function formatTime(time: number) {
		if (isNaN(time)) return "0:00";
		let seconds = Math.floor(time % 60);
		let minutes = Math.floor(time / 60);
		return `${`${minutes}`.padStart(1, "0")}:${`${seconds}`.padStart(2, "0")}`;
	}

	let timestamp = $derived.by(() => {
		loaded;
		return `${formatTime(currentTime)} / ${formatTime(duration)}`;
	});

	function togglePlay() {
		if (paused) video!.play();
		else video!.pause();
	}

	function seek(event: MouseEvent) {
		currentTime = Math.max(Math.min(((event.clientX - progressBar!.getBoundingClientRect().left) / progressBar!.getBoundingClientRect().width) * duration, duration), 0);
	}

	let progressBarWidth = $derived.by(() => {
		loaded;
		if (!progressBar) return "0px";
		return `${(currentTime / duration) * progressBar.getBoundingClientRect().width}px`;
	});

	$effect(() => {
		console.log(progressBarWidth);
	});

	let loaded = $state(false);

	function beginSeeking(event: MouseEvent) {
		seeking = true;
		seek(event);
	}

	onMount(() => {
		video?.addEventListener("loadedmetadata", event => {
			loaded = true;
		});

		document.addEventListener("mousemove", event => {
			if (seeking) seek(event);
		});

		document.addEventListener("mouseup", event => {
			seeking = false;
		});
	});
</script>

<div class="video-container">
	<video onclick={togglePlay} bind:duration bind:currentTime bind:paused bind:this={video} {...attributes}></video>
	<div class="controls">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button bind:this={progressBar} style:--progress-bar-width={progressBarWidth} class="progress" onmousedown={beginSeeking}></button>
		<button onclick={togglePlay} class="play">
			{#if paused}
				<FilledPlayIcon stroke="white" style="width: 1rem; height: 1rem;" />
			{:else}
				<PauseIcon stroke="white" style="width: 1rem; height: 1rem;" />
			{/if}
		</button>
		<span class="timestamp">{timestamp}</span>
		<button onclick={fullscreen} class="fullscreen">
			<FullscreenIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
		</button>
	</div>
</div>

<style>
	.video-container {
		display: contents;
		position: relative;
	}

	.controls {
		position: absolute;
		width: 100%;
		height: 5rem;
		bottom: 0px;
		left: 0px;
		background-image: linear-gradient(to top, #000000, rgba(0, 0, 0, 0));

		.fullscreen {
			position: absolute;
			right: 2rem;
			bottom: 3rem;
		}

		.play {
			position: absolute;
			left: 2rem;
			bottom: 3.5rem;
		}

		.timestamp {
			color: white;
			position: absolute;
			left: 3rem;
			bottom: 1.5rem;
			font-size: 1rem;
			align-items: center;
		}

		.progress {
			background-color: #777777;
			height: 3px;
			width: calc(100% - 4rem);
			margin-left: 2rem;
			margin-right: 2rem;
			position: absolute;
			bottom: 2rem;
			border-radius: 100vmax;

			&::after {
				content: "";
				height: 100%;
				width: var(--progress-bar-width);
				background-color: white;
				position: absolute;
				top: 0px;
				left: 0px;
			}
		}
	}
</style>
