<script lang="ts">
	import { animationCategories, animations } from "../../api/manim/animations";
	import { getProperty } from "../../api/manim/properties";
	import { getPreferences, runAction } from "../../api/preferences.svelte";
	import { addProjectAnimation, getItemFromId, nextId, select, updateEndMarker, type ProjectAnimation } from "../../api/project.svelte";
	import Menu from "./Menu.svelte";

	let {
		top,
		left,
		openers = [],
		title = "Add Animation",
		onSelect = addAnimation,
		onAdd = animation => {},
		width = undefined,
		background = undefined,
		id,
	}: {
		onAdd?: (animation: ProjectAnimation) => void;
		title?: string | false;
		top: string;
		left: string;
		openers?: HTMLElement[];
		onSelect?: (name: string) => void;
		width?: string;
		background?: string;
		id?: number;
	} = $props();

	function addAnimation(type: string): void {
		menu.hide();

		let animation: ProjectAnimation = {
			id: nextId(),
			type: "animation",
			properties: {
				"Start Time": 0,
				Duration: 1,
				"Animation Type": type,
				Object: id,
				Name: `${type}${id !== undefined ? " " + getProperty(getItemFromId(id)! as any, "Name") : ""}`,
			},
		};

		onAdd(animation);
		addProjectAnimation(animation);
		updateEndMarker();
		select([animation.id]);
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let menu: Menu;

	export function show() {
		menu.show();
	}

	export function hide() {
		menu.hide();
	}

	export function isVisible() {
		return menu.isVisible();
	}
</script>

<Menu
	bind:this={menu}
	{top}
	{left}
	{openers}
	{title}
	{width}
	{background}
	{onSelect}
	demoType="video"
	submenus={animationCategories.map(category => ({
		name: category.name,
		icon: category.icon,
		options: animations
			.filter(animation => animation.category === category.name)
			.map(animation => ({ name: animation.name, icon: animation.icon, description: animation.description, demo: (animation as any).demo })),
		title: `Add ${category.name} Animation`,
		color: category.color,
	}))}
/>
