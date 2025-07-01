<script lang="ts" generics="ElementType extends keyof HTMLElementTagNameMap">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cursorIsIn } from "../../api/client.svelte";
	import { getPreferences } from "../../api/preferences.svelte";

	type AtLeastOne<T> = {
		[K in keyof T]: Required<Pick<T, K>> & Partial<Omit<T, K>>;
	}[keyof T];

	type Props =
		| { text: string }
		| ({ text: string } & AtLeastOne<
				{
					children: Snippet;
					element: ElementType;
				} & HTMLAttributes<HTMLElementTagNameMap[ElementType]>
		  >);

	let props: Props = $props();
	let { text, children, element = "div", ...rest } = $derived(props as any);

	let tooltip: HTMLSpanElement | null = $state(null);

	let visible = $derived.by(() => {
		if (!getPreferences().showTooltips) return false;

		let rect = tooltip?.parentElement?.getBoundingClientRect();
		if (!rect) return false;

		return cursorIsIn(rect);
	});
</script>

{#snippet content()}
	<span style:display={visible ? "inline-block" : "none"} bind:this={tooltip}>{text}</span>
{/snippet}

{#if children || element !== "div" || Object.keys(rest).length > 0}
	<svelte:element this={element} {...rest} style:position="relative" style:z-index="99999">
		{@render children()}
		{@render content()}
	</svelte:element>
{:else}
	{@render content()}
{/if}

<style>
	span {
		position: absolute;
		height: auto;
		width: max-content;
		max-width: 20rem;
		color: var(--subtext-0);
		background-color: var(--crust);
		border: 1px solid var(--surface-0);
		top: calc(100% + 1rem);
		left: 50%;
		transform: translateX(-50%);
		padding: 0.75em;
		box-shadow: 0px 0px 0.5em black;
		border-radius: 0.5em;
		font-size: 0.85rem;
		text-align: left;
		text-transform: none;

		&::after {
			content: "";
			display: block;
			width: 1rem;
			height: 1rem;
			background: inherit;
			position: absolute;
			top: -0.65rem;
			left: 50%;
			transform: translateX(-50%) rotate(225deg);
			border-bottom: 2px solid var(--surface-0);
			border-right: 2px solid var(--surface-0);
		}
	}
</style>
