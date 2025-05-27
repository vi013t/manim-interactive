<script lang="ts">
	import { onMount } from "svelte";
	import type { PropertyTypeBase } from "../../../api/manim/shared";
	import { runAction } from "../../../api/preferences.svelte";
	import { selected, type ProjectAnimation } from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";
	import ColorPicker from "./ColorPicker.svelte";

	let { type, name, defaultValue = "", required = false }: { type: PropertyTypeBase; name: string; defaultValue?: unknown; required?: boolean } = $props();

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

	function validate() {
		if (type === "float") {
			valid = /^-?\d+(\.\d+)?$/.test(input.value);
		}
	}

	function setProperty() {
		if (!valid) return;

		if (name === "startTime") {
			(selected() as ProjectAnimation).startTime = Number(input.value);
		} else if (name === "animation") {
		} else if (name === "name") {
			selected()!.name = input.value;
		} else if (type === "string") {
			selected()!.properties[name] = input.value;
		} else if (type === "float") {
			selected()!.properties[name] = Number(input.value);
		}

		runAction("Save Project");
	}

	onMount(validate);
</script>

<!-- Animation -->
{#if type === "animation"}
	<button bind:this={addAnimationButton} onclick={addAnimation}>{defaultValue}</button>
	<AddAnimationMenu bind:this={addAnimationMenu} {top} {left} hideParent={() => {}} openers={[addAnimationButton]} />

	<!-- Color -->
{:else if type === "color"}
	<ColorPicker oninput={() => {}} />

	<!-- string, number -->
{:else if type === "string" || type === "float"}
	<input onblur={setProperty} bind:this={input} style:outline={valid ? "none" : "2px solid #f38ba8"} type="text" oninput={validate} value={`${defaultValue}`} />
{/if}

{#if !valid}
	<span class="error">
		<ErrorIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
		<span>Invalid Value</span>
	</span>
{/if}

<style>
	input,
	button {
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
