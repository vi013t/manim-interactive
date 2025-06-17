<script lang="ts">
	import type { ColorProperty } from "../../../api/manim/property";
	import { getPropertiesFromId, selected } from "../../../api/project.svelte";
	import ColorPicker from "./ColorPicker.svelte";

	let { name, property }: { name: string; property: ColorProperty } = $props();

	function setProperty(color: string) {
		(getPropertiesFromId(selected()![0])! as any)[name] = color;
	}
</script>

<ColorPicker onSelect={setProperty} />
