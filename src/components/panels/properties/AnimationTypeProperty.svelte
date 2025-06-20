<script lang="ts">
	import { animations, getAnimationCategory } from "../../../api/manim/animations";
	import type { AnimationTypeProperty } from "../../../api/manim/property";
	import { getProperty } from "../../../api/manim/property";
	import { getItemFromId, selected, type ProjectAnimation } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";

	let top = $state("");
	let left = $state("");
	let item = $state(getItemFromId(selected()[0])! as ProjectAnimation);

	let Icon = $derived(animations.find(manimAnimation => manimAnimation.name === getProperty(item, "Animation Type")!)!.icon);
	let iconColor = $derived(getAnimationCategory(animations.find(object => object.name === getProperty(item, "Animation Type")!)!.category).color);

	// svelte-ignore non_reactive_update
	let addButton: HTMLButtonElement;
	let animationMenu: AddAnimationMenu;

	let {
		value = $bindable(),
		name,
		property,
		width,
		setProperty,
	}: { value: string; name: string; width: string; property: AnimationTypeProperty; setProperty(value: unknown): void } = $props();

	let menuVisible = $state(false);

	function setAnimation() {
		if (animationMenu.isVisible()) {
			menuVisible = false;
			animationMenu.hide();
		} else {
			animationMenu.show();
			menuVisible = true;
		}
	}

	function changeAnimationType(type: string) {
		menuVisible = false;
		animationMenu.hide();
		setProperty(type);
	}
</script>

<button
	{@attach element => {
		top = `calc(${element.getBoundingClientRect().top}px + 1.5rem)`;
		left = `${element.getBoundingClientRect().left}px`;
	}}
	bind:this={addButton}
	style:width
	onclick={setAnimation}
>
	<Icon stroke={iconColor} style="width: 1rem; height: 1rem" />
	{translate(value)}
	<RightArrow stroke="var(--lavender)" style="width: 1rem; height: 1rem; margin-left: auto; transform: rotate({menuVisible ? '90deg' : '0deg'}); transition: transform 0.1s;" />
</button>
<AddAnimationMenu {width} background="var(--base)" onSelect={changeAnimationType} bind:this={animationMenu} {top} {left} openers={[document as any]} title={false} />

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
