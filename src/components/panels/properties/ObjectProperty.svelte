<script lang="ts">
	import { onMount } from "svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getProperty } from "../../../api/manim/property";
	import { getItemFromId, getProject, type ProjectObject, selected } from "../../../api/project.svelte";
	import Select from "../../util/Select.svelte";

	let {
		value = $bindable(),
		errorMessage = $bindable(),
		width,
		locked,
	}: {
		value: number;
		width: string;
		locked: boolean;
		errorMessage: string | null;
	} = $props();

	function validate() {
		errorMessage = value === undefined ? "Selection must not be empty" : null;
	}

	function trySetProperty() {
		validate();
		if (errorMessage) return;
	}

	onMount(() => validate());

	let choice = $derived.by(() => {
		if (value !== undefined && value !== null) {
			const object = getItemFromId(value)! as ProjectObject;
			const manimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type")!)!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: getProperty(object, "Name")!, icon: manimObject.icon, color: category.color };
		} else {
			return undefined;
		}
	});
</script>

<Select
	{width}
	{locked}
	options={getProject().objects
		.filter(object => !selected().includes(object.id))
		.map(object => {
			const manimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type")!)!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: getProperty(object, "Name")!, icon: manimObject.icon, color: category.color };
		})}
	onSelect={name => {
		value = getProject().objects.find(projectObject => getProperty(projectObject, "Name") === name)!.id;
		trySetProperty();
	}}
	bind:value={choice}
	style={`width: ${width}; outline: 2px solid ${value !== undefined && value !== null ? "transparent" : "var(--red)"}`}
/>
