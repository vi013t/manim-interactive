<script lang="ts">
	import { onMount } from "svelte";
	import type { SelectProperty } from "../../../api/manim/property";
	import { getPropertiesFromId, selected } from "../../../api/project.svelte";
	import Select from "../../util/Select.svelte";

	let {
		value = $bindable(),
		name,
		property,
		width,
		setProperty,
	}: {
		value: string;
		name: string;
		property: SelectProperty;
		width: string;
		setProperty(value: unknown): void;
	} = $props();

	function trySetProperty() {
		setProperty(value);
	}

	let properties = $derived(getPropertiesFromId(selected()[0])!);
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

<Select
	style="width: {width};"
	onSelect={trySetProperty}
	options={property.options}
	itemOverride={name === "Font" && altHeld ? (properties as { Text: string })["Text"] : undefined}
	bind:value
/>
