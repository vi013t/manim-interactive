<script lang="ts">
	import { animations, getAnimationCategory } from "../../../api/manim/animations";
	import { getProperty } from "../../../api/manim/properties";
	import type { AnimationTypeProperty } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, selected, type ProjectAnimation } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";

	let top = $state("");
	let left = $state("");
	let item = $state(getItemFromId(selected()![0])! as ProjectAnimation);

	let Icon = $derived(animations.find(manimAnimation => manimAnimation.name === getProperty(item, "Animation Type")!)!.icon);
	let iconColor = $derived(getAnimationCategory(animations.find(object => object.name === getProperty(item, "Animation Type")!)!.category).color);

	// svelte-ignore non_reactive_update
	let addButton: HTMLButtonElement;
	let animationMenu: AddAnimationMenu;

	let { value = $bindable(), name, property }: { value: string; name: string; property: AnimationTypeProperty } = $props();

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
		item.properties["Animation Type"] = type;
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}
</script>

<button
	{@attach element => {
		top = `calc(${element.getBoundingClientRect().top}px + 1.5rem)`;
		left = `${element.getBoundingClientRect().left}px`;
	}}
	bind:this={addButton}
	onclick={setAnimation}
>
	<Icon stroke={iconColor} style="width: 1rem; height: 1rem" />
	{translate(value)}
	<RightArrow stroke="var(--lavender)" style="width: 1rem; height: 1rem; margin-left: auto; transform: rotate({menuVisible ? '90deg' : '0deg'}); transition: transform 0.1s;" />
</button>
<AddAnimationMenu width="20rem" background="var(--base)" onSelect={changeAnimationType} bind:this={animationMenu} {top} {left} openers={[document as any]} title={false} />

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
