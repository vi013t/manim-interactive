<script lang="ts">
	import { onMount } from "svelte";
	import { type PropertyType } from "../../../api/manim/property";
	import { runAction } from "../../../api/preferences.svelte";
	import { addError, nextErrorId, removeError, selected, type ProjectAnimation, type ProjectObject } from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import LatexPreview from "./LatexPreview.svelte";
	import LatexIcon from "../../icons/LatexIcon.svelte";
	import QuestionMarkIcon from "../../icons/QuestionMarkIcon.svelte";
	import AddObjectMenu from "../../menus/AddObjectMenu.svelte";

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

	let valid = $state(true);

	// svelte-ignore non_reactive_update
	let input: HTMLInputElement;
	let inputValue = $state(`${defaultValue === null ? "" : defaultValue}`);

	let inputFocus = $state(false);

	function validate(): void {
		valid = isValid();
		if (!valid) addError({ objectId: selected()!.id, propertyName: name });
		else removeError({ objectId: selected()!.id, propertyName: name });
	}

	function isValid(): boolean {
		if (type.base === "number") {
			if (!/^-?\d+(\.\d+)?$/.test(input.value)) return false;
			let number = Number(input.value);
			if (type.isIntegeric && number !== Math.floor(number)) return false;
			if (number < type.minimumValue || number > type.maximumValue) return false;
			return true;
		}

		if (type.base === "string") {
			if (!type.canBeEmpty && input.value === "") return false;
			return true;
		}

		return true;
	}

	let inputHover = $state(false);

	let previousValue = defaultValue;


	function hasValueChanged() {
		return input && input.value !== previousValue;
	}

	function setColorProperty(color: string) {
		selected()!.properties[name] = color;
		runAction("Save Project");
	}

	function setProperty() {
		if (!valid || !hasValueChanged()) return;

		if (name === "startTime") {
			(selected() as ProjectAnimation).startTime = Number(input.value);
		} else if (name === "animation") {
		} else if (name === "objectType") {
			(selected() as ProjectObject).objectType = input.value;
		} else if (name === "name") {
			selected()!.name = input.value;
		} else if (type.base === "string") {
			selected()!.properties[name] = input.value;
		} else if (type.base === "number") {
			selected()!.properties[name] = Number(input.value);
		}
		previousValue = input.value;
		runAction("Save Project");
	}

	onMount(() => {
		validate();
	});

	function selectObject(type: string) {
		objectValueInput = type;
		selected()!.properties
	}
</script>

<!-- Animation -->
{#if type.base === "animation"}
	<button class="add-animation" bind:this={addButton} onclick={addAnimation}>{defaultValue}</button>
	<AddAnimationMenu bind:this={addAnimationMenu} {top} {left} hideParent={() => {}} openers={[addButton]} />

{:else if type.base === "object"}
	<button class="add-animation" bind:this={addButton} onclick={addObject}>{objectValueInput}</button>
	<AddObjectMenu onSelect={selectObject} bind:this={addObjectMenu} {top} {left} openers={[addButton]} title="Set Object Type"/>

	<!-- Color -->
{:else if type.base === "color"}
	<ColorPicker onSelect={setColorProperty} />

	<!-- string, number -->
{:else if type.base === "string" || type.base === "number"}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onmouseenter={() => (inputHover = true)} onmouseleave={() => (inputHover = false) } class="input-container">
		<input style:font-family={type.base === "string" && type.isMath ? "monospace" : "inherit"} onfocus={() => inputFocus = true} onblur={() => { setProperty(); inputFocus = false; }} bind:this={input} style:outline={valid ? "none" : "2px solid #f38ba8"} type="text" oninput={validate} bind:value={inputValue} />

		{#if type.base === "string" && type.isMath}
			<a href="https://www.overleaf.com/learn/latex/Mathematical_expressions" target="_blank">
				<QuestionMarkIcon stroke="#cdd6f4" style="width: 1rem; height: 1rem;" />
			</a>
			<LatexIcon stroke="#cdd6f4" style="width: 3rem; position: absolute; top: -0.58rem; right: 1.5rem;" />
			<LatexPreview latex={inputValue} show={inputHover || inputFocus} />
		{/if}
	</div>
{/if}

{#if !valid}
	<span class="error">
		<ErrorIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
		<span>Invalid Value</span>
	</span>
{/if}

{#if !required}
	<button onclick={deleteProperty(name)}><TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" /></button>
{/if}

<style>
	input,
	.add-animation {
		color: #cdd6f4;
		background: #11111b;
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
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
		width: 5rem;
	}

	input {
		width: 20rem;
	}

	.error {
		gap: 0.5rem;
		margin-left: 0.5rem;
		span {
			color: #f38ba8;
		}
	}
</style>
