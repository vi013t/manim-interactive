<script lang="ts">
	import { onMount } from "svelte";
	import { generateObjectPreview } from "../../../api/codegen.svelte";
	import type { ListProperty } from "../../../api/manim/property";
	import { runAction } from "../../../api/preferences.svelte";
	import { getObjectFromId, getSingleSelection } from "../../../api/project.svelte";
	import HandleIcon from "../../icons/HandleIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import PropertyValueInput from "./PropertyValueInput.svelte";

	let {
		value = $bindable(),
		property,
		width,
		required,
		onError,
		onErrorFixed,
		deleteProperty,
		locked,
		id,
	}: {
		value: unknown[];
		property: ListProperty;
		width: string;
		deleteProperty(): void;
		required: boolean;
		locked: boolean;
		onError(): void;
		onErrorFixed(): void;
		id?: number;
	} = $props();

	let listCollapsed = $state(false);
	let listElements: HTMLSpanElement[] = $state([]);
	let grabbingIndex = $state(0);
	let grabY = $state(0);
	let grabElement: HTMLElement | null = $state(null);

	onMount(() => {
		document.addEventListener("mouseup", event => {
			if (grabElement) {
				grabElement = null;
				value.splice(swappingIndex, 0, value.splice(grabbingIndex, 1)[0]);
				grabline.style.opacity = "0%";
				counter++;
				const object = getObjectFromId(getSingleSelection()!);
				if (object) generateObjectPreview(object);
				runAction("Save And Recompile Project");
			}
		});

		document.addEventListener("mousemove", updateGrab);
	});

	function updateGrab(event: MouseEvent) {
		if (grabElement) {
			swappingIndex = Math.max(0, Math.min(Math.floor((event.clientY - list.getBoundingClientRect().top) / 30), value.length - 1));
			grabline.style.opacity = "100%";
			grabline.style.top = `${swappingIndex * 30}px`;
			grabElement.style.top = `${event.clientY - list.getBoundingClientRect().top}px`;
		}
	}

	let swappingIndex = $state(0);
	let counter = $state(1);

	// svelte-ignore non_reactive_update
	let grabline: HTMLElement;
	let list: HTMLElement;
</script>

<div class="list" bind:this={list}>
	{#if !(value as any[]).length || listCollapsed}
		<span style:align-items="center">
			<button class="list-items-header" style:width onclick={() => (listCollapsed = false)}>
				[{value.length === 0 ? "No" : value.length} Items] {#if value.length !== 0}
					(Click to Expand)
				{/if}
			</button>
			{#if !listCollapsed && value.length !== 0}
				<button
					onclick={() => {
						value.push((property.type as any).defaultValue);
					}}
				>
					Add Another
				</button>
			{:else if !required}
				<button onclick={deleteProperty}><TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" /></button>
			{/if}
		</span>
	{/if}

	{#if !listCollapsed}
		{#key counter}
			{#each value, index (index)}
				<span bind:this={listElements[index]} class:grabbed={listElements[index] === grabElement}>
					<span>
						<PropertyValueInput
							type={property.type}
							name={null!}
							bind:value={value[index]}
							required={false}
							{onError}
							{onErrorFixed}
							{locked}
							deleteProperty={() => {
								value.splice(index, 1);
								counter++;
							}}
							setProperty={() => {
								const object = id ? getObjectFromId(id) : null;
								if (object) generateObjectPreview(object);
								runAction("Save And Recompile Project");
							}}
						/>
						{#if value.length > 1}
							<button
								class="handle"
								onmousedown={event => {
									grabbingIndex = index;
									grabY = listElements[index].getBoundingClientRect().top;
									grabElement = listElements[index];
									updateGrab(event);
								}}
								style:cursor={grabElement === listElements[index] ? "grabbing" : "grab"}
							>
								<HandleIcon stroke="var(--surface-2)" style="width: 1rem; height: 1rem;" />
							</button>
						{/if}
						{#if index === 0}
							<button onclick={() => (listCollapsed = !listCollapsed)}>Collapse</button>
						{/if}
					</span>
				</span>
			{/each}
		{/key}
		<div bind:this={grabline} class="grabline"></div>
	{/if}

	{#if !listCollapsed}
		<span class="list-bottom">
			<button
				onclick={() => {
					value.push((property.type as any).defaultValue);
				}}
			>
				Add Another
			</button>
			{#if !required}
				<button onclick={deleteProperty} style="color: var(--red);">Delete All</button>
			{/if}
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

		button:not(.list-items-header, .handle) {
			width: fit-content;
			margin-left: auto;
			background-color: var(--crust);
			padding-left: 0.5rem;
			padding-right: 0.5rem;
			padding-top: 0.25rem;
			padding-bottom: 0.25rem;
			border-radius: 0.25rem;
		}

		.handle {
			background-color: transparent;
			cursor: grab;
			margin-left: 0.5rem;
			margin-right: 0.5rem;
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
		margin-right: 0.5rem;
	}

	.grabline {
		width: 100%;
		height: 2px;
		background: var(--lavender);
		position: absolute;
		left: 0px;
		opacity: 0%;
	}

	.grabbed {
		position: absolute;
		z-index: 999;
		box-shadow: 0px 0px 1rem black;
		border: 1px solid var(--surface-0);
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
