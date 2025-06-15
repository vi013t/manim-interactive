<script lang="ts">
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
		(getItemFromId(selected()!)!.properties as any)[name] = selectedOption;
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let selectedOption: number = $state(value);
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
