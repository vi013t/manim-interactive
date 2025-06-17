<script lang="ts">
	import { onMount } from "svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getProperty } from "../../../api/manim/properties";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { addError, getItemFromId, getProjectObjects, type ProjectObject, removeError, selected } from "../../../api/project.svelte";
	import Select from "../../util/Select.svelte";

	let {
		value = $bindable(),
		name,
		errorMessage = $bindable(),
	}: {
		value: number;
		name: string;
		errorMessage: string | null;
	} = $props();

	function validate() {
		errorMessage = selectedOption === undefined ? "Selection must not be empty" : null;
		if (errorMessage) addError({ objectId: selected()!, propertyName: name });
		else removeError({ objectId: selected()!, propertyName: name });
	}

	function setProperty() {
		validate();
		if (errorMessage) return;

		(getItemFromId(selected()!)!.properties as any)[name] = selectedOption;
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let selectedOption: number = $state(value);

	onMount(() => validate());
</script>

<Select
	options={getProjectObjects()
		.filter(object => object.id !== selected())
		.map(object => {
			const manimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type"))!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: getProperty(object, "Name")!, icon: manimObject.icon, color: category.color };
		})}
	onSelect={name => {
		selectedOption = getProjectObjects().find(projectObject => getProperty(projectObject, "Name") === name)!.id;
		setProperty();
	}}
	value={(() => {
		if (selectedOption !== undefined) {
			const object = getItemFromId(selectedOption)! as ProjectObject;
			const manimObject = objects.find(manimObject => manimObject.name === getProperty(object, "Object Type"))!;
			const category = getObjectCategory(manimObject.categories[0]);
			return { name: getProperty(object, "Name")!, icon: manimObject.icon, color: category.color };
		} else {
			return undefined;
		}
	})()}
	style={`outline: 2px solid ${selectedOption !== undefined ? "transparent" : "var(--red)"}`}
/>
