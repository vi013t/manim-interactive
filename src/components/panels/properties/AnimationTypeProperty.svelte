<script lang="ts">
	import { animations, getAnimationCategory } from "../../../api/manim/animations";
	import { translate } from "../../../api/translate.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";

	let { value = $bindable(), width, locked }: { locked: boolean; value: string; width: string } = $props();

	let top = $state("");
	let left = $state("");

	// svelte-ignore non_reactive_update
	let addButton: HTMLButtonElement;
	let animationMenu: AddAnimationMenu;

	let Icon = $derived(animations.find(manimAnimation => manimAnimation.name === value)!.icon);
	let iconColor = $derived(getAnimationCategory(animations.find(object => object.name === value)!.category).color);

	let menuVisible = $state(false);

	function setAnimation() {
		if (locked) return;
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
		value = type;
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
