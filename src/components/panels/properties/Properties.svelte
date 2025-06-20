<script lang="ts">
	import { getPossibleProperties, property, type PropertyType } from "../../../api/manim/property";
	import { getSelectableFromId, getSingleSelection, selected } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import PlusIcon from "../../icons/PlusIcon.svelte";
	import AddPropertyMenu from "../../menus/AddPropertyMenu.svelte";
	import PropertyValueInput from "./PropertyValueInput.svelte";

	let item = $derived(getSingleSelection() !== null ? getSelectableFromId(getSingleSelection()!)! : null);

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
		if (propertyName === "Name") return property().string().notEmpty();
		if (propertyName === "Object Type") return property().objectType();
		if (propertyName === "Animation Type") return property().animationType();

		let properties = getPossibleProperties(item as any);
		return properties.find(property => property.name === propertyName)!.type;
	}

	function isPropertyRequired(propertyName: string): boolean {
		if (["Animation Type", "Object Type", "Name"].includes(propertyName)) return true;

		let properties = getPossibleProperties(item as any);
		return !!properties.find(property => property.name === propertyName)!.required;
	}

	function addProperty(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		propertiesMenu.show();
	}

	let properties = $derived(
		item
			? Object.entries(item.properties).toSorted(([firstName, _firstValue], [secondName, _secondValue]) => {
					if (firstName === "Name") return -1;
					if (secondName === "Name") return 1;

					if (firstName === "Object Type" || firstName === "Animation Type") return -1;
					if (secondName === "Object Type" || secondName === "Animation Type") return 1;

					let firstBase = getPossibleProperties(item as any).find(property => property.name === firstName)!;
					let secondBase = getPossibleProperties(item as any).find(property => property.name === secondName)!;

					if ("special" in firstBase) {
						if ("special" in secondBase) {
							return firstName.localeCompare(secondName);
						}

						return -1;
					}

					if ("special" in secondBase) return 1;

					if ("position" in firstBase) {
						if ("position" in secondBase) {
							return (firstBase.position as number) - (secondBase.position as number);
						}

						return -1;
					}

					if ("position" in secondBase) return 1;

					return firstName.localeCompare(secondName);
				})
			: null,
	);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section id="properties-panel" oncontextmenu={addProperty}>
	<div class="header">
		<h1>{translate("Properties")}</h1>
		<button onclick={clickPlusButton}>
			<PlusIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	<div class="items">
		{#key selected()}
			{#if item}
				{#each properties! as [name, value] (`${item.id}-${name}`)}
					<span class="property">
						<PropertyValueInput canBeVariable={name !== "Name"} {name} type={getPropertyType(name)} value={value as any} required={isPropertyRequired(name)} />
					</span>
				{/each}
				<AddPropertyMenu {top} {left} bind:this={propertiesMenu} />
			{/if}
		{/key}
	</div>
</section>

<style>
	section {
		background-color: var(--mantle);
		height: 100%;
		padding: 1rem;
		width: 50%;
		border-right: 1px solid var(--surface-0);
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
		color: var(--overlay-2);
		margin-bottom: 1rem;
	}

	.items {
		&,
		* {
			color: var(--text);
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
