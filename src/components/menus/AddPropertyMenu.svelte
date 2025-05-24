<script lang="ts">
	import { getItemData } from "../../api/manim";
	import { addProperty, getItemFromId } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";

	let { id, top, left } = $props();

	let item = $derived(getItemFromId(id));
	let itemData = $derived(item ? getItemData(item.objectType) : null);

	// svelte-ignore non_reactive_update
	let menu: ContextMenu;

	export function show() {
		menu?.show();
	}

	export function toggle() {
		menu?.toggle();
	}

	export function hide() {
		menu?.hide();
	}

	let newProperties = $derived(itemData?.properties.filter(property => item.properties[property.name] === undefined) ?? []);

	let hasProperties = $derived(itemData?.properties.filter(property => item.properties[property.name] !== undefined) ?? []);

	function addObjectProperty(name: string, value: unknown) {
		return function () {
			addProperty(id, name, value);
			hide();
		};
	}
</script>

{#if itemData}
	<ContextMenu bind:this={menu} {top} {left} background="#1e1e2e">
		<span class="heading">Add Property</span>
		{#each newProperties as property}
			<button onclick={addObjectProperty(property.name, property.defaultValue)}>
				{property.name}
			</button>
		{/each}
		{#each hasProperties as property}
			<button class="disabled">
				{property.name}
			</button>
		{/each}
	</ContextMenu>
{/if}

<style>
	.disabled {
		color: #585b70;
		cursor: initial;

		&:hover {
			background-color: inherit;
		}
	}

	*:not(.disabled) + .disabled {
		border-top: 1px solid #313244;
	}

	.heading {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;

		&:hover {
			background-color: #1e1e2e;
		}
	}
</style>
