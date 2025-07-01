<script lang="ts">
	import { onMount } from "svelte";
	import { getFromCache, getPoint } from "../../../api/client.svelte";
	import { objectPreviewLoaded } from "../../../api/codegen.svelte";
	import { hasEverGeneratedVideo, isVideoLoaded } from "../../../api/preferences.svelte";
	import { getAnimationFromId, getObjectFromId, getProject, getSingleSelection, isAudioLoaded, projectHasErrors, projectReloadKey } from "../../../api/project.svelte";
	import { setCurrentTime } from "../../../api/timeline.svelte";
	import CursorCoordinates from "./CursorCoordinates.svelte";
	import Video from "./Video.svelte";

	let { draggable = false }: { draggable?: boolean } = $props();

	let videoWidth = screen.availWidth * (2 / 3);
	let videoHeight = (videoWidth * 9) / 16;
	let boxSize = videoWidth / 14;
	let centerY = videoHeight / 2; // navbar is 30px

	onMount(() => {
		const canvas = document.getElementById("grid-canvas") as HTMLCanvasElement;
		const { width, height } = canvas.getBoundingClientRect();
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d")!;

		const cellSize = canvas.width / 14; // 50px cells

		for (let x = 0; x <= canvas.width; x += cellSize) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
		}

		for (let y = -10; y <= canvas.height; y += cellSize) {
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
		}

		ctx.lineWidth = 1;
		ctx.strokeStyle = "#585b70";
		ctx.stroke();

		// Draw center axis lines
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		ctx.lineWidth = 2;
		ctx.strokeStyle = "#a6adc8";

		// Vertical center line (Y-axis)
		ctx.beginPath();
		ctx.moveTo(centerX, 0);
		ctx.lineTo(centerX, canvas.height);
		ctx.stroke();

		// Horizontal center line (X-axis)
		ctx.beginPath();
		ctx.moveTo(0, centerY);
		ctx.lineTo(canvas.width, centerY);
		ctx.stroke();
	});

	function onPlay() {
		let element = document.getElementById(`master-audio`) as HTMLAudioElement;
		element.currentTime = video!.element()!.currentTime;
		element.play();
		updateTime();
	}

	function updateTime() {
		setCurrentTime(video!.element()!.currentTime + timeOffset);
		if (!video!.element()!.paused && !video!.element()!.ended) {
			requestAnimationFrame(updateTime);
		}
	}

	function onPause() {
		let element = document.getElementById(`master-audio`) as HTMLAudioElement;
		element.currentTime = video!.element()!.currentTime;
		element.pause();
	}

	let video: Video | null = $state(null);

	let objectPreviewImage = $derived(
		getSingleSelection() && getObjectFromId(getSingleSelection()!) ? `data:image/png;base64,${getObjectFromId(getSingleSelection()!)!.previewData}` : null,
	);
	let animationPreviewVideo = $derived(
		getSingleSelection() && getAnimationFromId(getSingleSelection()!) ? `data:video/mp4;base64,${getAnimationFromId(getSingleSelection()!)!.previewData}` : null,
	);

	let timeOffset = $derived(animationPreviewVideo && !getFromCache("showMovieOverPreview") ? getAnimationFromId(getSingleSelection()!)!.properties["Start Time"]! : 0);

	let videoSrc = $derived(animationPreviewVideo && !getFromCache("showMovieOverPreview") ? animationPreviewVideo : `data:video/mp4;base64,${getProject().cache.videoData!}`);

	$effect(() => {
		// This does nothing - but it tells $effect() to reload and call again when videoSrc changes
		videoSrc;

		try {
			if (!objectPreviewImage || getFromCache("showMovieOverPreview")) {
				video?.element()?.load();
				video?.element()?.play();
			}
		} catch (e) {}
	});
</script>

