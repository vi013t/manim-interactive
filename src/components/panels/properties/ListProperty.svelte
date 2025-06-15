<script lang="ts">
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import type { ListProperty } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, selected } from "../../../api/project.svelte";
	import HandleIcon from "../../icons/HandleIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import PropertyValueInput from "./PropertyValueInput.svelte";

	let {
		value = $bindable(),
		name,
		property,
	}: {
		value: unknown[];
		name: string;
		property: ListProperty;
	} = $props();

	let listCollapsed = $state(false);
	let item = $derived(getItemFromId(selected()!)!);
	let listElements: HTMLSpanElement[] = $state([]);
	let grabbingIndex = $state(0);
	let grabY = $state(0);
	let grabElement: HTMLElement | null = $state(null);

	function deleteProperty(name: string) {
		return function () {
			delete (item!.properties as any)[name];
			if (getPreferences().autosave) runAction("Save And Recompile Project");
		};
	}

	onMount(() => {
		document.addEventListener("mouseup", event => {
			if (grabElement) {
				grabElement = null;
				console.log(event.clientY - grabY);
				if (event.clientY - grabY > 50) {
					let list: any[] = (item.properties as any)[name] as any[];
					let temp = list[grabbingIndex];
					list[grabbingIndex] = list[grabbingIndex + 1];
					list[grabbingIndex + 1] = temp;
					runAction("Save And Recompile Project");
				}
			}
		});

		document.addEventListener("mousemove", event => {
			if (grabElement) {
			}
		});
	});
</script>

<div class="list">
	{#if !(value as any[]).length || listCollapsed}
		<span style:align-items="center">
			<button class="list-items-header" onclick={() => (listCollapsed = false)}>
				[{value.length === 0 ? "No" : value.length} Items] {#if value.length !== 0}
					(Click to Expand)
				{/if}
			</button>
			{#if !listCollapsed && value.length !== 0}
				<button
					onclick={() => {
						((item.properties as any)[name] as unknown[]).push((property.type as any).defaultValue);
					}}
				>
					Add Another
				</button>
			{:else}
				<button onclick={deleteProperty(name)}><TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" /></button>
			{/if}
		</span>
	{/if}

	{#if !listCollapsed}
		{#each value as element, index (index)}
			<span bind:this={listElements[index]} animate:flip>
				<span>
					<PropertyValueInput
						type={property.type}
						name={null!}
						value={element as any}
						required={false}
						deleteProperty={() => {
							((item.properties as any)[name] as any[]).splice(index, 1);
						}}
					/>
					<button
						class="handle"
						onmousedown={() => {
							grabbingIndex = index;
							grabY = listElements[index].getBoundingClientRect().top;
							grabElement = listElements[index];
						}}
						style:cursor={grabElement === listElements[index] ? "grabbing" : "grab"}
					>
						<HandleIcon stroke="var(--surface-2)" style="width: 1rem; height: 1rem;" />
					</button>
					{#if index === 0}
						<button onclick={() => (listCollapsed = !listCollapsed)}>Collapse</button>
					{/if}
				</span>
			</span>
		{/each}
	{:else}{/if}

	{#if !listCollapsed}
		<span class="list-bottom">
			<button
				onclick={() => {
					((item.properties as any)[name] as unknown[]).push((property.type as any).defaultValue);
				}}
			>
				Add Another
			</button>
			<button onclick={deleteProperty(name)} style="color: var(--red);">Delete All</button>
		</span>
	{/if}
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		width: 22rem;
		gap: 0.5rem;
		position: relative;

		button:not(.list-items-header) {
			width: fit-content;
			margin-left: auto;
		}

		.handle {
			background-color: transparent;
			cursor: grab;
		}

		&:has(span:not(:first-child))::before {
			content: "";
			display: block;
			position: absolute;
			height: calc(100% - 4.75rem);
			width: 0.5rem;
			bottom: 3rem;
			left: -1rem;
			border-left: 1px solid var(--surface-0);
			border-bottom: 1px solid var(--surface-0);
		}
	}

	.list-items-header {
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		background-color: var(--crust);
		padding: 0.25rem;
	}

	.list-bottom {
		justify-content: flex-end;
		align-items: center;
		gap: 0.5rem;
		width: 100%;

		> * {
			margin-left: 0px !important;
		}
	}
</style>
