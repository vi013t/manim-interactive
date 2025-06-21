<script lang="ts">
	let { point1, point2 }: { point1: [number, number]; point2: [number, number] } = $props();

	let left = $derived(`${Math.min(point1[0], point2[0])}px`);
	let top = $derived(`${Math.min(point1[1], point2[1])}px`);
	let width = $derived(`${Math.abs(point1[0] - point2[0])}px`);
	let height = $derived(`${Math.abs(point1[1] - point2[1])}px`);
</script>

<div id="selection-box" style:left style:top style:width style:height></div>

<style>
	div {
		position: absolute;
		border: 1px solid var(--lavender);
		z-index: 9999;

		&::before {
			content: "";
			display: block;
			width: 100%;
			height: 100%;
			background-color: var(--lavender);
			opacity: 25%;
		}
	}
</style>
