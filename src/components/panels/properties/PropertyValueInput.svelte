<script lang="ts" generics="T extends PropertyType">
	import { generateAnimationPreview, generateObjectPreview } from "../../../api/codegen.svelte";
	import { getPropertyTypeColor, getPropertyTypeIcon, type PropertyType, type PropertyValue } from "../../../api/manim/property";
	import { getPreferences, runAction, setPreference } from "../../../api/preferences.svelte";
	import {
		getAnimationFromId,
		getItemFromId,
		getObjectFromId,
		getProjectVariableFromId,
		getProjectVariableFromName,
		getProjectVariables,
		getPropertiesFromId,
		getSingleSelection,
		selected,
	} from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import LinkIcon from "../../icons/LinkIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import UnlinkIcon from "../../icons/UnlinkIcon.svelte";
	import VariableIcon from "../../icons/VariableIcon.svelte";
	import Select from "../../util/Select.svelte";
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
		canBeVariable?: boolean;
		width?: string;
		deleteProperty?: () => void;
		setProperty?: (value: unknown) => void;
	};

	function deleteRegularProperty() {
		delete (getPropertiesFromId(selected()[0])! as any)[name];

		const object = getObjectFromId(getSingleSelection()!);
		if (object) generateObjectPreview(object);

		const animation = getAnimationFromId(getSingleSelection()!);
		if (animation) generateAnimationPreview(animation);

		setPreference("showMovieOverPreview", false);

		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	function setRegularProperty(value: unknown) {
		(getPropertiesFromId(getSingleSelection()!)! as any)[name] = value;

		const object = getObjectFromId(getSingleSelection()!);
		if (object) generateObjectPreview(object);

		const animation = getAnimationFromId(getSingleSelection()!);
		if (animation) generateAnimationPreview(animation);

		setPreference("showMovieOverPreview", false);

		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let {
		subProperty = false,
		type: property,
		canBeVariable = true,
		name,
		value,
		required,
		width = "20rem",
		deleteProperty = deleteRegularProperty,
		setProperty = setRegularProperty,
	}: Props = $props();

	let errorMessage: string | null = $state(null);
	let listCollapsed = $state(false);

	let defaultValue = value;
	let variable = $derived((value as any).variableId !== undefined ? getProjectVariableFromId((value as any).variableId)!.name : null);
</script>

<span class="property" style:align-items={property.base === "list" && ((value as unknown[]).length || !listCollapsed) ? "start" : "center"}>
	<!-- Property Name -->
	{#if name}
		<span class="property-name" style:width={subProperty || width !== "20rem" ? "fit-content" : "12rem"}>
			{translate(name)}:
		</span>
	{/if}

	<!-- Property Value -->
	{#key getItemFromId(selected()[0])}
		{#if !variable}
			{#if property.base === "animationType"}
				<AnimationProperty {width} {setProperty} value={value as string} {name} {property} />
			{:else if property.base === "objectType"}
				<ObjectTypeProperty {width} {setProperty} value={value as string} />
			{:else if property.base === "object"}
				<ObjectProperty {width} {setProperty} bind:errorMessage value={value as number} {name} />
			{:else if property.base === "color"}
				<ColorProperty {width} {setProperty} />
			{:else if property.base === "boolean"}
				<BooleanProperty {width} {setProperty} value={value as boolean} />
			{:else if property.base === "string" && "options" in property}
				<SelectProperty {width} {setProperty} {property} value={value as string} {name} />
			{:else if property.base === "coordinate"}
				<CoordinateProperty {width} {setProperty} value={value as [number, number, number]} {name} bind:errorMessage />
			{:else if property.base === "compound"}
				<CompoundProperty {width} value={value as unknown} {name} {property} />
			{:else if property.base === "list"}
				<ListProperty {width} {setProperty} value={value as unknown[]} {name} {property} {required} />
			{:else if property.base === "string"}
				<StringProperty {width} {setProperty} bind:errorMessage value={value as string} {name} {property} />
			{:else if property.base === "number"}
				<NumberProperty {width} {setProperty} bind:errorMessage value={value as number} {name} {property} id={selected()[0]} />
			{/if}

			{#if canBeVariable}
				<Select
					onSelect={value => {
						variable = value;
						setProperty({ variableId: getProjectVariableFromName(value)!.id });
					}}
					options={getProjectVariables()
						.filter(variable => variable.type.base === property.base)
						.map(variable => ({ name: variable.name, icon: getPropertyTypeIcon(property.base), color: getPropertyTypeColor(property.base) }))}
					style="width: 2rem; background-color: transparent;"
				>
					<button class="variable-button">
						<VariableIcon stroke="var(--lavender)" style="width: 1rem; height: 1rem;" />
					</button>
				</Select>
			{/if}
		{:else}
			<span class="variable" style:width>
				<LinkIcon stroke="var(--lavender)" style="width: 1rem; height: 1rem;" />
				{variable}
			</span>
			<button
				onclick={() => {
					variable = null;
					value = defaultValue;
				}}
				class="variable-button"
			>
				<UnlinkIcon stroke="var(--lavender)" style="width: 1rem; height: 1rem;" />
			</button>
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
	.variable-button {
		padding: 0.25rem;
		border-radius: 0.25rem;
		background-color: var(--crust);
	}
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

	.variable {
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--crust);
		border-radius: 0.5rem;
		padding: 0.25rem;
		font-size: 0.85rem;
		cursor: not-allowed;
	}
</style>
