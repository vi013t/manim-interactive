<script lang="ts">
	import { addProperty, getPossibleProperties } from "../../api/manim/shared";
	import { selected, type ProjectObject } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import StarIcon from "../icons/StarIcon.svelte";

	let { top, left, category, background } = $props();

	let item = $derived(selected());
	let properties = $derived(item ? getPossibleProperties((item as ProjectObject).name).filter(property => property.category === category) : null);

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

	let prioritized = $derived(
		properties?.filter(property => (item as ProjectObject).properties[property.name] === undefined && property.prioritized).toSorted((a, b) => a.name.localeCompare(b.name)) ?? [],
	);
	let newProperties = $derived(
		properties?.filter(property => (item as ProjectObject).properties[property.name] === undefined && !property.prioritized).toSorted((a, b) => a.name.localeCompare(b.name)) ?? [],
	);
	let hasProperties = $derived(
		properties?.filter(property => (item as ProjectObject).properties[property.name] !== undefined).toSorted((a, b) => a.name.localeCompare(b.name)) ?? [],
	);

	function addObjectProperty(name: string, value: unknown) {
		return function () {
			addProperty(item!.id, name, value);
			hide();
		};
	}
</script>

{#if item}
	<ContextMenu bind:this={menu} {top} {left} {background}>
		<span class="heading">Add {category} Property</span>
		{#each prioritized as property}
			<button onclick={addObjectProperty(property.name, property.defaultValue)}>
				<StarIcon stroke="#f9e2af" style="width: 1rem; height: 1rem; margin-right: 0.5rem;" />
				{property.name}
			</button>
		{/each}
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
