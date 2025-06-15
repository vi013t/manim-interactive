<script lang="ts">
	import type { ObjectPropertyName } from "../../api/manim/objects";
	import { addObjectProperty, getPossibleProperties } from "../../api/manim/properties";
	import { propertyCategories } from "../../api/manim/property";
	import { getItemFromId, selected } from "../../api/project.svelte";
	import EmptyIcon from "../icons/EmptyIcon.svelte";
	import Menu from "./Menu.svelte";

	let { top, left, openers = [] }: { top: string; left: string; openers?: HTMLElement[]; background?: string } = $props();

	let menu: Menu;

	let item = $derived(getItemFromId(selected()!)!);

	function onSelect(name: string) {
		hide();
		let defaultValue = (getPossibleProperties(item).find(property => property.name === name)!.type as any).defaultValue ?? null;
		addObjectProperty(getItemFromId(selected()!)!.id, name as ObjectPropertyName, defaultValue);
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
	title="Add Property"
	demoType="none"
	{onSelect}
	submenus={propertyCategories.map(category => ({
		name: category.name,
		icon: category.icon,
		options: item
			? getPossibleProperties(item)
					.filter(property => property.categories.includes(category.name))
					.map(property => ({ name: property.name, icon: EmptyIcon, description: property.description ?? "", demo: "" }))
			: [],
		title: `Add ${category.name} Property`,
		color: category.color,
	}))}
/>
