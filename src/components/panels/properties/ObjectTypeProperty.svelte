<script lang="ts">
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getPossibleProperties } from "../../../api/manim/properties";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, selected } from "../../../api/project.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import AddObjectMenu from "../../menus/AddObjectMenu.svelte";

	let top = $state("");
	let left = $state("");
	let item = $state(getItemFromId(selected()!)!);

	let Icon = $derived(objects.find(object => object.name === item.objectType)!.icon);
	let iconColor = $derived(getObjectCategory(objects.find(object => object.name === item.objectType)!.categories[0]).color);
	// svelte-ignore non_reactive_update
	let addButton: HTMLButtonElement;
	let addObjectMenu: AddObjectMenu;

	let { value = $bindable() }: { value: string } = $props();

	let menuVisible = $state(false);

	function addObject() {
		if (addObjectMenu.isVisible()) {
			menuVisible = false;
			addObjectMenu.hide();
		} else {
			addObjectMenu.show();
			menuVisible = true;
		}
	}

	function changeObjectType(type: string) {
		addObjectMenu.hide();
		value = type;
		const possibleProperties = getPossibleProperties(type);
		const propertiesToDelete: string[] = [];
		Object.entries(item.properties).forEach(([propertyName, propertyValue]) => {
			let propertyBase = possibleProperties.find(property => property.name === propertyName);
			if (!propertyBase) propertiesToDelete.push(propertyName);
		});
		propertiesToDelete.forEach(property => {
			delete item.properties[property];
		});

		item.objectType = type;

		possibleProperties.forEach(property => {
			if (property.required) {
				item.properties[property.name] = (property.type as any).defaultValue ?? null;
			}
		});

		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}
</script>

<button
	class="add-animation"
	{@attach element => {
		top = `calc(${element.getBoundingClientRect().top}px + 1.5rem)`;
		left = `${element.getBoundingClientRect().left}px`;
	}}
	bind:this={addButton}
	onclick={addObject}
>
	<Icon stroke={iconColor} style="width: 1rem; height: 1rem" />
	{value}
	<RightArrow stroke="#b4befe" style="width: 1rem; height: 1rem; margin-left: auto; transform: rotate({menuVisible ? '90deg' : '0deg'}); transition: transform 0.1s;" />
</button>
<AddObjectMenu width="20rem" background="#1e1e2e" onSelect={changeObjectType} bind:this={addObjectMenu} {top} {left} openers={[document as any]} title={false} />

<style>
	button {
		width: 20rem;
		color: #cdd6f4;
		background: #11111b;
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
