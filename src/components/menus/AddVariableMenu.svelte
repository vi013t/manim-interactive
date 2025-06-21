<script lang="ts">
	import { getPropertyName, getPropertyTypeColor, getPropertyTypeIcon, property, type PropertyTypeBase } from "../../api/manim/property";
	import { addProjectVariable, isNameTaken, nextId } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left } = $props();

	let menu: ContextMenu;

	export function show() {
		menu.show();
	}

	export function hide() {
		menu.hide();
	}

	function addVariable(type: PropertyTypeBase) {
		return function () {
			let name = translate(getPropertyName(type));
			let number = 2;
			while (isNameTaken(name)) {
				name = `${getPropertyName(type)} ${number++}`;
			}

			hide();
			addProjectVariable({
				name,
				id: nextId(),
				type: property()[type](null!),
				value: (property()[type] as any)().defaultValue,
				locked: false,
			});
		};
	}
</script>

<ContextMenu background="var(--base)" bind:this={menu} {top} {left}>
	<span>Add Variable</span>

	{#each Object.keys(property())
		.filter(property => property !== "compound" && property !== "select")
		.toSorted((a, b) => a.localeCompare(b))
		.map(propertyType => propertyType as PropertyTypeBase) as propertyType}
		{@const Icon = getPropertyTypeIcon(propertyType)}
		<button onclick={addVariable(propertyType)}>
			<Icon stroke={getPropertyTypeColor(propertyType)} style="width: 1rem; height: 1rem;" />
			{getPropertyName(propertyType)}
		</button>
	{/each}
</ContextMenu>

<style>
	:global(button) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-transform: capitalize;
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid var(--surface-0);
	}
</style>
