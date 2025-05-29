<script lang="ts">
	import { getHorizontalExpandDirection } from "../../api/client.svelte";
	import { getObjectCategory, objects, type ManimObject, type ObjectCategory } from "../../api/manim/objects";
	import type { Property } from "../../api/manim/property";
	import { getPreferences, runAction } from "../../api/preferences.svelte";
	import { addProjectObject, isNameTaken, nextId, select } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import CodeIcon from "../icons/CodeIcon.svelte";

	function addObject(type: string): void {
		let manimObject = objects.find(object => object.name === type)!;
		let properties: { [key: string]: unknown } = {};
		manimObject.properties.filter((property: Property) => property.required).forEach(property => (properties[property.name] = null));
		menu.toggle();

		let name = type;
		let number = 2;
		while (isNameTaken(name)) {
			name = `${type} ${number++}`;
		}

		let object = {
			name,
			objectType: type,
			id: nextId(),
			properties,
		};
		addProjectObject(object);
		select(object);
		hideOuter();
		runAction("Save Project");
	}

	let {
		top,
		left,
		hideOuter,
		category,
		onSelect = addObject,
	}: { top: string; left: string; hideOuter: () => void; category: ObjectCategory; onSelect?: (type: string) => void } = $props();

	let menu: ContextMenu;

	export function show() {
		menu.show();
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
		currentObject = null;
	}

	const categoryData = getObjectCategory(category);
	const useObjects = objects.filter(object => object.category === category);

	let currentObject: ManimObject | null = $state(null);
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add {category}</span>
	{#each useObjects as object}
		<button onclick={() => onSelect(object.name)} onmouseover={() => (currentObject = object)}>
			<object.icon stroke={categoryData.color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{object.name}
		</button>
	{/each}
	{#if category === "Miscellaneous" && getPreferences().developerMode}
		<button>
			<CodeIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			Scripted Object
		</button>
	{/if}
</ContextMenu>

{#if currentObject}
	<div class="info" style:top style:left={getHorizontalExpandDirection() === "left" ? "-35rem" : "30rem"}>
		<h1>{currentObject.name}</h1>
		<p>{currentObject.description}</p>
		<img src={currentObject.demo} alt="{currentObject.name} demo" />
	</div>
{/if}

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	.info {
		position: absolute;
		left: -35rem;
		background-color: #1e1e2e;
		width: fit-content;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-radius: 0.5rem;
		padding: 0px;

		&:hover {
			background-color: #1e1e2e;
		}

		h1 {
			background-color: #181825;
			padding-left: 1rem;
			padding-right: 1rem;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
			border-top-left-radius: 0.5rem;
			border-top-right-radius: 0.5rem;
		}

		p {
			color: #9399b2;
			margin-top: -0.5rem;
			font-size: 0.85rem;
			padding-left: 1rem;
			padding-right: 1rem;
		}

		img {
			width: 16rem;
			height: 9rem;
			margin-left: 1rem;
			margin-right: 1rem;
			margin-bottom: 1rem;
		}
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;
	}
</style>
