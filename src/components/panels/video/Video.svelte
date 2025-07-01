<script lang="ts">
	import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow";
	import { getAllWindows, getCurrentWindow } from "@tauri-apps/api/window";
	import { onMount } from "svelte";
	import type { HTMLVideoAttributes } from "svelte/elements";
	import { cache, cursorIsIn, getFromCache, type Cache, type CacheKey } from "../../../api/client.svelte";
	import { type Preferences } from "../../../api/preferences.svelte";
	import { serializeProject, type ProjectAnimation, type ProjectAudio, type ProjectObject } from "../../../api/project.svelte";
	import CaretIcon from "../../icons/CaretIcon.svelte";
	import CloseIcon from "../../icons/CloseIcon.svelte";
	import FilledPlayIcon from "../../icons/FilledPlayIcon.svelte";
	import FullscreenIcon from "../../icons/FullscreenIcon.svelte";
	import GridIcon from "../../icons/GridIcon.svelte";
	import LoopIcon from "../../icons/LoopIcon.svelte";
	import MuteIcon from "../../icons/MuteIcon.svelte";
	import PauseIcon from "../../icons/PauseIcon.svelte";
	import PictureInPictureIcon from "../../icons/PictureInPictureIcon.svelte";
	import ProjectorIcon from "../../icons/ProjectorIcon.svelte";
	import ResolutionIcon from "../../icons/ResolutionIcon.svelte";
	import UnfullscreenIcon from "../../icons/UnfullscreenIcon.svelte";
	import VideoLoopIcon from "../../icons/VideoLoopIcon.svelte";
	import VolumeIcon from "../../icons/VolumeIcon.svelte";
	import Tooltip from "../../util/Tooltip.svelte";

	let { draggable = false, ...attributes }: { draggable?: boolean } & Omit<HTMLVideoAttributes, "controls" | "loop"> = $props();

	let video: HTMLVideoElement | null = $state(null);
	let progressBar: HTMLButtonElement | null = $state(null);
	let volumeSlider: HTMLButtonElement | null = $state(null);
	let volumeContainer: HTMLElement | null = $state(null);
	let paused = $state(false);
	let ended = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let seeking = $state(false);
	let seekingVolume = $state(false);
	let loaded = $state(false);
	let showVolumeSlider = $state(false);
	let previousVolume = $state(getFromCache("volume"));
	let volumeChanged = $state(false);
	let controlsOpacity: "100%" | "0%" = $state("0%");
	let isPlaying = $derived.by(() => currentTime > 0 && !paused && !ended);
	let controlsOpacityTimeoutID: number | null = $state(null);

	export function element() {
		return video;
	}

	function toggleFullscreen() {
		const appWindow = getCurrentWindow();
		if (getFromCache("videoState") === "fullscreen") {
			cache("videoState", "normal");
			appWindow.setFullscreen(false);
		} else {
			cache("videoState", "fullscreen");
			appWindow.setFullscreen(true);
		}
	}

	export type WebviewData = {
		preferences: Preferences;
		cache: Cache;
		animations: ProjectAnimation[];
		objects: ProjectObject[];
		audios: ProjectAudio[];
	};

	let resizeCounter = $state(0);

	function togglePip() {
		if (getFromCache("videoState") === "pip") cache("videoState", "normal");
		else {
			const webview = new WebviewWindow("video-pip", {
				url: "/video",
				decorations: false,
				alwaysOnTop: true,
				width: 656,
				height: 369,
				resizable: true,
				title: "Manim Interactive - Video Picture-in-Picture",
			});

			localStorage.setItem("project", serializeProject());

			webview.once("tauri://error", function (error) {
				console.error(error);
			});

			webview.onResized(() => {
				resizeCounter++;
			});

			webview.onCloseRequested(event => {
				cache("videoState", "normal");
			});

			cache("videoState", "pip");
			cache("videoPipWindow", webview);
		}
	}

	function toggleCache(key: CacheKey<boolean>) {
		return function () {
			cache(key, !getFromCache(key));
		};
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
		getFromCache("videoState");
		if (!progressBar) return "0px";
		return `${(currentTime / duration) * progressBar.getBoundingClientRect().width}px`;
	});

	let volumeBarHeight = $derived.by(() => {
		loaded;
		resizeCounter;

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

	function showControls() {
		if (controlsOpacityTimeoutID !== null) clearTimeout(controlsOpacityTimeoutID);
		controlsOpacity = "100%";
		controlsOpacityTimeoutID = setTimeout(() => {
			controlsOpacity = "0%";
			controlsOpacityTimeoutID = null;
		}, 1000);
	}

	onMount(() => {
		video?.addEventListener("loadedmetadata", _event => {
			loaded = true;
		});

		document.addEventListener("mousemove", event => {
			if (seeking) seek(event);
			if (seekingVolume) seekVolume(event);

			if (video && cursorIsIn(video.getBoundingClientRect()) && isPlaying) {
				showControls();
			}
		});

		document.addEventListener("mouseup", _event => {
			seeking = false;
			seekingVolume = false;
		});

		document.addEventListener("click", event => {
			if (!event.composedPath().includes(volumeContainer!)) {
				showVolumeSlider = false;
			}
		});

		video!.addEventListener("pause", _event => {
			if (controlsOpacityTimeoutID !== null) clearTimeout(controlsOpacityTimeoutID);
			controlsOpacity = "100%";
		});

		video!.addEventListener("pause", _event => {
			if (controlsOpacityTimeoutID !== null) clearTimeout(controlsOpacityTimeoutID);
			controlsOpacity = "100%";
		});

		video!.addEventListener("ended", _event => {
			if (controlsOpacityTimeoutID !== null) clearTimeout(controlsOpacityTimeoutID);
			controlsOpacity = "100%";
		});

		video!.addEventListener("click", _event => {
			togglePlay();
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

	let container: HTMLElement;
	let boundingBox = $derived.by(() => container?.getBoundingClientRect() ?? null);

	async function closePip() {
		(await getAllWindows()).find(window => window.label === "main")!.emit("close-pip");
		getCurrentWebviewWindow().close();
	}

	function togglePipAlwaysOnTop() {
		toggleCache("videoPipAlwaysOnTop")();
		getCurrentWebviewWindow().setAlwaysOnTop(getFromCache("videoPipAlwaysOnTop"));
	}
</script>

<div
	bind:this={container}
	class="video-container"
	style={attributes.style}
	style:position={getFromCache("videoState") === "normal" ? "relative" : "absolute"}
	style:left={getFromCache("videoState") === "fullscreen" ? `-${boundingBox.left}px` : "0px"}
	style:top={getFromCache("videoState") === "fullscreen" ? `-${boundingBox.top}px` : "0px"}
	data-tauri-drag-region={draggable}
>
	<video
		data-tauri-drag-region={draggable}
		style:width={getFromCache("videoState") === "fullscreen" ? `100vw` : undefined}
		style:height={getFromCache("videoState") === "fullscreen" ? `100vh` : undefined}
		bind:ended
		bind:duration
		bind:currentTime
		bind:paused
		bind:this={video}
		loop={getFromCache("loopVideo")}
		{...attributes}
	></video>
	<div class="controls" style:opacity={controlsOpacity} data-tauri-drag-region={draggable}>
		<button aria-label="Seek video" bind:this={progressBar} style:--progress-bar-width={progressBarWidth} class="progress" onmousedown={beginSeeking}></button>
		<button onclick={togglePlay} class="play">
			{#if paused}
				<FilledPlayIcon stroke="white" style="width: 1rem; height: 1rem;" />
			{:else}
				<PauseIcon stroke="white" style="width: 1rem; height: 1rem;" />
			{/if}
		</button>
		<span class="video-control-timestamp">{timestamp}</span>
		<button class="pip" onclick={togglePip} style:--loop-slash-display={getFromCache("loopVideo") ? "none" : "block"}>
			<PictureInPictureIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
		</button>
		<button class="loop" onclick={toggleLoop} style:--loop-slash-display={getFromCache("loopVideo") ? "none" : "block"}>
			<VideoLoopIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
		</button>
		<div
			tabindex="0"
			aria-valuenow={getFromCache("volume")}
			role="slider"
			onmouseleave={volumeContainerUnhover}
			onmouseenter={volumeContainerHover}
			bind:this={volumeContainer}
			class="volume-container"
		>
			<button
				aria-label="Change video volume"
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
		<button onclick={toggleFullscreen} class="fullscreen">
			{#if getFromCache("videoState") === "fullscreen"}
				<UnfullscreenIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
			{:else}
				<FullscreenIcon stroke="white" style="width: 1.5rem; height: 1.5rem;" />
			{/if}
		</button>
	</div>
	{#if draggable}
		<div class="pip-controls" style:opacity={controlsOpacity}>
			<div class="preference-toggles">
				<button onclick={toggleCache("lowRes")}>
					<ResolutionIcon stroke={getFromCache("lowRes") ? "white" : "#777777"} style="width: 1.25rem; height: 1.25rem;" />
				</button>
				<button onclick={toggleCache("grid")}>
					<GridIcon stroke={getFromCache("grid") ? "white" : "#777777"} style="width: 1.25rem; height: 1.25rem;" />
				</button>
				<button onclick={toggleCache("showMovieOverPreview")}>
					<ProjectorIcon stroke={getFromCache("showMovieOverPreview") ? "white" : "#777777"} style="width: 1.25rem; height: 1.25rem;" />
				</button>
				<button onclick={toggleCache("loopVideo")}>
					<LoopIcon stroke={getFromCache("loopVideo") ? "white" : "#777777"} style="width: 1.25rem; height: 1.25rem;" />
				</button>
			</div>
			<div class="pip-controls-right">
				<Tooltip text="Toggle always on top" element="button" onclick={togglePipAlwaysOnTop}>
					<CaretIcon stroke={getFromCache("videoPipAlwaysOnTop") ? "white" : "#777777"} style="width: 1.25rem; height: 1.25rem;" />
				</Tooltip>
				<button onclick={closePip}>
					<CloseIcon stroke="white" style="width: 1.25rem; height: 1.25rem;" />
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.pip-controls {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
	}

	.preference-toggles {
		position: absolute;
		left: 0rem;
		top: 0rem;
		display: flex;
		padding: 0.5rem;

		> button {
			padding: 0.5rem;
		}
	}

	.pip-controls-right {
		position: absolute;
		right: 0rem;
		top: 0rem;
		display: flex;
		padding: 0.5rem;

		> button {
			padding: 0.5rem;
		}
	}

	video {
		cursor: pointer;
	}

	.video-container {
		display: contents;
		z-index: 9;
		background-color: black;
	}

	.controls {
		transition: opacity 0.25s;
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

		.pip {
			position: absolute;
			bottom: 3rem;
			right: 10rem;
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

		.video-control-timestamp {
			display: block;
			color: white;
			position: absolute;
			bottom: 3.4rem;
			left: 4rem;
			font-size: 1rem;
			align-items: center;
			padding: 0px;
			height: fit-content;
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
