<script lang="ts">
	import type { PropertyType } from "../../../api/manim/shared";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";

	let { propertyType, defaultValue = "", required = false }: { propertyType: PropertyType; defaultValue?: unknown; required?: boolean } = $props();

	let inputType = propertyType === "color" ? "color" : "text";

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
</script>

{#if propertyType === "animation"}
	<button bind:this={addAnimationButton} onclick={addAnimation}>{defaultValue}</button>
	<AddAnimationMenu bind:this={addAnimationMenu} {top} {left} hideParent={() => {}} openers={[addAnimationButton]} />
{:else}
	<input type={inputType} placeholder={`${defaultValue}`} />
{/if}

<style>
	input,
	button {
		color: #cdd6f4;
		background: #11111b;
		padding: 0.3em;
		border-radius: 0.5em;
		width: 5rem;
	}
</style>
