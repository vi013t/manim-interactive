<script lang="ts">
	import type { Component } from "svelte";
	import { getHorizontalExpandDirection, getVerticalExpandDirection } from "../../api/client.svelte";
	import { translate } from "../../api/translate.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import ContextMenu from "./ContextMenu.svelte";
	import Submenu, { type MenuOption } from "./Submenu.svelte.svelte";

	let {
		top,
		left,
		title,
		openers = [],
		onSelect,
		submenus,
		width = undefined,
		background = "var(--mantle)",
		demoType = "image",
	}: {
		top: string;
		left: string;
		title: string | false;
		background?: string;
		onSelect: (choice: string) => void;
		demoType?: "image" | "video" | "none";
		width?: string;
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
		if (menu.isVisible()) hide();
		else show();
	}

	export function hide() {
		hoveredSubmenu = null;
		menu.hide();
	}

	export function isVisible() {
		return menu.isVisible();
	}

	function showMenu(submenuName: string) {
		return function () {
			hoveredSubmenu = submenuName;
			submenus.forEach(menu => menu.menu.hide());
			submenus.find(menu => menu.name === submenuName)!.menu.show();
		};
	}

	let hoveredSubmenu: string | null = $state(null);

	function closeOnSelect(choice: string) {
		hide();
		onSelect(choice);
	}
</script>

<ContextMenu {width} {background} bind:this={menu} {top} {left} {openers}>
	{#if title}<span>{translate(title)}</span>{/if}
	{#each submenus as submenu, index}
		<button style:background-color={hoveredSubmenu === submenu.name ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={showMenu(submenu.name)}>
			<submenu.icon stroke={submenu.color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{translate(submenu.name)}
			<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
		</button>

		<Submenu
			{title}
			{background}
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
		border-bottom: 1px solid var(--surface-0);
	}
</style>
