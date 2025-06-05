<script lang="ts">
	import type { AnimationTypeProperty } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, selected } from "../../../api/project.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";

	let {
		value = $bindable(),
		name,
		property,
	}: {
		value: number;
		name: string;
		property: AnimationTypeProperty;
	} = $props();

	function setProperty() {
		getItemFromId(selected()!)!.properties[name] = value;
		if (getPreferences().autosave) runAction("Save Project");
	}

	// svelte-ignore non_reactive_update
	let addButton: HTMLElement;
	let addAnimationMenu: AddAnimationMenu;

	let top = $state("");
	let left = $state("");

	function addAnimation() {
		addAnimationMenu.show();
	}
</script>

<button
	{@attach element => {
		top = `calc(${element.getBoundingClientRect().top}px + 1.5rem)`;
		left = `${element.getBoundingClientRect().left}px`;
	}}
	class="add-animation"
	bind:this={addButton}
	onclick={addAnimation}
>
	{value}
</button>
<AddAnimationMenu bind:this={addAnimationMenu} {top} {left} openers={[addButton]} />

<style>
	button {
		width: 20rem;
		color: #cdd6f4;
		background: #11111b;
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
