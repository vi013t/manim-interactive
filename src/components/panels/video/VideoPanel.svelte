<script lang="ts">
	import { onMount } from "svelte";
	import { setCurrentTime } from "../../../api/timeline.svelte";

	let video: HTMLVideoElement;

	let gridOn = $state(false);

	onMount(() => {
		video.addEventListener("timeupdate", () => {
			setCurrentTime(video.currentTime);
		});

		video.addEventListener("seeking", () => {
			setCurrentTime(video.currentTime);
		});

		video.addEventListener("seeked", () => {
			setCurrentTime(video.currentTime);
		});

		const canvas = document.getElementById("grid-canvas") as HTMLCanvasElement;
		const { width, height } = canvas.getBoundingClientRect();
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d")!;

		const cellSize = 50; // 50px cells

		for (let x = 0; x <= canvas.width; x += cellSize) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
		}

		for (let y = 0; y <= canvas.height; y += cellSize) {
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
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<div class="container">
	<video bind:this={video} oncontextmenu={event => event.preventDefault()} controls id="video-source"></video>
	<canvas id="grid-canvas" style:display={gridOn ? "block" : "none"}></canvas>
</div>

<style>
	.container {
		width: 100%;
		aspect-ratio: 1.78;
		position: relative;
	}

	#video-source {
		width: 100%;
		height: 100%;
	}

	canvas {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 999;
		pointer-events: none;
	}
</style>
