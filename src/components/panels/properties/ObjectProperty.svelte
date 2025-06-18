<script lang="ts">
	import { onMount } from "svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getProperty } from "../../../api/manim/property";
	import { addError, getItemFromId, getProjectObjects, type ProjectObject, removeError, selected } from "../../../api/project.svelte";
	import Select from "../../util/Select.svelte";

	let {
		value = $bindable(),
		name,
		errorMessage = $bindable(),
		setProperty,
	}: {
		value: number;
		name: string;
		errorMessage: string | null;
		setProperty(value: unknown): void;
	} = $props();

	function validate() {
		errorMessage = selectedOption === undefined ? "Selection must not be empty" : null;
		if (errorMessage) addError({ objectId: selected()[0], propertyName: name });
		else removeError({ objectId: selected()[0], propertyName: name });
	}

	function trySetProperty() {
		validate();
		if (errorMessage) return;
		setProperty(selectedOption);
	}

	let selectedOption: number = $state(value);

	onMount(() => validate());

	let choice = $derived.by(() => {
		if (selectedOption !== undefined && selectedOption !== null) {
			const object = getItemFromId(selectedOption)! as ProjectObject;
			const manimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type")!)!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: getProperty(object, "Name")!, icon: manimObject.icon, color: category.color };
		} else {
			return undefined;
		}
	});
</script>

<Select
	options={getProjectObjects()
		.filter(object => !selected().includes(object.id))
		.map(object => {
			const manimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type")!)!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: getProperty(object, "Name")!, icon: manimObject.icon, color: category.color };
		})}
	onSelect={name => {
		selectedOption = getProjectObjects().find(projectObject => getProperty(projectObject, "Name") === name)!.id;
		trySetProperty();
	}}
	bind:value={choice}
	style={`outline: 2px solid ${selectedOption !== undefined && selectedOption !== null ? "transparent" : "var(--red)"}`}
/>
