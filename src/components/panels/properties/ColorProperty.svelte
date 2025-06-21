<script lang="ts">
	import ColorPicker from "./ColorPicker.svelte";

	let { width, locked, value = $bindable() }: { value: string; width: string; locked: boolean } = $props();
</script>

<ColorPicker bind:value {width} {locked} />
