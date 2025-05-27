<script lang="ts">
	import { onMount } from "svelte";
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { select, selected } from "../../../api/project.svelte";
	import PackageIcon from "../../icons/PackageIcon.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import GroupMenu from "../../menus/GroupMenu.svelte";
	import ObjectMenu from "../../menus/ObjectMenu.svelte";
	import ObjectEntry from "./ObjectEntry.svelte";

	let { entry } = $props();

	let expanded = $state(false);

	function typeName(event: KeyboardEvent) {
		if (event.key === "Enter") (event.target as HTMLElement).blur();
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

	let isSelected = $derived(selected()?.id === entry.id);
	let isHovered = $state(false);

	function clickObject(event: MouseEvent) {
		select(entry);
	}

	// svelte-ignore non_reactive_update
	let topElement: HTMLElement;

	onMount(() => {
		document.getElementById("object-panel")!.addEventListener("click", event => {
			if (!event.composedPath().includes(topElement) && selected() === entry) {
				select(null);
			}
		});
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="object" onclick={clickObject}>
	<!-- Group -->
	{#if entry.objects}
		<!-- Group name & Icon -->
		<button bind:this={topElement} class="top" onclick={() => (expanded = !expanded)} oncontextmenu={rightClickGroup}>
			{#if expanded}
				<RightArrow stroke="#89b4fa" style="width: 1rem; height: 1rem; rotate: 90deg; margin-right: 0.2rem;" />
			{:else}
				<RightArrow stroke="#89b4fa" style="width: 1rem; height: 1rem; margin-right: 0.2rem;" />
			{/if}
			<PackageIcon stroke="#89b4fa" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{entry.name}
		</button>

		<!-- Group Contents -->
		{#if expanded}
			<div class="bottom">
				{#each entry.groups as item}
					<ObjectEntry entry={item} />
				{/each}
				{#each entry.objects as item}
					<ObjectEntry entry={item} />
				{/each}
			</div>
		{/if}

		<!-- Object -->
	{:else}
		{@const data = objects.find(object => object.name === entry.objectType)!}

		<!-- Object name & icon -->
		<!-- svelte-ignore a11y_mouse_events_have_key_events -->
		<div
			onmouseover={() => (isHovered = true)}
			onmouseout={() => (isHovered = false)}
			style:background={isSelected ? `rgba(180, 150, 255, 20%)` : isHovered ? `rgba(180, 150, 255, 10%)` : "transparent"}
			class="top"
			bind:this={topElement}
			oncontextmenu={rightClickObject}
		>
			<data.icon stroke={getObjectCategory(data.category).color} style="width: 1rem; height: 1rem; margin-left: 1.2rem; margin-right: 0.5rem;" />
			<span onkeydown={typeName} contenteditable autocapitalize="off" spellcheck="false">
				{entry.name}
			</span>
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
		color: #cdd4f6;
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
				background-color: #11111b;
			}
		}
	}

	.bottom {
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
	}
</style>
