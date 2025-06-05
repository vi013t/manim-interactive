<script lang="ts">
	import type { NumberProperty } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { addError, getItemFromId, removeError, selected } from "../../../api/project.svelte";

	let {
		value = $bindable(),
		errorMessage = $bindable(),
		name,
		property,
	}: {
		value: number;
		errorMessage: string | null;
		name: string;
		property: NumberProperty;
	} = $props();

	let inputHover = $state(false);
	let inputFocus = $state(false);

	function getErrorMessage(): string | null {
		if (!/^-?\d+(\.\d+)?$/.test(inputValue)) return "Value must be a number";
		let value = Number(inputValue);
		if (property.isIntegeric && value !== Math.floor(value)) return "Value must be an integer";
		if (value < property.minimumValue) return `Value cannot be less than ${property.minimumValue}`;
		if (value > property.maximumValue) return `Value cannot be greater than ${property.maximumValue}`;
		return null;
	}

	function validate() {
		errorMessage = getErrorMessage();
		if (errorMessage) addError({ objectId: selected()!, propertyName: name });
		else removeError({ objectId: selected()!, propertyName: name });
	}

	function setProperty() {
		getItemFromId(selected()!)!.properties[name] = value;
		if (getPreferences().autosave) runAction("Save Project");
	}

	function onInput(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();

			validate();

			if (!errorMessage) {
				(event.target as HTMLElement).blur();
			}
			return;
		}
	}

	function onBlur() {
		setProperty();
		inputFocus = false;
	}

	let inputValue = $state(`${value}`);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmouseenter={() => (inputHover = true)} onmouseleave={() => (inputHover = false)} class="input-container">
	<input
		onfocus={() => (inputFocus = true)}
		onblur={onBlur}
		style:outline={errorMessage ? "2px solid #f38ba8" : "none"}
		type="text"
		oninput={validate}
		onkeydown={onInput}
		autocomplete="off"
		bind:value={inputValue}
	/>
</div>

<style>
	input {
		width: 20rem;
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
	}
</style>
