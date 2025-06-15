<script lang="ts">
	import { onMount } from "svelte";
	import type { SelectProperty } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, selected } from "../../../api/project.svelte";
	import Select from "../../util/Select.svelte";

	let {
		value = $bindable(),
		name,
		property,
	}: {
		value: string;
		name: string;
		property: SelectProperty;
	} = $props();

	function setProperty() {
		(getItemFromId(selected()!)!.properties as any)[name] = value;
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let item = $derived(getItemFromId(selected()!)!);
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

<Select onSelect={setProperty} options={property.options} itemOverride={name === "Font" && altHeld ? (item.properties as { Text: string })["Text"] : undefined} bind:value />
