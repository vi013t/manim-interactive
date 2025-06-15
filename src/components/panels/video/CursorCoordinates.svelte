<script lang="ts">
	import { onMount } from "svelte";
	import { cursorIsIn, getMouseX, getMouseY } from "../../../api/client.svelte";
	import { getPreferences } from "../../../api/preferences.svelte";

	let videoWidth = screen.availWidth * (2 / 3);
	let videoHeight = (videoWidth * 9) / 16;
	1;
	let boxSize = videoWidth / 14;
	let centerX = screen.availWidth / 2;
	let centerY = videoHeight / 2 + 30; // navbar is 30px

	let x = $derived(((getMouseX() - centerX) / boxSize).toFixed(2));
	let y = $derived((-(getMouseY() - centerY) / boxSize).toFixed(2));

	let div: HTMLDivElement | null = $state(null);
	let altHeld = $state(false);
	let visible = $derived.by(() => {
		let rect = document.getElementById("video-source")?.getBoundingClientRect();
		return altHeld && (rect ? cursorIsIn(rect) : false);
	});

	onMount(() => {
		document.addEventListener("keydown", event => {
			altHeld = event.altKey;
			getPreferences().grid = visible;
		});
		document.addEventListener("keyup", event => {
			altHeld = event.altKey;
			getPreferences().grid = visible;
		});
		document.addEventListener("mousemove", event => {
			altHeld = event.altKey;
			getPreferences().grid = visible;
		});
	});
</script>

<div bind:this={div} style:display={visible ? "block" : "none"} style:top="{getMouseY()}px" style:left="{getMouseX()}px">
	({x}, {y})
</div>

<style>
	div {
		color: var(--text);
		background-color: var(--mantle);
		padding: 1rem;
		position: absolute;
		z-index: 999;
		border-radius: 0.5rem;
	}
</style>
