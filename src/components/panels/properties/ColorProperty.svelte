<script lang="ts">
	import type { ColorProperty } from "../../../api/manim/property";
	import ColorPicker from "./ColorPicker.svelte";

	let { name, property, setProperty }: { name: string; property: ColorProperty; setProperty(value: unknown): void } = $props();

	function trySetProperty(color: string) {
		setProperty(color);
	}
</script>

<ColorPicker onSelect={trySetProperty} />
