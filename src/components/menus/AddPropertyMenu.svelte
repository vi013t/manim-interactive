<script lang="ts">
	import { addProperty, getPossibleProperties } from "../../api/manim/properties";
	import { propertyCategories } from "../../api/manim/property";
	import { getItemFromId, selected } from "../../api/project.svelte";
	import EmptyIcon from "../icons/EmptyIcon.svelte";
	import Menu from "./Menu.svelte";

	let { top, left, openers = [] }: { top: string; left: string; openers?: HTMLElement[]; background?: string } = $props();

	let menu: Menu;

	let item = $derived(getItemFromId(selected()!)!);
	let options = $derived(item ? getPossibleProperties(item.objectType) : []);

	function onSelect(name: string) {
		hide();
		let defaultValue = getPossibleProperties(item.objectType).find(property => property.name === name)!.defaultValue;
		addProperty(getItemFromId(selected()!)!.id, name, defaultValue);
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
			? getPossibleProperties(item.objectType)
					.filter(property => property.categories.includes(category.name))
					.map(property => ({ name: property.name, icon: EmptyIcon, description: "", demo: "" }))
			: [],
		title: `Add ${category.name} Property`,
		color: category.color,
	}))}
/>
