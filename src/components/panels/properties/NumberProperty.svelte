<script lang="ts">
	import { onMount } from "svelte";
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

	let grabbingAngle = $state(false);

	onMount(() => {
		document.addEventListener("mousemove", event => {
			if (grabbingAngle) {
				let xFactor = event.clientY - angleElement.getBoundingClientRect().top > 30 ? 1 : -1;
				let yFactor = event.clientX - angleElement.getBoundingClientRect().left < 30 ? 1 : -1;
				const raw = Number(inputValue) + (xFactor * event.movementX) / 20 + (yFactor * event.movementY) / 20;
				const n = 2 * Math.PI;
				inputValue = `${(((raw % n) + n) % n).toFixed(2)}`;
				angleElement.style.cursor = "grabbing";
				document.body.style.cursor = "grabbing";
			}
		});

		document.addEventListener("mouseup", event => {
			grabbingAngle = false;
			angleElement.style.cursor = "grab";
			document.body.style.cursor = "initial";
		});
	});

	let mode = $state("Degrees");
	let angleElement: HTMLElement;
	let angle = $derived(mode === "Radians" ? Number(inputValue) : ((Number(inputValue) * 180) / Math.PI).toFixed(2));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmouseenter={() => (inputHover = true)} onmouseleave={() => (inputHover = false)} class="input-container">
	{#if property.isAngle}
		<div
			bind:this={angleElement}
			onmousedown={() => (grabbingAngle = true)}
			class="angle"
			style:--rotation={`${(Number(inputValue) * 180) / Math.PI}deg`}
			style:rotate="calc(-1 * var(--rotation))"
		>
			<div></div>
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
		style:width={property.isAngle ? "12rem" : "20rem"}
		bind:value={() => `${angle}`, value => (inputValue = value)}
	/>
	{#if property.isAngle}
		<button onclick={() => (mode = mode === "Degrees" ? "Radians" : "Degrees")}>{mode}</button>
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

		&::before {
			content: "";
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateY(-50%);
			height: 3px;
			width: 50%;
			background-color: var(--text);
		}

		&::after {
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

		> div {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0px;
			left: 0px;
			rotate: 90deg;
			background-image: conic-gradient(var(--text) 0deg var(--rotation), transparent var(--rotation) 360deg);
			opacity: 50%;
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
		border-radius: 0.25rem;
		width: 4rem;
		display: flex;
		justify-content: center;
	}
</style>
