<script lang="ts">
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { select, type ProjectAudio } from "../../../api/project.svelte";
	import AudioMenu from "../../menus/AudioMenu.svelte";

	let { audio, menu }: { audio: ProjectAudio; menu: AudioMenu | null } = $props();

	function createWaveform(audio: string, canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d")!;
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		// Reset
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

		function base64ToArrayBuffer(base64: string) {
			const binaryString = atob(base64);
			const len = binaryString.length;
			const bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			return bytes.buffer;
		}

		let audioData = base64ToArrayBuffer(audio);
		audioContext.decodeAudioData(audioData).then(drawWaveform);

		function drawWaveform(audioBuffer: AudioBuffer) {
			const rawData = audioBuffer.getChannelData(0);
			const height = canvas.height;
			const width = canvas.width;
			const samples = height; // One line per vertical pixel
			const blockSize = Math.floor(rawData.length / samples);
			const filteredData = [];

			// Use peak detection to preserve sharp features
			for (let i = 0; i < samples; i++) {
				let max = 0;
				for (let j = 0; j < blockSize; j++) {
					const sample = rawData[i * blockSize + j];
					if (Math.abs(sample) > max) max = Math.abs(sample);
				}
				filteredData.push(max);
			}

			// Optional: normalize the waveform to fit max width
			const maxVal = Math.max(...filteredData) || 1;
			const normalizedData = filteredData.map(val => val / maxVal);

			const maxLineLength = width * 0.9; // 90% of canvas width
			ctx.clearRect(0, 0, width, height);
			ctx.beginPath();

			for (let i = 0; i < normalizedData.length; i++) {
				const y = i;
				const amplitude = normalizedData[i] * maxLineLength;
				const x = width / 2;

				ctx.moveTo(x - amplitude / 2, y);
				ctx.lineTo(x + amplitude / 2, y);
			}

			ctx.strokeStyle = "var(--crust)";
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

	let left = $state("");
	let top = $state("");

	function audioActions(event: MouseEvent) {
		if (menu) {
			menu.setId(audio.id);
			event.preventDefault();
			top = `${event.clientY}px`;
			left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `${event.clientX}px`;
			menu.showAt(top, left);
		}
	}

	let canvas: HTMLCanvasElement;

	$effect(() => {
		createWaveform(audio.properties["Embedded Source"]!, canvas);
		new Promise<number>(resolve => {
			const audioElement = new Audio(`data:audio/mp3;base64,${audio.properties["Embedded Source"]!}`);
			audioElement.addEventListener("loadedmetadata", () => {
				resolve(audioElement.duration);
			});
		}).then(duration => (audio.duration = duration));
	});
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button onclick={() => select([audio.id])} oncontextmenu={audioActions} class="audio" style:height="{audio.duration * 4}rem" style:top="{audio.properties['Start Time']! * 4}rem">
	<span contenteditable bind:textContent={audio.properties.Name}></span>
	<canvas bind:this={canvas} {@attach canvas => createWaveform(audio.properties["Embedded Source"]!, canvas)} width="100" height="400"></canvas>
</button>

<style>
	.audio {
		position: absolute;
		top: 0px;
		left: 4rem;
		width: 20%;
		height: 3rem;
		border-radius: 0.5rem;
		background: var(--mauve);
		border: 4px solid rgba(255, 255, 255, 50%);

		canvas {
			width: 100%;
			height: 100%;
		}

		span {
			position: absolute;
			writing-mode: vertical-rl;
			background-color: var(--mauve);
			border: 4px solid rgba(255, 255, 255, 50%);
			top: -4px;
			left: -4px;
			padding: 0.5rem;
			border-radius: 0.5em;
		}
	}
</style>
