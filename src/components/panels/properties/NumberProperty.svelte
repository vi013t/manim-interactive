<script lang="ts">
	import type { NumberProperty } from "../../../api/manim/property";
	import { getProperty } from "../../../api/manim/property";
	import {
		addError,
		animationEndTime,
		getItemFromId,
		getProjectAnimations,
		getPropertiesFromId,
		intervalsOverlap,
		removeError,
		selected,
		type ProjectAnimation,
	} from "../../../api/project.svelte";

	let {
		value = $bindable(),
		errorMessage = $bindable(),
		name,
		property,
		id,
		setProperty,
	}: {
		value: number;
		errorMessage: string | null;
		name: string;
		property: NumberProperty;
		id: number;
		setProperty(value: unknown): void;
	} = $props();

	let inputHover = $state(false);
	let inputFocus = $state(false);

	function getErrorMessage(): string | null {
		if (!/^-?\d+(\.\d+)?$/.test(inputValue)) return "Value must be a number";
		let value = Number(inputValue);
		if (property.isIntegeric && value !== Math.floor(value)) return "Value must be an integer";
		if (value < property.minimumValue) return `Value cannot be less than ${property.minimumValue}`;
		if (value > property.maximumValue) return `Value cannot be greater than ${property.maximumValue}`;
		if (
			name === "Duration" &&
			getProjectAnimations()
				.filter(animation => animation.id !== id)
				.some(projectAnimation =>
					intervalsOverlap(
						[getProperty(projectAnimation, "Start Time")!, animationEndTime(projectAnimation)],
						[getProperty(getItemFromId(id)! as ProjectAnimation, "Start Time")!, getProperty(getItemFromId(id)! as ProjectAnimation, "Start Time")! + value],
					),
				)
		) {
			return `Animation overlaps with other animation`;
		}
		if (
			name === "Start Time" &&
			getProjectAnimations()
				.filter(animation => animation.id !== id)
				.some(projectAnimation =>
					intervalsOverlap(
						[getProperty(projectAnimation, "Start Time")!, animationEndTime(projectAnimation)],
						[value, value + getProperty(getItemFromId(id)! as ProjectAnimation, "Duration")!],
					),
				)
		) {
			return `Animation overlaps with other animation`;
		}

		return null;
	}

	function validate() {
		errorMessage = getErrorMessage();
		if (errorMessage) addError({ objectId: selected()[0], propertyName: name });
		else removeError({ objectId: selected()[0], propertyName: name });
	}

	function trySetProperty() {
		validate();
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
			return;
		}
	}

	function onBlur() {
		trySetProperty();
		inputFocus = false;
	}

	let inputValue = $state(`${value}`);

	$effect(() => {
		inputValue = (getPropertiesFromId(id)! as any)[name];
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmouseenter={() => (inputHover = true)} onmouseleave={() => (inputHover = false)} class="input-container">
	<input
		onfocus={() => (inputFocus = true)}
		onblur={onBlur}
		style:outline={errorMessage ? "2px solid var(--red)" : "none"}
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
