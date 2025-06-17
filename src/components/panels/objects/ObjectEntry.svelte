<script lang="ts">
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getProperty } from "../../../api/manim/property";
	import { runAction } from "../../../api/preferences.svelte";
	import {
		addToSelection,
		areMultipleSelected,
		getObjectFromId,
		isObjectUsed,
		itemHasErrors,
		removeFromSelection,
		select,
		selected,
		type ProjectObject,
	} from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import SkullIcon from "../../icons/SkullIcon.svelte";
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
		if (!areMultipleSelected()) select([entry.id]);
		top = `${event.clientY - 30}px`;
		left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
		objectMenu.show();
	}

	let isSelected = $derived(selected().includes(entry.id));
	let isHovered = $state(false);

	function clickObject(event: MouseEvent) {
		if (event.ctrlKey) {
			if (isSelected) {
				removeFromSelection(entry.id);
			} else {
				addToSelection(entry.id);
			}
		} else {
			select([entry.id]);
		}
	}

	// svelte-ignore non_reactive_update
	let topElement: HTMLElement;

	function getBackgroundColor(): string {
		if (itemHasErrors(entry.id)) return `rgba(243, 139, 168, ${isSelected ? "40%" : isHovered ? "30%" : "20%"})`;
		if (isSelected) return `rgba(180, 150, 255, 20%)`;
		if (isHovered) return `rgba(180, 150, 255, 10%)`;
		return "transparent";
	}

	// svelte-ignore non_reactive_update
	let name: HTMLElement;

	const data = objects.find(object => object.name === getProperty(entry, "Object Type")!)!;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="object">
	<!-- Object name & icon -->

	<!-- svelte-ignore a11y_mouse_events_have_key_events -->
	<div
		onmouseover={() => (isHovered = true)}
		onmouseout={() => (isHovered = false)}
		style:background={getBackgroundColor()}
		class="top"
		bind:this={topElement}
		oncontextmenu={rightClickObject}
		onclick={event => {
			clickObject(event);
			expanded = !expanded;
		}}
	>
		{#if getProperty(entry, "Object Type") === "Group" && entry.properties["Group in Hierarchy"] !== false}
			{#if expanded}
				<RightArrow stroke="var(--blue)" style="width: 1rem; height: 1rem; rotate: 90deg;" />
			{:else}
				<RightArrow stroke="var(--blue)" style="width: 1rem; height: 1rem;" />
			{/if}
		{/if}
		<data.icon
			stroke={getObjectCategory(data.categories[0]).color}
			style="width: 1rem; height: 1rem; margin-left: {getProperty(entry, 'Object Type') === 'Group' && entry.properties['Group in Hierarchy'] !== false
				? 0.2
				: 1.2}rem; margin-right: 0.25rem;"
		/>
		<span
			style:color={isObjectUsed(entry) ? "var(--text)" : "var(--overlay-0)"}
			onkeydown={typeName}
			onblur={setName}
			bind:this={name}
			contenteditable
			autocapitalize="off"
			spellcheck="false"
		>
			{getProperty(entry, "Name")}
		</span>
		{#if itemHasErrors(entry.id)}
			<div class="status">
				<ErrorIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-left: 0.5rem;" />
			</div>
		{/if}
		{#if !isObjectUsed(entry)}
			<div class="status" title="This object is unused">
				<SkullIcon stroke="var(--overlay-0)" style="width: 1rem; height: 1rem; margin-left: 0.5rem;" />
			</div>
		{/if}
	</div>

	<!-- Group Contents -->
	{#if getProperty(entry, "Object Type") === "Group" && expanded && getProperty(entry, "Objects")!.length > 0 && entry.properties["Group in Hierarchy"] !== false}
		{@const contents = entry.properties["Objects"]!.map(id => getObjectFromId(id as number)!).toSorted((obj1, obj2) => {
			if (!isObjectUsed(obj1)) {
				if (!isObjectUsed(obj2)) {
					return obj1.properties["Name"].localeCompare(obj2.properties["Name"]);
				}

				return 1;
			}

			if (!isObjectUsed(obj2)) {
				return -1;
			}

			return obj1.properties["Name"].localeCompare(obj2.properties["Name"]);
		})}
		<div class="bottom">
			{#each contents.filter(object => getProperty(object, "Object Type") === "Group") as item (item.id)}
				<ObjectEntry entry={item} />
			{/each}
			{#each contents.filter(object => getProperty(object, "Object Type") !== "Group") as item (item.id)}
				<ObjectEntry entry={item} />
			{/each}
		</div>
		<div class="group-line"></div>
	{/if}
</div>
<GroupMenu bind:this={groupMenu} {top} {left} id={entry.id} />
<ObjectMenu bind:this={objectMenu} {top} {left} ids={selected()} />

<style>
	.object {
		width: 100%;
		font-size: 0.85rem;
		cursor: pointer;
		position: relative;
	}

	.group-line {
		content: "";
		position: absolute;
		width: 1.25rem;
		height: calc(100% - 2.8rem);
		top: 2rem;
		left: 0.62rem;
		border-left: 2px solid var(--surface-0);
		border-bottom: 2px solid var(--surface-0);
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

	.status {
		margin-left: auto;
	}
</style>
