<script lang="ts">
	import { onMount } from "svelte";
	import type { SelectProperty } from "../../../api/manim/property";
	import { getPropertiesFromId } from "../../../api/project.svelte";
	import Select from "../../util/Select.svelte";

	let {
		value = $bindable(),
		name,
		property,
		width,
		locked,
		id,
	}: {
		value: string;
		name: string;
		locked: boolean;
		property: SelectProperty;
		width: string;
		id?: number;
	} = $props();

	let properties = $derived(getPropertiesFromId(id!)!);
	let altHeld = $state(false);

	onMount(() => {
		document.addEventListener("keydown", event => {
			altHeld = event.altKey;
		});

		document.addEventListener("keyup", event => {
			altHeld = event.altKey;
		});
	});
</script>

<Select style="width: {width};" options={property.options} itemOverride={name === "Font" && altHeld ? (properties as { Text: string })["Text"] : undefined} {locked} bind:value />
