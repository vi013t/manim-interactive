<script lang="ts" generics="T extends PropertyType">
	import type { PropertyType, PropertyValue } from "../../../api/manim/property";
	import { getItemFromId, selected } from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import AnimationProperty from "./AnimationProperty.svelte";
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
		setProperty?: () => void;
	};

	function deleteRegularProperty() {
		delete getItemFromId(selected()!)!.properties[name];
	}

	let { subProperty = false, type: property, name, value, required, deleteProperty = deleteRegularProperty }: Props = $props();

	let errorMessage: string | null = $state(null);
	let listCollapsed = $state(false);
</script>

<span class="property" style:align-items={property.base === "list" && ((value as unknown[]).length || !listCollapsed) ? "start" : "center"}>
	<!-- Property Name -->
	{#if name}
		<span class="property-name" style:width={subProperty ? "fit-content" : "12rem"}>
			{name === "name" ? "Name" : name === "objectType" ? "Type" : name}:
		</span>
	{/if}

	<!-- Property Value -->
	{#key getItemFromId(selected()!)}
		{#if property.base === "animation"}
			<AnimationProperty value={value as number} {name} {property} />
		{:else if property.base === "objectType"}
			<ObjectTypeProperty value={value as string} />
		{:else if property.base === "object"}
			<ObjectProperty value={value as number} {name} />
		{:else if property.base === "color"}
			<ColorProperty {property} {name} />
		{:else if property.base === "boolean"}
			<BooleanProperty value={value as boolean} />
		{:else if property.base === "string" && "options" in property}
			<SelectProperty {property} value={value as string} {name} />
		{:else if property.base === "coordinate"}
			<CoordinateProperty value={value as unknown} {name} />
		{:else if property.base === "compound"}
			<CompoundProperty value={value as unknown} {name} {property} />
		{:else if property.base === "list"}
			<ListProperty value={value as unknown[]} {name} {property} />
		{:else if property.base === "string"}
			<StringProperty bind:errorMessage value={value as string} {name} {property} />
		{:else if property.base === "number"}
			<NumberProperty bind:errorMessage value={value as number} {name} {property} />
		{/if}

		<!-- Error Message -->
		{#if errorMessage}
			<span class="error">
				<ErrorIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
				<span>{errorMessage}</span>
			</span>
		{/if}

		<!-- Delete Button -->
		{#if !required && property.base !== "list"}
			<button onclick={deleteProperty}><TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" /></button>
		{/if}
	{/key}
</span>

<style>
	.error {
		gap: 0.5rem;
		margin-left: 0.5rem;
		span {
			color: #f38ba8;
		}
	}

	.property {
		gap: 0.5rem;
	}

	.property-name {
		justify-content: right;
	}
</style>
