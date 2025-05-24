<script lang="ts">
	import { selected, type ManimObject } from "../api/codegen.svelte";
	import { getItemData } from "../api/manim";
	import PlusIcon from "./icons/PlusIcon.svelte";
	import AddPropertyMenu from "./menus/AddPropertyMenu.svelte";
	import PropertyValueInput from "./PropertyValueInput.svelte";

	let item = $derived(selected());

	let top = $state("100%");
	let left = $state("94%");
	// svelte-ignore non_reactive_update
	let propertiesMenu: AddPropertyMenu;

	function clickPlusButton() {
		top = "75%";
		left = "73.5%";
		propertiesMenu.toggle();
	}

	function getPropertyType(propertyName: string) {
		let itemData = getItemData((item as ManimObject).objectType);
		return itemData.properties.find(
			(property) => property.name === propertyName,
		)!.type;
	}
</script>

<section>
	<div class="header">
		<h1>Properties</h1>
		<button onclick={clickPlusButton}>
			<PlusIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	<div class="items">
		{#if item}
			<span>Name: {item.name}</span>
			{#each Object.entries(item.properties) as [name, value]}
				<span>
					{name}: <PropertyValueInput
						propertyType={getPropertyType(name)}
						defaultValue={value}
					/>
				</span>
			{/each}
			<AddPropertyMenu {top} {left} id={item.id} bind:this={propertiesMenu} />
		{/if}
	</div>
</section>

<style>
	section {
		background-color: #181825;
		height: 100%;
		padding: 1rem;
	}

	h1 {
		text-transform: uppercase;
		font-size: 0.75rem;
		color: #9399b2;
		margin-bottom: 1rem;
	}

	.items {
		&,
		* {
			color: #cdd6f4;
		}
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		span {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}

	.header {
		display: flex;
		width: 100%;
		align-items: center;
		position: relative;

		button {
			margin-left: auto;
			padding: 0.25rem;
			border-radius: 0.25rem;

			&:hover {
				background: rgba(255, 255, 255, 8%);
			}
		}
	}
</style>
