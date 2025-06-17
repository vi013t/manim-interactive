<script lang="ts">
	import type { ObjectPropertyName } from "../../api/manim/objects";
	import { addProperty, animationPropertyCategories, getPossibleProperties, objectPropertyCategories } from "../../api/manim/property";
	import { getItemFromId, getSelectableFromId, selected } from "../../api/project.svelte";
	import EmptyIcon from "../icons/EmptyIcon.svelte";
	import Menu from "./Menu.svelte";

	let { top, left, openers = [] }: { top: string; left: string; openers?: HTMLElement[]; background?: string } = $props();

	let menu: Menu;

	let item = $derived(getSelectableFromId(selected()[0])!);

	function onSelect(name: string) {
		hide();
		let defaultValue = (getPossibleProperties(item).find(property => property.name === name)!.type as any).defaultValue ?? null;
		addProperty(getItemFromId(selected()[0])!.id, name as ObjectPropertyName, defaultValue);
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
	submenus={(item?.type === "object" ? objectPropertyCategories : animationPropertyCategories).map(category => ({
		name: category.name,
		icon: category.icon,
		options: item
			? getPossibleProperties(item)
					.filter(property => property.categories.includes(category.name as any))
					.map(property => ({ name: property.name, icon: EmptyIcon, description: property.description ?? "", demo: "", disabled: property.name in item.properties }))
			: [],
		title: `Add ${category.name} Property`,
		color: category.color,
	}))}
/>
