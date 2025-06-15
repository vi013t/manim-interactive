<script lang="ts">
	import { onMount } from "svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getProperty } from "../../../api/manim/properties";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, getProjectObjects, type ProjectObject, selected } from "../../../api/project.svelte";
	import Select from "../../util/Select.svelte";

	let {
		value = $bindable(),
		name,
	}: {
		value: number;
		name: string;
	} = $props();

	function setProperty() {
		(getItemFromId(selected()!)!.properties as any)[name] = value;
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
			const manimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type"))!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: object.name, icon: manimObject.icon, color: category.color };
		})}
	onSelect={name => {
		selectedOption = getProjectObjects().find(manimObject => manimObject.name === name)!.id;
		setProperty();
	}}
	value={(() => {
		if (selectedOption !== undefined) {
			const object = getItemFromId(selectedOption)! as ProjectObject;
			const manimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type"))!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: object.name, icon: manimObject.icon, color: category.color };
		} else {
			return undefined;
		}
	})()}
	style={`outline: 2px solid ${selectedOption !== undefined ? "transparent" : "var(--red)"}`}
/>
