<script lang="ts">
	import type { Component } from "svelte";
	import { getHorizontalExpandDirection, getVerticalExpandDirection } from "../../api/client.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import Submenu, { type MenuOption } from "./Submenu.svelte.svelte";

	let {
		top,
		left,
		title,
		openers = [],
		onSelect,
		submenus,
		demoType = "image",
	}: {
		top: string;
		left: string;
		title: string;
		onSelect: (choice: string) => void;
		demoType?: "image" | "video" | "none";
		submenus: {
			title: string;
			name: string;
			color: string;
			icon: Component<{ stroke: string; [key: string]: unknown }>;
			options: MenuOption[];
			menu?: any;
		}[];
		openers?: HTMLElement[];
	} = $props();

	let menu: ContextMenu;

	let horizontalExpand = $state("right");
	let verticalExpand = $state("bottom");

	export function show() {
		horizontalExpand = getHorizontalExpandDirection();
		verticalExpand = getVerticalExpandDirection();
		menu.show();
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
	}

	function showMenu(submenuName: string) {
		return function () {
			submenus.forEach(menu => menu.menu.hide());
			submenus.find(menu => menu.name === submenuName)!.menu.show();
		};
	}

	function closeOnSelect(choice: string) {
		hide();
		onSelect(choice);
	}
</script>

<ContextMenu bind:this={menu} {top} {left} {openers}>
	<span>{title}</span>
	{#each submenus as submenu, index}
		<button onmouseenter={showMenu(submenu.name)}>
			<submenu.icon stroke={submenu.color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{submenu.name}
			<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
		</button>

		<Submenu
			{title}
			{demoType}
			top={verticalExpand === "bottom" ? `${1.85 + index * 1.73}rem` : undefined}
			bottom={verticalExpand === "top" ? `${8.5 - index * 1.73}rem` : undefined}
			left={horizontalExpand === "right" ? "100%" : "-100%"}
			options={submenu.options}
			bind:this={submenu.menu}
			onSelect={closeOnSelect}
			color={submenu.color}
		/>
	{/each}
</ContextMenu>

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;
	}
</style>
