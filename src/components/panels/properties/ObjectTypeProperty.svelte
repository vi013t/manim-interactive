<script lang="ts">
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getPossibleProperties, getProperty } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, selected, type ProjectObject } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import AddObjectMenu from "../../menus/AddObjectMenu.svelte";

	let top = $state("");
	let left = $state("");
	let item = $state(getItemFromId(selected()[0])! as ProjectObject);

	let Icon = $derived(objects.find(object => object.name === getProperty(item, "Object Type")!)!.icon);
	let iconColor = $derived(getObjectCategory(objects.find(object => object.name === getProperty(item, "Object Type")!)!.categories[0]).color);

	// svelte-ignore non_reactive_update
	let addButton: HTMLButtonElement;
	let addObjectMenu: AddObjectMenu;

	let { locked, value = $bindable(), width }: { locked: boolean; value: string; width: string } = $props();

	let menuVisible = $state(false);

	function toggleMenu() {
		if (locked) return;

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
			if (propertyName === "Name") return;
			let propertyBase = possibleProperties.find(property => property.name === propertyName);
			if (!propertyBase) propertiesToDelete.push(propertyName);
		});
		propertiesToDelete.forEach(property => {
			delete (item.properties as any)[property];
		});

		item.properties["Object Type"] = type;

		possibleProperties.forEach(property => {
			if (property.required) {
				(item.properties as any)[property.name] = (property.type as any).defaultValue ?? null;
			}
		});

		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}
</script>

<button
	class="add-animation"
	style:width
	{@attach element => {
		top = `calc(${element.getBoundingClientRect().top}px + 1.5rem)`;
		left = `${element.getBoundingClientRect().left}px`;
	}}
	bind:this={addButton}
	onclick={toggleMenu}
>
	<Icon stroke={iconColor} style="width: 1rem; height: 1rem" />
	{translate(value)}
	<RightArrow stroke="var(--lavender)" style="width: 1rem; height: 1rem; margin-left: auto; transform: rotate({menuVisible ? '90deg' : '0deg'}); transition: transform 0.1s;" />
</button>
<AddObjectMenu {width} background="var(--base)" onSelect={changeObjectType} bind:this={addObjectMenu} {top} {left} openers={[document as any]} title={false} />

<style>
	button {
		color: var(--text);
		background: var(--crust);
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
