<script lang="ts">
	import { events, type ManimEvent } from "../../api/manim/events";
	import { addProjectEvent, getSingleSelection, isNameTaken, lastAnimationEndTime, nextId, type ProjectEvent } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left, objectEventsOnly = false } = $props();

	export function hide() {
		menu.hide();
	}

	export function show() {
		menu.show();
	}

	let menu: ContextMenu;

	function addEvent(event: ManimEvent) {
		return function () {
			hide();

			let name = translate(event.name);

			let number = 2;
			while (isNameTaken(name)) {
				name = `${translate(event.name)} ${number++}`;
			}

			const projectEvent: ProjectEvent = {
				id: nextId(),
				type: "event",
				properties: {
					Name: name,
					"Event Type": event.name,
					Time: Math.max(lastAnimationEndTime(), 1),
				},
			};

			if (getSingleSelection()) {
				projectEvent.properties.Object = getSingleSelection()!;
			}

			addProjectEvent(projectEvent);
		};
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>{translate("Add Event")}</span>
	{#each events as event}
		{#if !objectEventsOnly || event.properties.find(property => property.name === "Object")}
			<button onclick={addEvent(event)}>
				<event.icon stroke={event.color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
				{event.name}
			</button>
		{/if}
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
