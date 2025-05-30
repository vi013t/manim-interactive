<script lang="ts">
	import { objectCategories, objects } from "../../api/manim/objects";
	import type { Property } from "../../api/manim/property";
	import { runAction } from "../../api/preferences.svelte";
	import { addProjectObject, isNameTaken, nextId, select } from "../../api/project.svelte";
	import Menu from "./Menu.svelte";

	let { top, left, openers = [], title = "Add Object", onSelect = addObject } = $props();

	let menu: Menu;

	function addObject(type: string): void {
		let manimObject = objects.find(object => object.name === type)!;
		let properties: { [key: string]: unknown } = {};
		manimObject.properties.filter((property: Property) => property.required).forEach(property => (properties[property.name] = property.defaultValue));
		menu.hide();

		let name = type;
		let number = 2;
		while (isNameTaken(name)) {
			name = `${type} ${number++}`;
		}

		let object = {
			name,
			objectType: type,
			id: nextId(),
			properties,
		};
		addProjectObject(object);
		select(object);
		runAction("Save Project");
	}

	export function show() {
		menu.show();
	}

	export function hide() {
		menu.hide();
	}
</script>

<Menu
	bind:this={menu}
	{top}
	{left}
	{openers}
	{title}
	{onSelect}
	submenus={objectCategories.map(category => ({
		name: category.name,
		icon: category.icon,
		options: objects
			.filter(object => (object.categories as any).includes(category.name))
			.map(object => ({ name: object.name, icon: object.icon, description: object.description, demo: object.demo, documentation: (object as any).documentation })),
		title: `Add ${category.name}`,
		color: category.color,
	}))}
/>
