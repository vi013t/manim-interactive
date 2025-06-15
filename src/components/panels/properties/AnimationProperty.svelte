<script lang="ts">
	import type { AnimationTypeProperty } from "../../../api/manim/property";
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
		color: var(--text);
		background: var(--crust);
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
