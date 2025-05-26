<script lang="ts">
	import { onMount } from "svelte";
	import { getMouseX, getMouseY } from "../../../api/client.svelte";
	import { getPreferences } from "../../../api/preferences.svelte";

	let x = $derived(-(-((getMouseX() - screen.width / 2) / 120)).toFixed(1));
	let y = $derived(-((getMouseY() + 210 - 0.28125 * screen.width) / 123).toFixed(1));

	let visible = $state(false);

	onMount(() => {
		document.addEventListener("keydown", event => {
			visible = event.altKey;
			getPreferences().grid = event.altKey;
		});
		document.addEventListener("keyup", event => {
			visible = event.altKey;
			getPreferences().grid = event.altKey;
		});
		document.addEventListener("mousemove", event => {
			visible = event.altKey;
			getPreferences().grid = event.altKey;
		});
	});
</script>

<div style:display={visible ? "block" : "none"} style:top="{getMouseY()}px" style:left="{getMouseX()}px">
	({x}, {y})
</div>

<style>
	div {
		color: #cdd6f4;
		background-color: #181825;
		padding: 1rem;
		position: absolute;
		z-index: 999;
		border-radius: 0.5rem;
	}
</style>
