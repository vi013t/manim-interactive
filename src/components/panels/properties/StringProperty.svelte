<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { open } from "@tauri-apps/plugin-dialog";
	import { onMount } from "svelte";
	import type { StringProperty } from "../../../api/manim/property";
	import { addError, isNameTaken, removeError, selected } from "../../../api/project.svelte";
	import FolderIcon from "../../icons/FolderIcon.svelte";
	import LatexIcon from "../../icons/LatexIcon.svelte";
	import LockIcon from "../../icons/LockIcon.svelte";
	import QuestionMarkIcon from "../../icons/QuestionMarkIcon.svelte";
	import UnlockIcon from "../../icons/UnlockIcon.svelte";
	import LatexPreview from "./LatexPreview.svelte";

	let {
		value = $bindable(),
		errorMessage = $bindable(),
		name,
		property,
		width,
		locked,
		setProperty,
	}: {
		value: string;
		errorMessage: string | null;
		name: string;
		property: StringProperty;
		width: string;
		locked: boolean;
		setProperty(value: unknown): void;
	} = $props();

	/** Whether the input element is currently being hovered over. */
	let inputHover = $state(false);

	/** Whether the input element is currently in focus. */
	let inputFocus = $state(false);

	/**
	 * Returns the error message associated with the value entered in this property input, or `null`
	 * if the value is valid.
	 */
	async function getErrorMessage(): Promise<string | null> {
		if (!property.canBeEmpty && inputValue === "") return "Value cannot be empty";
		if (name === "Name" && isNameTaken(inputValue.trim(), selected()[0])) return "Name is already taken";
		if (property.isPath && !(await invoke<boolean>("path_is_file", { path: inputValue }))) return "Path is not an image file";
		return null;
	}

	async function choosePath() {
		const selected = await open({
			multiple: false,
			title: "Select a directory",
		});

		// Directory Chosen
		if (typeof selected === "string") {
			inputValue = selected;
			trySetProperty();
		}

		// No directory chosen
		else {
			console.log("No directory selected");
		}
	}

	async function validate() {
		errorMessage = await getErrorMessage();
		if (errorMessage) addError({ objectId: selected()[0], propertyName: name });
		else removeError({ objectId: selected()[0], propertyName: name });
	}

	async function trySetProperty() {
		await validate();
		if (errorMessage) return;
		setProperty(inputValue);
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
		trySetProperty();
		inputFocus = false;
	}

	onMount(() => {
		validate();
	});

	let inputValue = $state(`${value}`);

	let isPathLocked = $state(property.isPath);
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
		style:width={property.isPath ? "18.5rem" : width}
		disabled={isPathLocked || locked}
		bind:value={inputValue}
	/>

	<!-- Latex -->
	{#if property.isMath}
		<a href="https://www.overleaf.com/learn/latex/Mathematical_expressions" target="_blank">
			<QuestionMarkIcon stroke="var(--text)" style="width: 1rem; height: 1rem;" />
		</a>
		<LatexIcon stroke="var(--text)" style="width: 3rem; position: absolute; left: 17rem;" />
		<LatexPreview latex={value} show={inputHover || inputFocus} />
	{/if}

	{#if property.isPath}
		<button class="lock" onclick={() => (isPathLocked = !isPathLocked)}>
			{#if isPathLocked}
				<LockIcon style="width: 1rem; height: 1rem;" stroke="var(--text)" />
			{:else}
				<UnlockIcon style="width: 1rem; height: 1rem;" stroke="var(--text)" />
			{/if}
		</button>
		<button onclick={choosePath}>
			<FolderIcon style="width: 1rem; height: 1rem;" stroke="var(--text)" />
		</button>
	{/if}
</div>

<style>
	.lock {
		position: absolute;
		top: 50%;
		right: 1.25rem;
		transform: translateY(-50%);
		background: var(--crust);
		padding: 0.5rem;
	}

	input {
		color: var(--text);
		background: var(--crust);
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-right: 2rem;
	}

	.input-container {
		position: relative;
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
</style>
