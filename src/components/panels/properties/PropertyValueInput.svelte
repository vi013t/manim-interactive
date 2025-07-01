<script lang="ts" generics="T extends PropertyType">
	import { cache } from "../../../api/client.svelte";
	import { generateAnimationPreview, generateObjectPreview } from "../../../api/codegen.svelte";
	import { property as createProperty, getPropertyName, getPropertyTypeColor, getPropertyTypeIcon, type PropertyType, type PropertyValue } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import {
		addProjectVariable,
		getAnimationFromId,
		getAudioFromId,
		getItemFromId,
		getObjectFromId,
		getProject,
		getProjectVariableFromId,
		getProjectVariableFromName,
		getPropertiesFromId,
		getSingleSelection,
		isNameTaken,
		nextId,
		recompileAudio,
		removeError
	} from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import LinkIcon from "../../icons/LinkIcon.svelte";
	import SkullIcon from "../../icons/SkullIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import UnlinkIcon from "../../icons/UnlinkIcon.svelte";
	import VariableIcon from "../../icons/VariableIcon.svelte";
	import Select from "../../util/Select.svelte";
	import Tooltip from "../../util/Tooltip.svelte";
	import AnimationProperty from "./AnimationTypeProperty.svelte";
	import BooleanProperty from "./BooleanProperty.svelte";
	import ColorProperty from "./ColorProperty.svelte";
	import CompoundProperty from "./CompoundProperty.svelte";
	import CoordinateProperty from "./CoordinateProperty.svelte";
	import FileProperty from "./FileProperty.svelte";
	import ListProperty from "./ListProperty.svelte";
	import NumberProperty from "./NumberProperty.svelte";
	import ObjectProperty from "./ObjectProperty.svelte";
	import ObjectTypeProperty from "./ObjectTypeProperty.svelte";
	import SelectProperty from "./SelectProperty.svelte";
	import StringProperty from "./StringProperty.svelte";

	const defaultWidth = "18rem";

	type Props = {
		type: T;
		name: string;
		value: PropertyValue<T>;
		required: boolean;
		subProperty?: boolean;
		canBeVariable?: boolean;
		width?: string;
		deleteProperty?: () => void;
		locked: boolean;
		setProperty?: (value: unknown) => void;
		onError: () => void;
		onErrorFixed: () => void;
		id?: number;
	};

	let {
		subProperty = false,
		type: property,
		canBeVariable = true,
		name,
		value = $bindable(),
		required,
		width = defaultWidth,
		locked,
		id,
		deleteProperty = deleteRegularProperty,
		setProperty = setRegularProperty,
		onError,
		onErrorFixed,
	}: Props = $props();

	function deleteRegularProperty() {
		delete (getPropertiesFromId(getSingleSelection()!)! as any)[name];

		const object = getObjectFromId(getSingleSelection()!);
		if (object) generateObjectPreview(object);

		const animation = getAnimationFromId(getSingleSelection()!);
		if (animation) generateAnimationPreview(animation);

		const audio = getAudioFromId(getSingleSelection()!);
		if (audio) recompileAudio();

		cache("showMovieOverPreview", false);
		removeError({ objectId: id!, propertyName: name });

		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	function setRegularProperty(value: unknown) {
		(getPropertiesFromId(getSingleSelection()!)! as any)[name] = value;

		const object = getObjectFromId(getSingleSelection()!);
		if (object) generateObjectPreview(object);

		const animation = getAnimationFromId(getSingleSelection()!);
		if (animation) generateAnimationPreview(animation);

		const audio = getAudioFromId(getSingleSelection()!);
		if (audio) recompileAudio();

		cache("showMovieOverPreview", false);

		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let errorMessage: string | null = $state(null);
	let listCollapsed = $state(false);

	let defaultValue = value;
	let variable = $derived((value as any).variableId !== undefined ? getProjectVariableFromId((value as any).variableId)!.name : null);

	$effect(() => {
		if (errorMessage) onError();
	});

	let skippedSetPropertyMount = false;
	$effect(() => {
		value;

		if (skippedSetPropertyMount) setProperty(value);
		else skippedSetPropertyMount = true;
	});
</script>

<span class="property" style:align-items={property.base === "list" && ((value as unknown[]).length || !listCollapsed) ? "start" : "center"}>
	<!-- Property Name -->
	{#if name}
		<span class="property-name" style:width={subProperty || width !== defaultWidth ? "fit-content" : "12rem"}>
			{translate(name)}:
		</span>
	{/if}

	<!-- Property Value -->
	{#key getItemFromId(getSingleSelection()!)}
		{#if !variable}
			{#if property.base === "animationType"}
				<AnimationProperty {locked} {width} bind:value={value as string} />
			{:else if property.base === "objectType"}
				<ObjectTypeProperty {locked} {width} bind:value={value as string} />
			{:else if property.base === "object"}
				<ObjectProperty {locked} {width} bind:errorMessage bind:value={value as number} />
			{:else if property.base === "color"}
				<ColorProperty {locked} {width} bind:value={value as string} />
			{:else if property.base === "boolean"}
				<BooleanProperty {locked} {width} bind:value={value as boolean} />
			{:else if property.base === "string" && "options" in property}
				<SelectProperty {locked} {width} {property} bind:value={value as string} {name} />
			{:else if property.base === "coordinate"}
				<CoordinateProperty {locked} {width} bind:value={value as [number, number, number]} bind:errorMessage />
			{:else if property.base === "compound"}
				<CompoundProperty {locked} {width} value={value as unknown} {onError} {onErrorFixed} {property} />
			{:else if property.base === "list"}
				<ListProperty {locked} {width} {onError} {onErrorFixed} {deleteProperty} bind:value={value as unknown[]} {id} {property} {required} />
			{:else if property.base === "string"}
				<StringProperty {locked} {id} {width} bind:errorMessage bind:value={value as string} {name} {property} />
			{:else if property.base === "number"}
				<NumberProperty {locked} {id} {width} bind:errorMessage bind:value={value as number} {name} {property} />
			{:else if property.base === "file"}
				<FileProperty {locked} {width} bind:value={value as string} {property} />
			{/if}

			{#if canBeVariable}
				<Select
					onSelect={value => {
						variable = value;
						setProperty({ variableId: getProjectVariableFromName(value)!.id });
					}}
					options={getProject().variables
						.filter(variable => variable.type.base === property.base)
						.map(variable => ({ name: variable.name, icon: getPropertyTypeIcon(property.base), color: getPropertyTypeColor(property.base) }))}
					style="width: 2rem; background-color: transparent;"
					additionalButtonText="Create New {getPropertyName(property.base)} Variable"
					additionalButtonClick={() => {
						let name = translate(getPropertyName(property.base));
						let number = 2;
						while (isNameTaken(name)) {
							name = `${getPropertyName(property.base)} ${number++}`;
						}

						let id = nextId();

						addProjectVariable({
							name,
							id,
							type: createProperty()[property.base](null!),
							value: (createProperty()[property.base] as any)().defaultValue,
							locked: false,
						});
					}}
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
				class="variable-button unlink"
			>
				<UnlinkIcon stroke="var(--lavender)" style="width: 1rem; height: 1rem;" />
			</button>
		{/if}

		<!-- Delete Button -->
		{#if !required && property.base !== "list"}
			<Tooltip text="Delete Property (reset to default)" element="button" onclick={deleteProperty}>
				<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" />
			</Tooltip>
		{/if}

		{#if !required && "defaultValue" in property && value === property.defaultValue}
			<Tooltip text="This property is set to its default value and can be deleted with no change.">
				<SkullIcon stroke="var(--overlay-0)" style="width: 1rem; height: 1rem;" />
			</Tooltip>
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

	.unlink {
		margin-left: 0.25rem;
		margin-right: 0.25rem;
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
