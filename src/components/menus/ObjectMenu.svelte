<script lang="ts">
	import { objects, type ObjectProperties } from "../../api/manim/objects";
	import { getAnimationObjects, getProperty } from "../../api/manim/property";
	import { getPreferences, runAction } from "../../api/preferences.svelte";
	import { addProjectObject, deleteProjectItem, getObjectFromId, getProjectAnimations, isNameTaken, nextId, select } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import AnimationIcon from "../icons/AnimationIcon.svelte";
	import CubeIcon from "../icons/CubeIcon.svelte";
	import PropertiesIcon from "../icons/PropertiesIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import TypeIcon from "../icons/TypeIcon.svelte";
	import ConfirmDeleteGroupWindow from "../windows/ConfirmDeleteGroupWindow.svelte";
	import ConfirmDeleteObjectWindow from "../windows/ConfirmDeleteObjectWindow.svelte";
	import AddAnimationMenu from "./AddAnimationMenu.svelte";
	import AddObjectMenu from "./AddObjectMenu.svelte";
	import AddPropertyMenu from "./AddPropertyMenu.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left, ids }: { top: string; left: string; ids: number[] } = $props();

	let menu: ContextMenu;
	let addAnimationMenu: AddAnimationMenu = $state(null!);
	let addPropertyMenu: AddPropertyMenu = $state(null!);
	let addObjectMenu: AddPropertyMenu;

	export function show() {
		menu.show();
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
	}

	function hideSubmenus() {
		addObjectMenu.hide();
		addAnimationMenu.hide();
		addPropertyMenu.hide();
	}

	function deleteObject() {
		menu.hide();
		if (isGroup && getProperty(getObjectFromId(ids[0])!, "Objects")!.length > 0) {
			confirmDeleteGroupWindow.show();
		} else if (getProjectAnimations().some(animation => ids.some(id => getAnimationObjects(animation).includes(id)))) {
			confirmDeleteObjectWindow.show();
		} else {
			ids.forEach(id => deleteProjectItem(id));
		}
	}

	let confirmDeleteObjectWindow: ConfirmDeleteObjectWindow;
	let confirmDeleteGroupWindow: ConfirmDeleteGroupWindow;

	let isGroup = $derived.by(() => {
		if (ids.length !== 1) return false;
		let object = getObjectFromId(ids[0]);
		if (!object) return false;
		return object.properties["Object Type"] === "Group";
	});

	function addObjectToGroup(type: string): void {
		let manimObject = objects.find(object => object.name === type)!;

		let name = translate(type);
		let number = 2;
		while (isNameTaken(name)) {
			name = `${type} ${number++}`;
		}

		let properties: ObjectProperties = {
			"Object Type": type as any,
			Name: name as any,
		};

		manimObject.properties
			.filter(property => "required" in property && property.required)
			.forEach(property => {
				properties[property.name] = (property.type as any).defaultValue ?? null;
			});
		menu.hide();

		const object = {
			type: "object",
			id: nextId(),
			properties,
		} as const;

		addProjectObject(object);
		if (isGroup) {
			getObjectFromId(ids[0])!.properties["Objects"]!.push(object.id);
		}
		select([object.id]);

		if (getPreferences().autosave) runAction("Save Project");
	}
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<ContextMenu bind:this={menu} {top} {left}>
	<span>Object Actions</span>

	{#if ids.length === 1}
		<button onclick={deleteObject} onmouseover={hideSubmenus}>
			<TypeIcon stroke="var(--blue)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{translate("Rename Object")}
		</button>
	{/if}

	{#if isGroup}
		<button
			onmouseover={() => {
				hideSubmenus();
				addObjectMenu.show();
			}}
		>
			<CubeIcon stroke="var(--peach)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{translate("Add Object")}
			<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
		</button>
	{/if}

	{#if ids.length === 1}
		<button
			onmouseover={() => {
				hideSubmenus();
				addAnimationMenu.show();
			}}
		>
			<AnimationIcon stroke="#94e2d5" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{translate("Add Animation")}
			<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
		</button>
		<button
			onmouseover={() => {
				hideSubmenus();
				addPropertyMenu.show();
			}}
		>
			<PropertiesIcon stroke="#f9e2af" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{translate("Add Property")}
			<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
		</button>
	{/if}

	<button onclick={deleteObject} onmouseover={hideSubmenus}>
		<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Delete Object")}
	</button>

	<AddObjectMenu onSelect={addObjectToGroup} bind:this={addObjectMenu} top="3.5rem" left="100%" />

	{#if ids.length === 1}
		<AddAnimationMenu hideParent={hide} bind:this={addAnimationMenu} top="{isGroup ? 5.25 : 3.5}rem" left="100%" id={ids[0]} />
		<AddPropertyMenu bind:this={addPropertyMenu} top="{isGroup ? 7 : 5.25}rem" left="100%" />
	{/if}
</ContextMenu>

<ConfirmDeleteObjectWindow bind:this={confirmDeleteObjectWindow} {ids} />
<ConfirmDeleteGroupWindow bind:this={confirmDeleteGroupWindow} {ids} />

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
