<script lang="ts">
	import ColorPicker from "./ColorPicker.svelte";

	let { setProperty, width, locked }: { width: string; locked: boolean; setProperty(value: unknown): void } = $props();

	function trySetProperty(color: string) {
		setProperty(color);
	}
</script>

<ColorPicker {locked} onSelect={trySetProperty} />
