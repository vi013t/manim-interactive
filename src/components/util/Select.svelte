<script lang="ts">
	import type { Component } from "svelte";
	import RightArrow from "../icons/RightArrow.svelte";

	type Option = string | { name: string; icon: Component<{ stroke: string; [key: string]: unknown }>; color: string };

	let {
		options,
		onSelect = () => {},
		value = $bindable(),
		...rest
	}: {
		value?: Option;
		onSelect?: (value: string) => void;
		options: Option[];
		[key: string]: unknown;
	} = $props();

	let optionsVisible = $state(false);

	function select(option: Option) {
		return function () {
			optionsVisible = false;
			value = option;
			onSelect(typeof option === "string" ? option : option.name);
		};
	}

	let element: HTMLElement;

	function onSelectClick(event: MouseEvent) {
		if (event.target === element) {
			optionsVisible = !optionsVisible;
		}
	}
</script>

<button bind:this={element} class="select" {...rest} onclick={onSelectClick} onblur={() => (optionsVisible = false)}>
	<span>{value ? (typeof value === "string" ? value : value.name) : ""}</span>
	<div class="options" style:display={optionsVisible ? "flex" : "none"}>
		{#each options as option}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div onclick={select(typeof option === "string" ? option : option.name)}>
				{#if typeof option === "string"}
					{option}
				{:else}
					<option.icon stroke={option.color} style="width: 1rem; height: 1rem;" />
					{option.name}
				{/if}
			</div>
		{/each}
	</div>
	<RightArrow stroke="#b4befe" style="width: 1rem; height: 1rem; margin-left: auto; transform: rotate({optionsVisible ? '90deg' : '0deg'}); transition: transform 0.1s;" />
</button>

<style>
	.select {
		cursor: pointer;
		border-radius: 0.5rem;
		padding: 0.25rem;
		position: relative;
		width: 20rem;
		background-color: #11111b;

		span {
			color: #cdd6f4;
		}
	}

	.options {
		flex-direction: column;
		width: 100%;
		border-radius: 0.5rem;
		position: absolute;
		left: 0px;
		top: 100%;
		background: #11111b;
		border: 1px solid #313244;
		overflow: hidden;
		box-shadow: 0px 0px 0.5rem black;
		z-index: 99;

		> * {
			padding: 0.5rem;
			color: #cdd6f4;
			background-color: #11111b;
			text-align: left;
			display: flex;
			align-items: center;
			gap: 0.5rem;

			&:hover {
				background: rgba(180, 150, 255, 10%);
			}
		}
	}
</style>
