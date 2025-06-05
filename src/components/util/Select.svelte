<script lang="ts">
	import { onMount, type Component } from "svelte";
	import RightArrow from "../icons/RightArrow.svelte";

	export type ComplexOption = { name: string; icon?: Component<{ stroke: string; [key: string]: unknown }>; color?: string; style?: string };
	export type SelectOption = string | ComplexOption;

	let {
		options,
		onSelect,
		itemOverride,
		value = $bindable(),
		...rest
	}: {
		value?: SelectOption;
		itemOverride?: string;
		onSelect: (value: string) => void;
		options: SelectOption[];
		[key: string]: unknown;
	} = $props();

	let optionsVisible = $state(false);

	function select(option: string) {
		return function () {
			optionsVisible = false;
			value = option;
			onSelect(option);
		};
	}

	let element: HTMLElement;

	function onSelectClick(event: MouseEvent) {
		optionsVisible = !optionsVisible;
	}

	onMount(() => {
		document.addEventListener("click", event => {
			if (!event.composedPath().includes(element)) {
				optionsVisible = false;
			}
		});
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div bind:this={element} class="select" {...rest}>
	<!-- Select Button -->
	<button onclick={onSelectClick} class="header">
		{#if value}
			{@const option = options.find(option => typeof option !== "string" && option.name === (typeof value === "string" ? value : value!.name)) as ComplexOption | undefined}
			{#if option}
				{#if option.icon}
					<option.icon stroke={option.color ?? "#FFFFFF"} style="width: 1rem; height: 1rem;" />
				{/if}
				<span style={option.style ?? ""}>{option.name}</span>
			{:else}
				{JSON.stringify(options) + JSON.stringify(value)}
			{/if}
		{/if}
		<RightArrow stroke="#b4befe" style="width: 1rem; height: 1rem; margin-left: auto; transform: rotate({optionsVisible ? '90deg' : '0deg'}); transition: transform 0.1s;" />
	</button>

	<!-- Options -->
	<div class="options" style:display={optionsVisible ? "flex" : "none"}>
		{#each options as option}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div onclick={select(typeof option === "string" ? option : option.name)} style={typeof option !== "string" && option.style ? option.style : ""}>
				{#if typeof option === "string"}
					{option}
				{:else}
					{#if option.icon}
						<option.icon stroke={option.color ?? "#FFFFFF"} style="width: 1rem; height: 1rem;" />
					{/if}
					{#if itemOverride}
						{itemOverride}
					{:else}
						{option.name}
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.select {
		cursor: pointer;
		border-radius: 0.5rem;
		padding: 0.25rem;
		position: relative;
		width: 20rem;
		background-color: #11111b;
	}

	div,
	button {
		color: #cdd6f4;
	}

	.header {
		align-items: center;
		display: flex;
		width: 100%;
		gap: 0.5rem;
	}

	.options {
		flex-direction: column;
		width: 100%;
		border-radius: 0.5rem;
		position: absolute;
		left: 0px;
		top: calc(100% + 0.25rem);
		background: #11111b;
		border: 1px solid #313244;
		overflow: hidden;
		box-shadow: 0px 0px 0.5rem black;
		z-index: 99;
		max-height: 10rem;
		overflow-y: auto;

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
