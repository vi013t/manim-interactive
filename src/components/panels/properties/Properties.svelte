<script lang="ts">
	import { onMount } from "svelte";
	import { getPossibleProperties, property, type PropertyType } from "../../../api/manim/property";
	import { addError, getSelectableFromId, getSingleSelection, removeError, selected } from "../../../api/project.svelte";
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

	let resizing = $state(false);

	function resize() {
		resizing = true;
	}

	let width: string | undefined = $state(undefined);
	let panel: HTMLElement;

	onMount(() => {
		document.addEventListener("mousemove", event => {
			if (resizing) {
				width = `clamp(10rem, ${event.clientX - panel.getBoundingClientRect().left}px, calc(100% - 10rem))`;
			}
		});

		document.addEventListener("mouseup", () => (resizing = false));
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section bind:this={panel} style:width id="properties-panel" oncontextmenu={addProperty}>
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
						<PropertyValueInput
							onError={() => addError({ objectId: getSingleSelection()!, propertyName: name })}
							onErrorFixed={() => removeError({ objectId: getSingleSelection()!, propertyName: name })}
							id={getSingleSelection()!}
							locked={false}
							canBeVariable={name !== "Name"}
							{name}
							type={getPropertyType(name)}
							value={value as any}
							required={isPropertyRequired(name)}
						/>
					</span>
				{/each}
				<AddPropertyMenu {top} {left} bind:this={propertiesMenu} />
			{:else}
				<div class="no-properties">
					<h1>No Properties To Show</h1>
					<p>When you select just one object or animation, its properties will appear here.</p>
				</div>
			{/if}
		{/key}
	</div>
	<div onmousedown={resize} class="resizer {resizing ? 'resizing' : ''}" style:background={resizing ? "var(--lavender)" : undefined}></div>
</section>

<style>
	.resizer {
		position: absolute;
		right: 100%;
		top: 0px;
		left: 100%;
		transform: translateX(-50%);
		height: 100%;
		width: 3px;
		cursor: ew-resize;

		&:not(.resizing):hover {
			background: var(--lavender);
			opacity: 50%;
		}
	}

	section {
		position: relative;
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

		h1 {
			text-transform: uppercase;
			font-size: 0.75rem;
			color: var(--overlay-2);
			margin-bottom: 1rem;
		}
	}

	.no-properties {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;

		h1 {
			color: var(--text);
		}

		p {
			color: var(--overlay-2);
		}
	}
</style>
