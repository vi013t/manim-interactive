<script lang="ts">
	import { onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { value = $bindable(), ...attributes  }: { value: boolean } & { [Key in keyof HTMLAttributes<HTMLButtonElement>]: HTMLAttributes<HTMLButtonElement>[Key] } = $props();

	let button: HTMLButtonElement = $state(null!);

	onMount(() => {
		button.addEventListener("click", () => value = !value);
	});
</script>

<button 
	bind:this={button} 
	{...attributes} 
	style:--thumb-left={value ? `calc(100% - ${(button?.getBoundingClientRect().height ?? 0) / 2}px - var(--padding) * 2)` : "var(--padding)"}
	style:--thumb-color={value ? "var(--lavender)" : "var(--surface-2)"}
></button>

<style>
	button {
		width: 2.75rem;
		height: 1.5rem;
		background-color: var(--crust);
		border-radius: 100vmax;
		position: relative;
		--padding: 4px;

		&::after {
			content: "";
			position: absolute;
			background-color: var(--thumb-color);
			height: calc(100% - 2 * var(--padding));
			aspect-ratio: 1;
			top: var(--padding);
			border-radius: 50%;
			left: var(--thumb-left);
			transition: left 0.2s, background-color 0.2s;
		}
	}
</style>
