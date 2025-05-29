<script lang="ts">
	import { getObjectCategory, objects, type ObjectCategory } from "../../api/manim/objects";
	import type { Property } from "../../api/manim/property";
	import { getPreferences, runAction } from "../../api/preferences.svelte";
	import { addProjectObject, isNameTaken, nextId, select } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import CodeIcon from "../icons/CodeIcon.svelte";

	function addObject(type: string): void {
		let manimObject = objects.find(object => object.name === type)!;
		let properties: { [key: string]: unknown } = {};
		manimObject.properties.filter((property: Property) => property.required).forEach(property => (properties[property.name] = null));
		menu.toggle();

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
		hideOuter();
		runAction("Save Project");
	}

	let {
		top,
		left,
		hideOuter,
		category,
		onSelect = addObject,
	}: { top: string; left: string; hideOuter: () => void; category: ObjectCategory; onSelect?: (type: string) => void } = $props();

	let menu: ContextMenu;

	export function show() {
		menu.show();
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
	}

	const categoryData = getObjectCategory(category);
	const useObjects = objects.filter(object => object.category === category);
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add {category}</span>
	{#each useObjects as object}
		<button onclick={() => onSelect(object.name)}>
			<object.icon stroke={categoryData.color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{object.name}
		</button>
	{/each}
	{#if category === "Miscellaneous" && getPreferences().developerMode}
		<button>
			<CodeIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			Scripted Object
		</button>
	{/if}
</ContextMenu>

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;
	}
</style>
