<script lang="ts">
	import { onMount } from "svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, getProjectObjects, selected } from "../../../api/project.svelte";
	import Select from "../../util/Select.svelte";

	let {
		value = $bindable(),
		name,
	}: {
		value: number;
		name: string;
	} = $props();

	function setProperty() {
		getItemFromId(selected()!)!.properties[name] = value;
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let altHeld = $state(false);

	onMount(() => {
		document.addEventListener("keydown", event => {
			altHeld = event.altKey;
		});

		document.addEventListener("keyup", event => {
			altHeld = event.altKey;
		});
	});

	let selectedOption: number = $state(value);
</script>

<Select
	options={getProjectObjects()
		.filter(object => object.id !== selected())
		.map(object => {
			const manimObject = objects.find(manimObject => manimObject.name === object.objectType)!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: object.name, icon: manimObject.icon, color: category.color };
		})}
	onSelect={name => {
		selectedOption = getProjectObjects().find(manimObject => manimObject.name === name)!.id;
		setProperty();
	}}
	value={(() => {
		if (selectedOption) {
			const object = getItemFromId(selectedOption)!;
			const manimObject = objects.find(manimObject => manimObject.name === object.objectType)!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: object.name, icon: manimObject.icon, color: category.color };
		} else {
			return "";
		}
	})()}
	style={`outline: 2px solid ${selectedOption ? "transparent" : "#f38ba8"}`}
/>
