<script lang="ts">
	import { onMount } from "svelte";
	import type { StringProperty } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { addError, getItemFromId, isNameTaken, removeError, selected } from "../../../api/project.svelte";
	import LatexIcon from "../../icons/LatexIcon.svelte";
	import QuestionMarkIcon from "../../icons/QuestionMarkIcon.svelte";
	import LatexPreview from "./LatexPreview.svelte";

	let {
		value = $bindable(),
		errorMessage = $bindable(),
		name,
		property,
	}: {
		value: string;
		errorMessage: string | null;
		name: string;
		property: StringProperty;
	} = $props();

	let inputHover = $state(false);
	let inputFocus = $state(false);

	function getErrorMessage(): string | null {
		if (!property.canBeEmpty && value === "") return "Value cannot be empty";
		if (name === "Name" && isNameTaken(value.trim(), selected()!)) return "Name is already taken";
		return null;
	}

	function validate() {
		errorMessage = getErrorMessage();
		if (errorMessage) addError({ objectId: selected()!, propertyName: name });
		else removeError({ objectId: selected()!, propertyName: name });
	}

	function setProperty() {
		(getItemFromId(selected()!)!.properties as any)[name] = inputValue;
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	function onInput(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();

			validate();

			if (!errorMessage) {
				(event.target as HTMLElement).blur();
			}
		}
	}

	function onBlur() {
		setProperty();
		inputFocus = false;
	}

	onMount(() => {
		validate();
	});

	let inputValue = $state(`${value}`);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmouseenter={() => (inputHover = true)} onmouseleave={() => (inputHover = false)} class="input-container">
	<input
		style:font-family={property.isMath ? "monospace" : "inherit"}
		onfocus={() => (inputFocus = true)}
		onblur={onBlur}
		style:outline={errorMessage ? "2px solid var(--red)" : "none"}
		type="text"
		oninput={validate}
		onkeydown={onInput}
		autocomplete="off"
		bind:value={inputValue}
	/>

	{#if property.isMath}
		<a href="https://www.overleaf.com/learn/latex/Mathematical_expressions" target="_blank">
			<QuestionMarkIcon stroke="var(--text)" style="width: 1rem; height: 1rem;" />
		</a>
		<LatexIcon stroke="var(--text)" style="width: 3rem; position: absolute; left: 17rem;" />
		<LatexPreview latex={value} show={inputHover || inputFocus} />
	{/if}
</div>

<style>
	input {
		width: 20rem;
		color: var(--text);
		background: var(--crust);
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
