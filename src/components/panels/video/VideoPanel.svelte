<script lang="ts">
	import { onMount } from "svelte";
	import { getPoint } from "../../../api/client.svelte";
	import { getPreferences, hasEverGeneratedVideo, isVideoLoaded } from "../../../api/preferences.svelte";
	import { getProjectAnimations, getProjectAudios, projectHasErrors } from "../../../api/project.svelte";
	import { setCurrentTime } from "../../../api/timeline.svelte";
	import CursorCoordinates from "./CursorCoordinates.svelte";

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
		if (getProjectAudios().length) {
			(document.getElementById(`audio-${getProjectAudios()[0].id}`) as HTMLAudioElement).play();
		}
	}

	function onPause() {
		if (getProjectAudios().length) {
			(document.getElementById(`audio-${getProjectAudios()[0].id}`) as HTMLAudioElement).pause();
		}
	}
</script>

<div id="video-panel" class="container">
	{#if getProjectAnimations().length > 0}
		{#if !isVideoLoaded()}
			<div id="novideo">
				<h1>Reloading...</h1>
				<p>Reloading animation video after your changes. When the video loads, it will appear here.</p>
			</div>
		{:else if projectHasErrors() && !hasEverGeneratedVideo()}
			<div id="novideo">
				<h1>Project Has Errors</h1>
				<p>The project contains errors, so a video can't be generated. Fix the errors to generate the animation video.</p>
			</div>
		{/if}

		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			style:display={isVideoLoaded() && !(projectHasErrors() && !hasEverGeneratedVideo()) ? "block" : "none"}
			ontimeupdate={event => setCurrentTime((event.target as HTMLVideoElement).currentTime)}
			onseeked={event => setCurrentTime((event.target as HTMLVideoElement).currentTime)}
			onseeking={event => setCurrentTime((event.target as HTMLVideoElement).currentTime)}
			oncontextmenu={event => event.preventDefault()}
			controls
			onplay={onPlay}
			onpause={onPause}
			id="video-source"
		></video>
	{:else}
		<div id="novideo">
			<h1>No Animations Yet</h1>
			<p>When you add an animation, the video will appear here.</p>
		</div>
	{/if}
	<canvas id="grid-canvas" style:opacity={getProjectAnimations().length > 0 && isVideoLoaded() && getPreferences().grid ? "100%" : "0%"}></canvas>
	{#if getProjectAnimations().length > 0 && isVideoLoaded() && getPreferences().grid && getPoint()}
		<div class="point" style:left="{videoWidth / 2 + boxSize * getPoint()![0]}px" style:top="{centerY - boxSize * getPoint()![1]}px">
			<span>({getPoint()![0]}, {getPoint()![1]})</span>
		</div>
	{/if}
</div>
<CursorCoordinates />

<style>
	#video-panel {
		position: relative;
	}

	.container {
		width: 100%;
		aspect-ratio: 1.78;
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

	#video-source {
		width: 100%;
		height: 100%;
		display: block;
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
</style>
