<script lang="ts">
	import { runAction } from "../../api/actions.svelte";
	import { getObjectCategory, objects, type ObjectCategory } from "../../api/manim/objects";
	import { addProjectObject, nextId, select } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";

	let { top, left, hideOuter, category }: { top: string; left: string; hideOuter: () => void; category: ObjectCategory } = $props();

	let menu: ContextMenu;

	export function show() {
		menu.show();
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
	}

	function addObject(name: string, type: string) {
		return function () {
			menu.toggle();
			let object = {
				name: name,
				objectType: type,
				properties: {},
				id: nextId(),
			};
			addProjectObject(object);
			select(object);
			hideOuter();
			runAction("Save Project");
		};
	}

	const categoryData = getObjectCategory(category);
	const useObjects = objects.filter(object => object.category === category);
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add {category}</span>
	{#each useObjects as object}
		<button onclick={addObject(object.name, object.name)}>
			<object.icon stroke={categoryData.color} style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
			{object.name}
		</button>
	{/each}
</ContextMenu>

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;
	}
</style>
