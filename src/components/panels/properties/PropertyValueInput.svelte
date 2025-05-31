<script lang="ts">
	import { onMount } from "svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getPossibleProperties } from "../../../api/manim/properties";
	import { type PropertyType } from "../../../api/manim/property";
	import { runAction } from "../../../api/preferences.svelte";
	import { addError, getItemFromId, getProjectObjects, isNameTaken, removeError, selected, type ProjectAnimation, type ProjectObject } from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import LatexIcon from "../../icons/LatexIcon.svelte";
	import QuestionMarkIcon from "../../icons/QuestionMarkIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";
	import AddObjectMenu from "../../menus/AddObjectMenu.svelte";
	import Select from "../../util/Select.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import LatexPreview from "./LatexPreview.svelte";

	let {
		type,
		name,
		defaultValue,
		required,
		deleteProperty,
	}: { type: PropertyType; name: string; defaultValue: unknown; required: boolean; deleteProperty: (name: string) => () => void } = $props();

	let objectValueInput = $state(defaultValue);

	// svelte-ignore non_reactive_update
	let addAnimationMenu: AddAnimationMenu;
	// svelte-ignore non_reactive_update
	let addObjectMenu: AddObjectMenu;
	// svelte-ignore non_reactive_update
	let selectedOption: any = $state(defaultValue as any);
	// svelte-ignore non_reactive_update
	let booleanValue: boolean;

	let addButton: HTMLElement | null = $state(null);

	let top = $state("0px");
	let left = $state("0px");

	function addAnimation(event: MouseEvent) {
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		addAnimationMenu.show();
	}

	function addObject(event: MouseEvent) {
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		addObjectMenu.show();
	}

	let errorMessage: string | null = $state(null);

	// svelte-ignore non_reactive_update
	let input: HTMLInputElement;
	let inputValue = $state(`${defaultValue === null ? "" : defaultValue}`);

	let inputFocus = $state(false);

	function validate(): void {
		errorMessage = getErrorMessage();
		if (errorMessage) addError({ objectId: selected()!, propertyName: name });
		else removeError({ objectId: selected()!, propertyName: name });
	}

	function stringInput(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();

			validate();

			if (!errorMessage) {
				(event.target as HTMLElement).blur();
			}
		}
	}

	function getErrorMessage(): string | null {
		if (type.base === "number") {
			if (!/^-?\d+(\.\d+)?$/.test(input.value)) return "Value must be a number";
			let number = Number(input.value);
			if (type.isIntegeric && number !== Math.floor(number)) return "Value must be an integer";
			if (number < type.minimumValue) return `Value cannot be less than ${type.minimumValue}`;
			if (number > type.maximumValue) return `Value cannot be greater than ${type.maximumValue}`;
			return null;
		}

		if (required && (type.base === "object" || (type.base === "string" && "options" in type))) {
			if (selectedOption === null || selectedOption === undefined) return "Selection cannot be empty";
			return null;
		}

		if (type.base === "string" && !("options" in type)) {
			if (!type.canBeEmpty && input.value === "") return "Value cannot be empty";
			if (name === "name" && isNameTaken(input.value.trim(), selected()!)) return "Name is already taken";
			return null;
		}

		return null;
	}

	let inputHover = $state(false);
	let item = $derived(getItemFromId(selected()!)!);

	let previousValue = defaultValue;

	function hasValueChanged() {
		return input ? input.value !== previousValue : true;
	}

	function setColorProperty(color: string) {
		item.properties[name] = color;
		runAction("Save Project");
	}

	function setProperty() {
		if (errorMessage || !hasValueChanged()) return;
		console.log("stting");

		if (name === "startTime") {
			(item as unknown as ProjectAnimation).startTime = Number(input.value);
		} else if (name === "animation") {
		} else if (name === "objectType") {
			(item as ProjectObject).objectType = input.value;
		} else if (name === "name") {
			item.name = input.value.trim();
		} else if (type.base === "string" && "options" in type) {
			item.properties[name] = selectedOption;
		} else if (type.base === "string") {
			item.properties[name] = input.value;
		} else if (type.base === "object") {
			item.properties[name] = selectedOption;
		} else if (type.base === "number") {
			item.properties[name] = Number(input.value);
		} else if (type.base === "boolean") {
			item.properties[name] = booleanValue;
		}
		previousValue = input?.value;
		runAction("Save Project");
	}

	onMount(() => {
		validate();
	});

	function selectObject(type: string) {
		addObjectMenu.hide();
		objectValueInput = type;
		const possibleProperties = getPossibleProperties(type);
		const propertiesToDelete: string[] = [];
		Object.entries(item.properties).forEach(([propertyName, propertyValue]) => {
			let propertyBase = possibleProperties.find(property => property.name === propertyName);
			if (!propertyBase) propertiesToDelete.push(propertyName);
		});
		propertiesToDelete.forEach(property => {
			delete item.properties[property];
		});
	}

	let Icon = $derived(objects.find(object => object.name === item.objectType)!.icon);
	let iconColor = $derived(getObjectCategory(objects.find(object => object.name === item.objectType)!.categories[0]).color);
