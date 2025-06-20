<script lang="ts">
	import ColorPicker from "./ColorPicker.svelte";

	let { setProperty, width }: { width: string; setProperty(value: unknown): void } = $props();

	function trySetProperty(color: string) {
		setProperty(color);
	}
</script>

<ColorPicker onSelect={trySetProperty} />
