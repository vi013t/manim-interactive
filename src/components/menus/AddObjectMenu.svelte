<script lang="ts">
	import { objectCategories, objects, type ObjectProperty, type ObjectPropertyName } from "../../api/manim/objects";
	import { getPreferences, runAction } from "../../api/preferences.svelte";
	import { addProjectObject, isNameTaken, nextId, select, type ProjectObject } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import Menu from "./Menu.svelte";

	let {
		top,
		left,
		openers = [],
		title = "Add Object",
		background,
		width = undefined,
		onSelect = addObject,
	}: { top: string; width?: string; background?: string; left: string; openers?: HTMLElement[]; title?: string | false; onSelect?: (type: string) => void } = $props();

	let menu: Menu;

	function addObject(type: string): void {
		let manimObject = objects.find(object => object.name === type)!;

		let name = translate(type);
		let number = 2;
		while (isNameTaken(name)) {
			name = `${type} ${number++}`;
		}

		let properties: { [key in ObjectPropertyName]?: unknown } = {
			"Object Type": type,
			Name: name,
		};
		manimObject.properties.filter((property: ObjectProperty) => property.required).forEach(property => (properties[property.name] = (property.type as any).defaultValue ?? null));
		menu.hide();

		let object: ProjectObject = {
			type: "object",
			id: nextId(),
			properties,
		};

		addProjectObject(object);
		select(object);

		if (getPreferences().autosave) runAction("Save Project");
	}

	export function show() {
		menu.show();
	}

	export function hide() {
		menu.hide();
	}

	export function isVisible() {
		return menu.isVisible();
	}
</script>

<Menu
	bind:this={menu}
	{top}
	{left}
	{openers}
	{title}
	{onSelect}
	{background}
	{width}
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
