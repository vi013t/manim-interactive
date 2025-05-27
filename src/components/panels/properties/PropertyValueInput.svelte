<script lang="ts">
	import { onMount } from "svelte";
	import { type PropertyType } from "../../../api/manim/properties";
	import { runAction } from "../../../api/preferences.svelte";
	import { addErrorId, nextErrorId, removeErrorId, selected, type ProjectAnimation, type ProjectObject } from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";
	import ColorPicker from "./ColorPicker.svelte";

	let {
		type,
		name,
		defaultValue,
		required,
		deleteProperty,
	}: { type: PropertyType; name: string; defaultValue: unknown; required: boolean; deleteProperty: (name: string) => () => void } = $props();

	const errorId = nextErrorId();

	// svelte-ignore non_reactive_update
	let addAnimationMenu: AddAnimationMenu;
	// svelte-ignore non_reactive_update
	let addAnimationButton: HTMLElement;

	let top = $state("0px");
	let left = $state("0px");

	function addAnimation(event: MouseEvent) {
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		addAnimationMenu.show();
	}

	let valid = $state(true);

	// svelte-ignore non_reactive_update
	let input: HTMLInputElement;

	let colorValue = $state("#FFFFFF");

	function validate(): void {
		valid = isValid();
		if (!valid) addErrorId(errorId);
		else removeErrorId(errorId);
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
</script>

<!-- Animation -->
{#if type.base === "animation"}
	<button class="add-animation" bind:this={addAnimationButton} onclick={addAnimation}>{defaultValue}</button>
	<AddAnimationMenu bind:this={addAnimationMenu} {top} {left} hideParent={() => {}} openers={[addAnimationButton]} />

	<!-- Color -->
{:else if type.base === "color"}
	<ColorPicker onSelect={setColorProperty} />

	<!-- string, number -->
{:else if type.base === "string" || type.base === "number"}
	<input
		onblur={setProperty}
		bind:this={input}
		style:outline={valid ? "none" : "2px solid #f38ba8"}
		type="text"
		oninput={validate}
		value={`${defaultValue === null ? "" : defaultValue}`}
	/>
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
		width: 5rem;
		outline-offset: -2px;
	}

	.error {
		gap: 0.5rem;
		margin-left: 0.5rem;
		span {
			color: #f38ba8;
		}
	}
</style>
