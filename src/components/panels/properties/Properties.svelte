<script lang="ts">
	import { getPossibleProperties } from "../../../api/manim/properties";
	import { property, type PropertyType } from "../../../api/manim/property";
	import { getItemFromId, selected } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import PlusIcon from "../../icons/PlusIcon.svelte";
	import AddPropertyMenu from "../../menus/AddPropertyMenu.svelte";
	import PropertyValueInput from "./PropertyValueInput.svelte";

	let item = $derived(selected() !== null ? getItemFromId(selected()!)! : null);

	$effect(() => {
		console.log($state.snapshot(item));
	});

	let top = $state("100%");
	let left = $state("94%");
	// svelte-ignore non_reactive_update
	let propertiesMenu: AddPropertyMenu;

	function clickPlusButton() {
		top = "75%";
		left = "73.5%";
		propertiesMenu.show();
	}

	function getPropertyType(propertyName: string): PropertyType {
		let properties = getPossibleProperties(item!);
		return properties.find(property => property.name === propertyName)!.type;
	}

	function isPropertyRequired(propertyName: string): boolean {
		let properties = getPossibleProperties(item!);
		return !!properties.find(property => property.name === propertyName)!.required;
	}

	function addProperty(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		propertiesMenu.show();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section id="properties-panel" oncontextmenu={addProperty}>
	<div class="header">
		<h1>{translate("Properties")}</h1>
		<button onclick={clickPlusButton}>
			<PlusIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	<div class="items">
		{#key selected()}
			{#if item}
				<span class="property">
					<PropertyValueInput type={property().string().notEmpty()} name="name" value={item.name} required />
				</span>

				<!-- Animation -->
				{#if "startTime" in item}
					<span class="property">
						<PropertyValueInput name="Animation" type={property().animation()} value={item.animationType as string} required />
					</span>
					<span class="property">
						<PropertyValueInput name="Object" type={property().object()} value={item.objects.length ? (item.objects[0] as number) : null!} required />
					</span>
					<span class="property">
						<PropertyValueInput name="Start Time" type={property().number().nonnegative()} value={item.startTime as number} required />
					</span>
					<span class="duration">
						<PropertyValueInput name="Duration" type={property().number().nonnegative()} value={item.duration as number} required />
					</span>

					<!-- Object -->
				{:else}
					<span class="property">
						<PropertyValueInput name="objectType" type={property().objectType()} value={item.objectType} required />
					</span>
				{/if}

				<!-- Properties -->
				{#each Object.entries(item.properties).toSorted(([firstName, _firstValue], [secondName, _secondValue]) => {
					console.log(item);
					let firstBase = getPossibleProperties(item).find(property => property.name === firstName)!;
					let secondBase = getPossibleProperties(item).find(property => property.name === secondName)!;

					if (firstBase.position !== undefined) {
						if (secondBase.position !== undefined) {
							return firstBase.position - secondBase.position;
						}

						return -1;
					}

					if (secondBase.position !== undefined) return 1;

					return firstName.localeCompare(secondName);
				}) as [name, value] (`${item.id}-${name}`)}
					<span class="property">
						<PropertyValueInput {name} type={getPropertyType(name)} value={value as any} required={isPropertyRequired(name)} />
					</span>
				{/each}

				<AddPropertyMenu {top} {left} bind:this={propertiesMenu} />
			{/if}
		{/key}
	</div>
</section>

<style>
	section {
		background-color: #181825;
		height: 100%;
		padding: 1rem;
		width: 50%;
		border-right: 1px solid #313244;
	}

	.property {
		align-items: center;
		padding: 0.5rem;
		border-radius: 0.5rem;

		&:hover {
			background-color: rgba(180, 150, 255, 10%);
		}
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
		height: 80%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;

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
