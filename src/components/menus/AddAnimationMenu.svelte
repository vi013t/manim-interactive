<script lang="ts">
	import { animationCategories, animations } from "../../api/manim/animations";
	import { getPreferences, runAction } from "../../api/preferences.svelte";
	import { addProjectAnimation, getItemFromId, nextId, select, type ProjectAnimation } from "../../api/project.svelte";
	import Menu from "./Menu.svelte";

	let {
		top,
		left,
		openers = [],
		title = "Add Animation",
		onSelect = addAnimation,
		onAdd = animation => {},
		id,
	}: {
		onAdd?: (animation: ProjectAnimation) => void;
		title?: string;
		top: string;
		left: string;
		openers?: HTMLElement[];
		onSelect?: (name: string) => void;
		id?: number;
	} = $props();

	function addAnimation(type: string): void {
		menu.hide();
		let animation = {
			name: `${type}${id !== undefined ? " " + getItemFromId(id)!.name : ""}`,
			id: nextId(),
			properties: {},
			startTime: 0,
			duration: 1,
			animationType: type,
			objects: id !== undefined ? [id] : [],
		};
		onAdd(animation);
		addProjectAnimation(animation);
		select(animation);
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let menu: Menu;

	export function show() {
		menu.show();
	}

	export function hide() {
		menu.hide();
	}
</script>

<Menu
	bind:this={menu}
	{top}
	{left}
	{openers}
	{title}
	{onSelect}
	demoType="video"
	submenus={animationCategories.map(category => ({
		name: category.name,
		icon: category.icon,
		options: animations
			.filter(animation => animation.category === category.name)
			.map(animation => ({ name: animation.name, icon: animation.icon, description: "", demo: (animation as any).demo })),
		title: `Add ${category.name} Animation`,
		color: category.color,
	}))}
/>
