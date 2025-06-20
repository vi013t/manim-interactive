<script lang="ts">
	import { getPropertyTypeColor, getPropertyTypeIcon, property, type PropertyTypeBase } from "../../api/manim/property";
	import { addProjectVariable, isNameTaken, nextId } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left } = $props();

	let menu: ContextMenu;

	export function show() {
		menu.show();
	}

	function addVariable(type: PropertyTypeBase) {
		return function () {
			let name = translate(type);
			let number = 2;
			while (isNameTaken(name)) {
				name = `${type} ${number++}`;
			}

			menu.hide();
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
		.toSorted((a, b) => a.localeCompare(b)) as propertyType}
		{@const Icon = getPropertyTypeIcon(propertyType as PropertyTypeBase)}
		<button onclick={addVariable(propertyType as PropertyTypeBase)}>
			<Icon stroke={getPropertyTypeColor(propertyType as PropertyTypeBase)} style="width: 1rem; height: 1rem;" />
			{propertyType.replace(/Type$/, " type")}
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
