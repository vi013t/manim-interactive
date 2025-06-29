<script lang="ts">
	import { onMount } from "svelte";
	import type { HTMLVideoAttributes } from "svelte/elements";
	import { cache, getFromCache } from "../../../api/client.svelte";
	import FilledPlayIcon from "../../icons/FilledPlayIcon.svelte";
	import FullscreenIcon from "../../icons/FullscreenIcon.svelte";
	import MuteIcon from "../../icons/MuteIcon.svelte";
	import PauseIcon from "../../icons/PauseIcon.svelte";
	import VideoLoopIcon from "../../icons/VideoLoopIcon.svelte";
	import VolumeIcon from "../../icons/VolumeIcon.svelte";

	let attributes: Omit<HTMLVideoAttributes, "controls"> = $props();

	let video: HTMLVideoElement | null = $state(null);
	let progressBar: HTMLButtonElement | null = $state(null);
	let volumeSlider: HTMLButtonElement | null = $state(null);
	let volumeContainer: HTMLElement | null = $state(null);
	let paused = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let seeking = $state(false);
	let seekingVolume = $state(false);
	let loaded = $state(false);
	let showVolumeSlider = $state(false);
	let previousVolume = $state(getFromCache("volume"));
	let volumeChanged = $state(false);

	export function element() {
		return video;
	}

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

	function seekVolume(event: MouseEvent) {
		previousVolume = 1 - Math.max(Math.min((event.clientY - volumeSlider!.getBoundingClientRect().top) / volumeSlider!.getBoundingClientRect().height, 1), 0);
		cache("volume", previousVolume);
		volumeChanged = true;
	}

	let progressBarWidth = $derived.by(() => {
		loaded;
		if (!progressBar) return "0px";
		return `${(currentTime / duration) * progressBar.getBoundingClientRect().width}px`;
	});

	let volumeBarHeight = $derived.by(() => {
		if (!volumeSlider) return "0px";
		return `${getFromCache("volume") * volumeSlider.getBoundingClientRect().height}px`;
	});

	function beginSeeking(event: MouseEvent) {
		seeking = true;
		seek(event);
	}

	function beginSeekingVolume(event: MouseEvent) {
		seekingVolume = true;
		seekVolume(event);
	}

	onMount(() => {
		video?.addEventListener("loadedmetadata", event => {
			loaded = true;
		});

		document.addEventListener("mousemove", event => {
			if (seeking) seek(event);
			if (seekingVolume) seekVolume(event);
		});

		document.addEventListener("mouseup", event => {
			seeking = false;
			seekingVolume = false;
		});

		document.addEventListener("click", event => {
			if (!event.composedPath().includes(volumeContainer!)) {
				showVolumeSlider = false;
			}
		});
	});

	function toggleMute() {
		if (getFromCache("volume") === previousVolume) cache("volume", 0);
		else cache("volume", previousVolume);
	}

	function volumeContainerUnhover() {
		if (!volumeChanged) {
			showVolumeSlider = false;
		}
	}

	function volumeContainerHover() {
		showVolumeSlider = true;
		volumeChanged = false;
	}

	function toggleLoop() {
		cache("loopVideo", !getFromCache("loopVideo"));
		if (getFromCache("loopVideo")) video?.play();
	}
</script>

<div class="video-container" style={attributes.style}>
	<video onclick={togglePlay} bind:duration bind:currentTime bind:paused bind:this={video} {...attributes} loop={getFromCache("loopVideo")}></video>
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
		<button class="loop" onclick={toggleLoop} style:--loop-slash-display={getFromCache("loopVideo") ? "none" : "block"}>
			<VideoLoopIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
		</button>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div onmouseleave={volumeContainerUnhover} onmouseenter={volumeContainerHover} bind:this={volumeContainer} class="volume-container">
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button
				style:display={showVolumeSlider ? "block" : "none"}
				onmousedown={beginSeekingVolume}
				bind:this={volumeSlider}
				style:--volume-bar-height={volumeBarHeight}
				class="volume-slider"
			></button>
			<button onclick={toggleMute}>
				{#if getFromCache("volume") !== previousVolume}
					<MuteIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
				{:else}
					<VolumeIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
				{/if}
			</button>
		</div>
		<button onclick={fullscreen} class="fullscreen">
			<FullscreenIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
		</button>
	</div>
</div>

<style>
	video {
		cursor: pointer;
	}

	.video-container {
		display: contents;
		position: relative;
	}

	.controls {
		position: absolute;
		width: 100%;
		height: 7rem;
		bottom: 0px;
		left: 0px;
		background-image: linear-gradient(to top, #000000, rgba(0, 0, 0, 0%));

		.fullscreen {
			position: absolute;
			right: 2rem;
			bottom: 3rem;
		}

		.loop {
			position: absolute;
			bottom: 3rem;
			right: 7rem;

			&::after {
				content: "";
				height: 100%;
				width: 2px;
				background-color: white;
				position: absolute;
				top: 0px;
				left: 50%;
				transform: translateX(-50%) rotate(10deg);
				display: var(--loop-slash-display);
			}
		}

		.volume-container {
			position: absolute;
			right: 4.5rem;
			bottom: 3rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;

			.volume-slider {
				width: 4px;
				height: 5rem;
				background: #777777;
				border-radius: 100vmax;
				position: relative;

				&::after {
					content: "";
					width: 100%;
					height: var(--volume-bar-height);
					background-color: white;
					position: absolute;
					bottom: 0px;
					left: 0px;
					border-radius: 100vmax;
				}
			}
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
			bottom: -0.5rem;
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
