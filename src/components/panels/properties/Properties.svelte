<script lang="ts">
	import { getPossibleProperties } from "../../../api/manim/shared";
	import { selected } from "../../../api/project.svelte";
	import PlusIcon from "../../icons/PlusIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import AddPropertyMenu from "../../menus/AddPropertyMenu.svelte";
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
		let properties = getPossibleProperties(item!.name);
		console.log("pname", propertyName);
		return properties.find(property => property.name === propertyName)!.type;
	}

	function addProperty(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		propertiesMenu.show();
	}

	function deleteProperty(name: string) {
		return function () {
			delete item!.properties[name];
		};
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section oncontextmenu={addProperty}>
	<div class="header">
		<h1>Properties</h1>
		<button onclick={clickPlusButton}>
			<PlusIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	<div class="items">
		{#if item}
			<span class="property">
				<span class="property-name">Name:</span>
				<PropertyValueInput type="string" name="name" defaultValue={item.name} />
			</span>
			<!-- Animation -->
			{#if "startTime" in item}
				<span>
					Animation: <PropertyValueInput name="animation" type="animation" defaultValue={item.name} />
				</span>
				<span></span>
				<span>
					Start Time: <PropertyValueInput name="startTime" type="float" defaultValue={item.startTime} />
				</span>
			{/if}
			{#each Object.entries(item.properties) as [name, value]}
				<span class="property">
					<span class="property-name">{name}:</span>
					<PropertyValueInput {name} type={getPropertyType(name)} defaultValue={value} />
					<button onclick={deleteProperty(name)}><TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" /></button>
				</span>
			{/each}
			<AddPropertyMenu {top} {left} bind:this={propertiesMenu} />
		{/if}
	</div>
</section>

<style>
	section {
		background-color: #181825;
		height: 100%;
		padding: 1rem;
	}

	.property {
		align-items: center;
		padding: 0.5rem;
		border-radius: 0.5rem;

		&:hover {
			background-color: rgba(180, 150, 255, 10%);
		}
	}

	.property-name {
		width: 8rem;
		display: flex;
		flex-direction: row-reverse;
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
