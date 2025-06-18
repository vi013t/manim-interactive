<script lang="ts" generics="T extends PropertyType">
	import type { PropertyType, PropertyValue } from "../../../api/manim/property";
	import { runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, getPropertiesFromId, getSingleSelection, selected } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import AnimationProperty from "./AnimationTypeProperty.svelte";
	import BooleanProperty from "./BooleanProperty.svelte";
	import ColorProperty from "./ColorProperty.svelte";
	import CompoundProperty from "./CompoundProperty.svelte";
	import CoordinateProperty from "./CoordinateProperty.svelte";
	import ListProperty from "./ListProperty.svelte";
	import NumberProperty from "./NumberProperty.svelte";
	import ObjectProperty from "./ObjectProperty.svelte";
	import ObjectTypeProperty from "./ObjectTypeProperty.svelte";
	import SelectProperty from "./SelectProperty.svelte";
	import StringProperty from "./StringProperty.svelte";

	type Props = {
		type: T;
		name: string;
		value: PropertyValue<T>;
		required: boolean;
		subProperty?: boolean;
		deleteProperty?: () => void;
		setProperty?: (value: unknown) => void;
	};

	function deleteRegularProperty() {
		delete (getPropertiesFromId(selected()[0])! as any)[name];
		runAction("Save And Recompile Project");
	}

	function setRegularProperty(value: unknown) {
		(getPropertiesFromId(getSingleSelection()!)! as any)[name] = value;
		runAction("Save And Recompile Project");
	}

	let { subProperty = false, type: property, name, value, required, deleteProperty = deleteRegularProperty, setProperty = setRegularProperty }: Props = $props();

	let errorMessage: string | null = $state(null);
	let listCollapsed = $state(false);
</script>

<span class="property" style:align-items={property.base === "list" && ((value as unknown[]).length || !listCollapsed) ? "start" : "center"}>
	<!-- Property Name -->
	{#if name}
		<span class="property-name" style:width={subProperty ? "fit-content" : "12rem"}>
			{translate(name)}:
		</span>
	{/if}

	<!-- Property Value -->
	{#key getItemFromId(selected()[0])}
		{#if property.base === "animationType"}
			<AnimationProperty {setProperty} value={value as string} {name} {property} />
		{:else if property.base === "objectType"}
			<ObjectTypeProperty {setProperty} value={value as string} />
		{:else if property.base === "object"}
			<ObjectProperty {setProperty} bind:errorMessage value={value as number} {name} />
		{:else if property.base === "color"}
			<ColorProperty {setProperty} {property} {name} />
		{:else if property.base === "boolean"}
			<BooleanProperty {setProperty} value={value as boolean} {name} />
		{:else if property.base === "string" && "options" in property}
			<SelectProperty {setProperty} {property} value={value as string} {name} />
		{:else if property.base === "coordinate"}
			<CoordinateProperty value={value as [number, number, number]} {name} bind:errorMessage />
		{:else if property.base === "compound"}
			<CompoundProperty value={value as unknown} {name} {property} />
		{:else if property.base === "list"}
			<ListProperty {setProperty} value={value as unknown[]} {name} {property} {required} />
		{:else if property.base === "string"}
			<StringProperty {setProperty} bind:errorMessage value={value as string} {name} {property} />
		{:else if property.base === "number"}
			<NumberProperty {setProperty} bind:errorMessage value={value as number} {name} {property} id={selected()[0]} />
		{/if}

		<!-- Delete Button -->
		{#if !required && property.base !== "list"}
			<button onclick={deleteProperty}><TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" /></button>
		{/if}

		<!-- Error Message -->
		{#if errorMessage}
			<span class="error">
				<ErrorIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" />
				<span>{errorMessage}</span>
			</span>
		{/if}
	{/key}
</span>

<style>
	.error {
		gap: 0.5rem;
		margin-left: 0.5rem;
		span {
			color: var(--red);
		}
	}

	.property {
		gap: 0.5rem;
	}

	.property-name {
		justify-content: right;
	}
</style>