{#key projectReloadKey()}
	<div id="video-panel" class="container" data-tauri-drag-region={draggable}>
		{#if !getFromCache("showMovieOverPreview")}
			{#if animationPreviewVideo}
				<span class="preview-text">Animation "{getAnimationFromId(getSingleSelection()!)!.properties["Name"]}" Preview</span>
			{/if}
			{#if objectPreviewLoaded()}
				{#if objectPreviewImage}
					<span class="preview-text">Object "{getObjectFromId(getSingleSelection()!)!.properties["Name"]}" Preview</span>
					<img src={objectPreviewImage} id="preview-image" class="preview" alt="preview" />
				{/if}
			{:else}
				<div id="novideo" data-tauri-drag-region={draggable}>
					<h1>Reloading...</h1>
					<p>Reloading object preview image after your changes. When the image loads, it will appear here.</p>
				</div>
			{/if}
		{/if}

		{#if getProject().animations.length > 0}
			{#if !isVideoLoaded() && (!objectPreviewImage || getFromCache("showMovieOverPreview"))}
				<div id="novideo" data-tauri-drag-region={draggable}>
					<h1>Reloading...</h1>
					<p>Reloading animation video after your changes. When the video loads, it will appear here.</p>
				</div>
			{:else if projectHasErrors() && !hasEverGeneratedVideo() && (!objectPreviewImage || getFromCache("showMovieOverPreview"))}
				<div id="novideo" data-tauri-drag-region={draggable}>
					<h1>Project Has Errors</h1>
					<p>The project contains errors, so a video can't be generated. Fix the errors to generate the animation video.</p>
				</div>
			{/if}

			{#if (isVideoLoaded() && !(projectHasErrors() && !hasEverGeneratedVideo()) && !objectPreviewImage && !animationPreviewVideo) || getFromCache("showMovieOverPreview")}
				<span class="preview-text">Movie "{getProject().settings.outputFileName}"</span>
			{/if}

			{#if !isAudioLoaded()}
				<div id="novideo" data-tauri-drag-region={draggable}>
					<h1>Reloading Audio...</h1>
					<p>Reloading audio after your changes. When the audio loads, the video will appear here.</p>
				</div>
			{/if}

			<!-- svelte-ignore a11y_media_has_caption -->
			<Video
				style="display: {isAudioLoaded() && isVideoLoaded() && !(projectHasErrors() && !hasEverGeneratedVideo()) && (!objectPreviewImage || getFromCache('showMovieOverPreview'))
					? 'block'
					: 'none'}"
				ontimeupdate={event => setCurrentTime((event.target as HTMLVideoElement).currentTime + timeOffset)}
				onseeked={event => setCurrentTime((event.target as HTMLVideoElement).currentTime + timeOffset)}
				onseeking={event => setCurrentTime((event.target as HTMLVideoElement).currentTime + timeOffset)}
				oncontextmenu={event => event.preventDefault()}
				onplay={onPlay}
				{draggable}
				onpause={onPause}
				id="video-source"
				class="preview"
				bind:this={video}
				src={videoSrc}
			/>
		{:else if !objectPreviewImage || getFromCache("showMovieOverPreview")}
			<div id="novideo" data-tauri-drag-region={draggable}>
				<h1>No Animations Yet</h1>
				<p>When you add an animation, the video will appear here.</p>
			</div>
		{/if}

		<!-- Grid -->
		<canvas
			data-tauri-drag-region={draggable}
			id="grid-canvas"
			style:opacity={getProject().animations.length > 0 && isVideoLoaded() && getFromCache("grid") ? "100%" : "0%"}
		></canvas>

		<!-- Point -->
		{#if getProject().animations.length > 0 && isVideoLoaded() && getFromCache("grid") && getPoint()}
			<div class="point" style:left="{videoWidth / 2 + boxSize * getPoint()![0]}px" style:top="{centerY - boxSize * getPoint()![1]}px">
				<span>({getPoint()![0]}, {getPoint()![1]})</span>
			</div>
		{/if}
	</div>
	<CursorCoordinates />
{/key}

<style>
	.container {
		width: 100%;
		position: relative;
	}

	.point {
		position: absolute;
		background-color: var(--red);
		width: 0.35rem;
		height: 0.35rem;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		cursor: move;

		> span {
			width: 10rem;
			position: absolute;
			top: 1rem;
			left: 1rem;
			color: var(--red);
		}

		&::before {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: var(--red);
			opacity: 0.5;
			height: 400%;
			width: 400%;
			border-radius: 50%;
		}
	}

	#novideo {
		width: 100%;
		height: 100%;
		background-color: var(--crust);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		h1 {
			color: var(--text);
			font-size: 2rem;
		}

		p {
			color: var(--overlay-2);
			font-size: 1rem;
		}
	}

	:global(.preview) {
		width: 100%;
		height: 100%;
	}

	canvas {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 9;
		pointer-events: none;
	}
	.preview-text {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		color: white;
		background: var(--crust);
		padding: 1rem;
		border-radius: 0.5rem;
		color: var(--text);
	}
</style>
