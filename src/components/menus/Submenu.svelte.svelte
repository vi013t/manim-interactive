<script lang="ts">
	import type { Component } from "svelte";
	import { getHorizontalExpandDirection, getVerticalExpandDirection } from "../../api/client.svelte";
	import { getPreferences } from "../../api/preferences.svelte";
	import { translate } from "../../api/translate.svelte";
	import ExternalLink from "../util/ExternalLink.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	export type MenuOption = { name: string; description: string; demo: string; icon: Component<{ stroke: string; [key: string]: unknown }>; documentation?: string[] };

	let {
		top,
		bottom,
		left,
		onSelect,
		options,
		color,
		title,
		demoType,
		background,
	}: {
		options: MenuOption[];
		title: string | false;
		color: string;
		background: string;
		top?: string;
		bottom?: string;
		left: string;
		demoType: "image" | "video" | "none";
		onSelect: (choice: string) => void;
	} = $props();

	let menu: ContextMenu;

	let horizontalExpand = $state("right");
	let verticalExpand = $state("bottom");

	export function show() {
		horizontalExpand = getHorizontalExpandDirection();
		verticalExpand = getVerticalExpandDirection();
		menu.show();
	}

	export function hide() {
		menu.hide();
		hoveringOption = null;
	}

	let hoveringOption: MenuOption | null = $state(null);
	let hoveringIndex: number | null = $state(null);
</script>

<ContextMenu
	bind:this={menu}
	{top}
	{bottom}
	{left}
	{background}
	onHide={() => {
		hoveringOption = null;
		hoveringIndex = null;
	}}
>
	{#if title}<span>{translate(title)}</span>{/if}
	{#each options as option, index}
		<!-- svelte-ignore a11y_mouse_events_have_key_events -->
		<button
			onclick={() => onSelect(option.name)}
			onmouseover={() => {
				hoveringOption = option;
				hoveringIndex = index;
			}}
		>
			<option.icon stroke={color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{translate(option.name)}
		</button>
	{/each}
</ContextMenu>

{#if getPreferences().previews && hoveringOption && demoType !== "none"}
	<div
		class="info"
		style:left={horizontalExpand === "left" ? "-33rem" : "30rem"}
		style:top={verticalExpand === "bottom" ? `calc(${top} + ${1.85 + hoveringIndex! * 1.72}rem)` : undefined}
		style:bottom={verticalExpand === "top" ? `calc(${bottom} + ${(options.length - 1 - hoveringIndex!) * 1.72}rem)` : undefined}
	>
		<h1>
			<hoveringOption.icon stroke={color} style="width: 1rem; height: 1rem;" />
			{translate(hoveringOption.name)}
		</h1>
		<p>{hoveringOption.description}</p>
		{#if demoType === "image"}
			<img src={hoveringOption.demo} alt="{hoveringOption.name} demo" />
		{:else}
			<!-- svelte-ignore a11y_media_has_caption -->
			<video src={hoveringOption.demo} autoplay loop></video>
		{/if}

		{#if hoveringOption.documentation}
			<ExternalLink hrefs={hoveringOption.documentation} style="margin-left: 1rem; margin-top: -1rem; margin-bottom: 1rem;">Documentation</ExternalLink>
		{/if}
	</div>
{/if}

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	.info {
		position: absolute;
		left: -35rem;
		background-color: #1e1e2e;
		width: fit-content;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-radius: 0.5rem;
		padding: 0px;

		&:hover {
			background-color: #1e1e2e;
		}

		h1 {
			background-color: #181825;
			padding-left: 1rem;
			padding-right: 1rem;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
			border-top-left-radius: 0.5rem;
			border-top-right-radius: 0.5rem;
			display: flex;
			gap: 0.5rem;
			align-items: center;
		}

		p {
			color: #9399b2;
			margin-top: -0.5rem;
			font-size: 0.85rem;
			padding-left: 1rem;
			padding-right: 1rem;
		}

		img,
		video {
			width: 16rem;
			height: 9rem;
			margin-left: 1rem;
			margin-right: 1rem;
			margin-bottom: 1rem;
		}
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;
	}
</style>
