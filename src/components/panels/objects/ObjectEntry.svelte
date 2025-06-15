<script lang="ts">
	import { onMount } from "svelte";
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getProperty } from "../../../api/manim/properties";
	import { runAction } from "../../../api/preferences.svelte";
	import { getItemFromId, itemHasErrors, select, selected, type ProjectObject } from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import GroupMenu from "../../menus/GroupMenu.svelte";
	import ObjectMenu from "../../menus/ObjectMenu.svelte";
	import ObjectEntry from "./ObjectEntry.svelte";

	let { entry }: { entry: ProjectObject } = $props();

	let expanded = $state(false);

	function typeName(event: KeyboardEvent) {
		if (event.key === "Enter") (event.target as HTMLElement).blur();
	}

	function setName() {
		entry.properties["Name"] = name.textContent!;
		runAction("Save Project");
	}

	let groupMenu: GroupMenu;
	let objectMenu: ObjectMenu;
	let top = $state("0px");
	let left = $state("0px");

	function rightClickGroup(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		groupMenu.show();
	}

	function rightClickObject(event: MouseEvent) {
		event.preventDefault();
		select(entry);
		top = `${event.clientY - 30}px`;
		left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
		objectMenu.show();
	}

	let isSelected = $derived(selected() === entry.id);
	let isHovered = $state(false);

	function clickObject(event: MouseEvent) {
		select(entry);
	}

	// svelte-ignore non_reactive_update
	let topElement: HTMLElement;

	onMount(() => {
		document.getElementById("object-panel")!.addEventListener("click", event => {
			if (!event.composedPath().includes(topElement) && selected() === entry.id) {
				//select(null);
			}
		});
	});

	function getBackgroundColor(): string {
		if (itemHasErrors(entry.id)) return `rgba(243, 139, 168, ${isSelected ? "40%" : isHovered ? "30%" : "20%"})`;
		if (isSelected) return `rgba(180, 150, 255, 20%)`;
		if (isHovered) return `rgba(180, 150, 255, 10%)`;
		return "transparent";
	}

	// svelte-ignore non_reactive_update
	let name: HTMLElement;

	const data = objects.find(object => object.name === getProperty(entry, "Object Type"))!;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="object" onclick={clickObject}>
	<!-- Object name & icon -->
	<!-- svelte-ignore a11y_mouse_events_have_key_events -->
	<div
		onmouseover={() => (isHovered = true)}
		onmouseout={() => (isHovered = false)}
		onclick={() => (expanded = !expanded)}
		style:background={getBackgroundColor()}
		class="top"
		bind:this={topElement}
		oncontextmenu={rightClickObject}
	>
		{#if getProperty(entry, "Object Type") === "Group"}
			{#if expanded}
				<RightArrow stroke="var(--blue)" style="width: 1rem; height: 1rem; rotate: 90deg;" />
			{:else}
				<RightArrow stroke="var(--blue)" style="width: 1rem; height: 1rem;" />
			{/if}
		{/if}
		<data.icon
			stroke={getObjectCategory(data.categories[0]).color}
			style="width: 1rem; height: 1rem; margin-left: {getProperty(entry, 'Object Type') === 'Group' ? 0.2 : 1.2}rem; margin-right: 0.25rem;"
		/>
		<span onkeydown={typeName} onblur={setName} bind:this={name} contenteditable autocapitalize="off" spellcheck="false">
			{getProperty(entry, "Name")}
		</span>
		{#if itemHasErrors(entry.id)}
			<ErrorIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-left: 0.5rem;" />
		{/if}
	</div>

	<!-- Group Contents -->
	{#if getProperty(entry, "Object Type") === "Group" && expanded}
		{@const contents = (entry.properties["Items"] as number[]).map(id => getItemFromId(id) as ProjectObject)}
		<div class="bottom">
			{#each contents.filter(object => getProperty(object, "Object Type") === "Group") as item (item.id)}
				<ObjectEntry entry={item} />
			{/each}
			{#each contents.filter(object => getProperty(object, "Object Type") !== "Group") as item (item.id)}
				<ObjectEntry entry={item} />
			{/each}
		</div>
	{/if}
</div>
<GroupMenu bind:this={groupMenu} {top} {left} id={entry.id} />
<ObjectMenu bind:this={objectMenu} {top} {left} id={entry.id} />

<style>
	.object {
		width: 100%;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.top {
		display: flex;
		align-items: center;
		border-radius: 0.3rem;
		padding: 0.2rem;
		width: 100%;

		&:hover {
			background: rgba(180, 150, 255, 8%);
		}

		span {
			color: inherit;
			width: fit-content;
			cursor: text;
			padding-left: 0.5em;
			padding-right: 0.5em;
			border-radius: 0.25em;

			&:focus {
				background-color: var(--crust);
			}
		}
	}

	.bottom {
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
	}
</style>
