<script lang="ts">
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { getProjectAudios, type ProjectAudio } from "../../../api/project.svelte";
	import { currentTime } from "../../../api/timeline.svelte";
	import AudioMenu from "../../menus/AudioMenu.svelte";

	let { audio }: { audio: ProjectAudio } = $props();

	function createWaveform(audio: string, canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d")!;
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

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

			ctx.strokeStyle = "#11111b";
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

	let left = $state("");
	let top = $state("");
	let audioActionsMenu: AudioMenu;

	function audioActions(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
		audioActionsMenu.show();
	};

	$effect(() => {
		if (getProjectAudios().length) {
			let audio = (document.getElementById(`audio-${getProjectAudios()[0].id}`) as HTMLAudioElement | null);
			if (audio) audio.currentTime = currentTime();
		}
	});
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button oncontextmenu={audioActions} class="audio" style:height="{audio.duration * 4}rem">
	<audio id="audio-{audio.id}" src="data:audio/mp3;base64,{audio.data}"></audio>
	<canvas {@attach canvas => createWaveform(audio.data, canvas)} width="100" height="400"></canvas>
</button>
<AudioMenu bind:this={audioActionsMenu} {top} {left} id={audio.id} />

<style>
	.audio {
		position: absolute;
		top: 0px;
		left: 20%;
		width: 20%;
		height: 3rem;
		border-radius: 0.5rem;
		background: #cba6f7;
		border: 4px solid rgba(255, 255, 255, 50%);

		canvas {
			width: 100%;
			height: 100%;
		}
	}
</style>
