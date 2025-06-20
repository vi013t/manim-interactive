<script lang="ts">
	import namer from "color-namer";
	import { onMount } from "svelte";
	import { getMouseX, getMouseY } from "../../../api/client.svelte";
	import { colors } from "../../../api/manim/colors";

	let selected = $state("#FFFFFF");
	let visible = $state(false);
	let left = $state("0px");
	let top = $state("0px");

	let { onSelect, locked = false } = $props();

	export function show() {
		if (locked) return;
		left = `${getMouseX()}px`;
		top = `${getMouseY()}px`;
		visible = true;
	}

	export function hide() {
		visible = false;
	}

	let picker: HTMLElement;
	let pickIcon: HTMLElement;

	onMount(() => {
		document.addEventListener("click", event => {
			if (!event.composedPath().includes(picker) && !event.composedPath().includes(pickIcon)) {
				if (visible) onSelect(selected);
				hide();
			}
		});
	});

	function onColorClick(shade: string) {
		return function () {
			selected = shade;
		};
	}

	let name = $derived(
		Object.values(namer(selected))
			.map(nameList => ({ name: nameList[0].name, distance: nameList[0].distance }))
			.toSorted((a, b) => a.distance - b.distance)[0].name,
	);

	let foreground = $derived(contrastingColor(selected));

	function contrastingColor(color: string) {
		return luma(color) >= 165 ? "#000000" : "#ffffff";
	}

	function luma(color: string) {
		var rgb = hexToRGBArray(color.substring(1));
		return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
	}

	function hexToRGBArray(color: string) {
		if (color.length === 3) color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
		else if (color.length !== 6) throw "Invalid hex color: " + color;

		const rgb = [];
		for (let segment = 0; segment < 3; segment++) rgb[segment] = parseInt(color.substring(segment * 2, segment * 2 + 2), 16);
		return rgb;
	}
</script>

<div class="colors">
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<button style:color={foreground} class="picker" bind:this={pickIcon} style:background-color={selected} onclick={show}>{name}</button>
	<div class="choose" bind:this={picker} style:top style:left style:display={visible ? "flex" : "none"}>
		<div class="preset">
			{#each colors as hue}
				<div>
					{#each hue as shade}
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button onclick={onColorClick(shade)} style:background-color={shade}></button>
					{/each}
				</div>
			{/each}
			<label for="color-picker" class="custom"></label>
			<input type="color" id="color-picker" bind:value={selected} />
		</div>
		<button class="preview" style:color={foreground} style:background-color={selected}>{name}</button>
	</div>
</div>

<style>
	.choose {
		background-color: var(--crust);
		width: fit-content;
		padding: 1rem;
		border-radius: 0.5rem;
		flex-direction: column;
		position: absolute;
		z-index: 9999;
	}

	.picker {
		width: 20rem;
		height: 1.25rem;
		border-radius: 0.25rem;
		display: flex;
		justify-content: center;
		align-items: center;
		text-transform: capitalize;
	}

	.preset {
		display: flex;

		> div {
			display: flex;
			flex-direction: column;

			> button {
				width: 1rem;
				height: 1rem;
			}
		}
	}

	.custom {
		height: 5rem;
		margin-left: 1rem;
		width: 1rem;
		background: linear-gradient(
			180deg,
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 10%,
			rgba(208, 222, 33, 1) 20%,
			rgba(79, 220, 74, 1) 30%,
			rgba(63, 218, 216, 1) 40%,
			rgba(47, 201, 226, 1) 50%,
			rgba(28, 127, 238, 1) 60%,
			rgba(95, 21, 242, 1) 70%,
			rgba(186, 12, 248, 1) 80%,
			rgba(251, 7, 217, 1) 90%,
			rgba(255, 0, 0, 1) 100%
		);
	}

	.preview {
		width: 10rem;
		margin-top: 1rem;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		text-transform: capitalize;
	}

	input {
		opacity: 0%;
		position: absolute;
		pointer-events: none;
	}
</style>
