<script lang="ts">
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { select } from "../../../api/project.svelte";
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
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		objectMenu.show();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="object" onclick={() => select(entry)}>
	<!-- Group -->
	{#if entry.objects}
		<!-- Group name & Icon -->
		<button class="top" onclick={() => (expanded = !expanded)} oncontextmenu={rightClickGroup}>
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
		<div class="top" oncontextmenu={rightClickObject}>
			<data.icon stroke={getObjectCategory(data.category).color} style="width: 1rem; height: 1rem; margin-left: 1.2rem; margin-right: 0.5rem;" />
			<span onkeydown={typeName} contenteditable autocapitalize="off" spellcheck="false">
				{entry.name}
			</span>
		</div>
	{/if}

	<GroupMenu bind:this={groupMenu} {top} {left} id={entry.id} />
	<ObjectMenu bind:this={objectMenu} {top} {left} id={entry.id} />
</div>

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
			background: rgba(255, 255, 255, 8%);
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
