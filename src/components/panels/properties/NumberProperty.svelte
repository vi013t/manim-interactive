<script lang="ts">
	import { onMount } from "svelte";
	import type { NumberProperty } from "../../../api/manim/property";
	import { getProperty } from "../../../api/manim/property";
	import {
		animationEndTime,
		getAnimationFromId,
		getItemFromId,
		getProjectAnimations,
		getPropertiesFromId,
		intervalsOverlap,
		type ProjectAnimation,
	} from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";

	let {
		value = $bindable(),
		errorMessage = $bindable(),
		name,
		property,
		id,
		width,
		locked,
	}: {
		value: number;
		errorMessage: string | null;
		name: string;
		property: NumberProperty;
		width: string;
		id?: number;
		locked: boolean;
	} = $props();

	let inputHover = $state(false);
	let inputFocus = $state(false);

	function getErrorMessage(): string | null {
		if (!/^-?\d+(\.\d+)?$/.test(inputValue)) return "Value must be a number";
		let value = Number(inputValue);
		if (property.isIntegeric && value !== Math.floor(value)) return "Value must be an integer";
		let maximum = property.isAngle ? (mode === "Degrees" ? 360 : 2 * Math.PI) : property.maximumValue;
		if (value < property.minimumValue) return `Value cannot be less than ${property.minimumValue}`;
		if (value > maximum) return `Value cannot be greater than ${maximum}`;
		if (
			name === "Duration" &&
			getProjectAnimations()
				.filter(animation => animation.id !== id)
				.some(projectAnimation =>
					intervalsOverlap(
						[getProperty(projectAnimation, "Start Time")!, animationEndTime(projectAnimation)],
						[getProperty(getItemFromId(id!)! as ProjectAnimation, "Start Time")!, getProperty(getItemFromId(id!)! as ProjectAnimation, "Start Time")! + value],
					),
				)
		) {
			return `Animation overlaps with other animation`;
		}
		if (
			name === "Start Time" &&
			getAnimationFromId(id!) &&
			getProjectAnimations()
				.filter(animation => animation.id !== id)
				.some(projectAnimation =>
					intervalsOverlap(
						[getProperty(projectAnimation, "Start Time")!, animationEndTime(projectAnimation)],
						[value, value + getProperty(getItemFromId(id!)! as ProjectAnimation, "Duration")!],
					),
				)
		) {
			return `Animation overlaps with other animation`;
		}

		return null;
	}

	function validate() {
		errorMessage = getErrorMessage();
	}

	function trySetProperty() {
		validate();
		if (errorMessage) return;
		const finalValue = property.isAngle && mode === "Degrees" ? (Number(inputValue) * Math.PI) / 180 : Number(inputValue);
		value = finalValue;
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
		if (name === "Start Time" || name === "Duration") inputValue = (getPropertiesFromId(id!)! as any)[name];
	});

	let grabbingAngle = $state(false);

	onMount(() => {
		document.addEventListener("mousemove", event => {
			// if u know a better n less buggy way to do this ill give u head hmu
			if (grabbingAngle) {
				const xFactor = event.clientY - angleElement.getBoundingClientRect().top > 30 ? 1 : -1;
				const yFactor = event.clientX - angleElement.getBoundingClientRect().left < 30 ? 1 : -1;
				const max = mode === "Degrees" ? 360 : 2 * Math.PI;
				const scalar = max * 0.008;
				const raw = Number(inputValue) + (xFactor * event.movementX + yFactor * event.movementY) * scalar;
				inputValue = `${(((raw % max) + max) % max).toFixed(2)}`;
				angleElement.style.cursor = "grabbing";
				document.body.style.cursor = "grabbing";
			}
		});

		document.addEventListener("mouseup", event => {
			if (grabbingAngle) {
				trySetProperty();
				angleElement.style.cursor = "grab";
			}
			grabbingAngle = false;
			document.body.style.cursor = "initial";
		});
	});

	let mode = $state("Radians");
	// svelte-ignore non_reactive_update
	let angleElement: HTMLElement;

	function changeMode() {
		if (mode === "Radians") {
			mode = "Degrees";
			inputValue = `${((Number(inputValue) * 180) / Math.PI).toFixed(2)}`;
		} else {
			mode = "Radians";
			inputValue = `${((Number(inputValue) * Math.PI) / 180).toFixed(2)}`;
		}
		validate();
	}

	$effect(() => {
		inputValue = `${value}`;
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmouseenter={() => (inputHover = true)} onmouseleave={() => (inputHover = false)} class="input-container">
	{#if property.isAngle}
		<div
			bind:this={angleElement}
			onmousedown={() => (grabbingAngle = true)}
			class="angle {errorMessage ? 'error-angle' : null}"
			style:--rotation={`${mode === "Degrees" ? inputValue : (Number(inputValue) * 180) / Math.PI}deg`}
			style:rotate={errorMessage ? "0deg" : "calc(-1 * var(--rotation))"}
		>
			<div class={errorMessage ? "error" : "sector"}>
				{#if errorMessage}
					<ErrorIcon stroke="var(--red)" style="width: 1.5rem; height: 1.5rem;" />
				{/if}
			</div>
		</div>
	{/if}
	<input
		onfocus={() => (inputFocus = true)}
		onblur={onBlur}
		style:outline={errorMessage ? "2px solid var(--red)" : "none"}
		type="text"
		oninput={validate}
		onkeydown={onInput}
		autocomplete="off"
		style:width={property.isAngle ? "12rem" : width}
		bind:value={inputValue}
		disabled={locked}
	/>
	{#if property.isAngle}
		<button onclick={changeMode}>{mode}</button>
	{/if}
</div>

<style>
	.angle {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: 3px solid var(--text);
		position: relative;
		overflow: hidden;
		cursor: grab;

		&:not(.error-angle)::before {
			content: "";
			position: absolute;
			left: 50%;
			top: 50%;
			height: 3px;
			width: 50%;
			background-color: var(--text);
		}

		&:not(.error-angle)::after {
			content: "";
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateY(-50%);
			height: 3px;
			width: 50%;
			rotate: var(--rotation);
			transform-origin: top left;
			border-top: 3px dotted var(--text);
		}

		.sector {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0px;
			left: 0px;
			rotate: 90deg;
			background-image: conic-gradient(var(--text) 0deg var(--rotation), transparent var(--rotation) 360deg);
			opacity: 50%;
		}

		.error {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0px;
			left: 0px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
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
		padding-left: 0.5em;
	}

	.input-container {
		position: relative;
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	button {
		background-color: var(--crust);
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		border-radius: 0.5rem;
		width: 4rem;
		display: flex;
		justify-content: center;
	}
</style>