</script>

<!-- Animation -->
{#key getItemFromId(selected()!)}
	{#if type.base === "animation"}
		<button class="add-animation" bind:this={addButton} onclick={addAnimation}>
			{defaultValue}
		</button>
		<AddAnimationMenu bind:this={addAnimationMenu} {top} {left} openers={[addButton]} />

		<!-- Object Type -->
	{:else if type.base === "objectType"}
		<button class="add-animation" bind:this={addButton} onclick={addObject}>
			<Icon stroke={iconColor} style="width: 1rem; height: 1rem" />
			{objectValueInput}
		</button>
		<AddObjectMenu onSelect={selectObject} bind:this={addObjectMenu} {top} {left} openers={[addButton]} title="Set Object Type" />

		<!-- Object -->
	{:else if type.base === "object"}
		<Select
			options={getProjectObjects()
				.filter(object => object.id !== selected())
				.map(object => {
					const manimObject = objects.find(manimObject => manimObject.name === object.objectType)!;
					const category = getObjectCategory(manimObject.categories[0]);
					return { name: object.name, icon: manimObject.icon, color: category.color };
				})}
			onSelect={name => {
				selectedOption = getProjectObjects().find(manimObject => manimObject.name === name)!.id;
				validate();
				setProperty();
			}}
			value={(() => {
				if (selectedOption) {
					const object = getItemFromId(selectedOption)!;
					const manimObject = objects.find(manimObject => manimObject.name === object.objectType)!;
					const category = getObjectCategory(manimObject.categories[0]);
					return { name: object.name, icon: manimObject.icon, color: category.color };
				} else {
					return "";
				}
			})()}
			style={`outline: 2px solid ${selectedOption ? "transparent" : "#f38ba8"}`}
		/>

		<!-- Color -->
	{:else if type.base === "color"}
		<ColorPicker onSelect={setColorProperty} />

		<!-- Boolean -->
	{:else if type.base === "boolean"}
		<input oninput={setProperty} type="checkbox" bind:checked={booleanValue} />

		<!-- Select -->
	{:else if type.base === "string" && "options" in type}
		<Select
			onSelect={() => {
				validate();
				setProperty();
			}}
			options={type.options}
			bind:value={selectedOption}
		/>

		<!-- string, number -->
	{:else if type.base === "string" || type.base === "number"}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div onmouseenter={() => (inputHover = true)} onmouseleave={() => (inputHover = false)} class="input-container">
			<input
				style:font-family={type.base === "string" && type.isMath ? "monospace" : "inherit"}
				onfocus={() => (inputFocus = true)}
				onblur={() => {
					setProperty();
					inputFocus = false;
				}}
				bind:this={input}
				style:outline={errorMessage ? "2px solid #f38ba8" : "none"}
				type="text"
				oninput={validate}
				onkeydown={stringInput}
				autocomplete="off"
				bind:value={inputValue}
			/>

			{#if type.base === "string" && type.isMath}
				<a href="https://www.overleaf.com/learn/latex/Mathematical_expressions" target="_blank">
					<QuestionMarkIcon stroke="#cdd6f4" style="width: 1rem; height: 1rem;" />
				</a>
				<LatexIcon stroke="#cdd6f4" style="width: 3rem; position: relative; left: -5rem;" />
				<LatexPreview latex={inputValue} show={inputHover || inputFocus} />
			{/if}
		</div>
	{/if}

	{#if errorMessage}
		<span class="error">
			<ErrorIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
			<span>{errorMessage}</span>
		</span>
	{/if}

	{#if !required}
		<button onclick={deleteProperty(name)}><TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" /></button>
	{/if}
{/key}

<style>
	input,
	.add-animation {
		color: #cdd6f4;
		background: #11111b;
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.input-container {
		position: relative;
		display: flex;
		gap: 0.5rem;
		align-items: center;

		a {
			align-items: center;
			display: flex;
		}
	}

	.add-animation {
		width: 10rem;
	}

	input[type="text"] {
		width: 20rem;
	}

	input[type="checkbox"] {
		accent-color: #b4befe;
	}

	.error {
		gap: 0.5rem;
		margin-left: 0.5rem;
		span {
			color: #f38ba8;
		}
	}
</style>
