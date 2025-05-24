<script lang="ts">
	import {
		addAnimation,
		addObjectEntry,
		nextId,
	} from "../../api/codegen.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import BorderIcon from "../icons/BorderIcon.svelte";
	import FadeIcon from "../icons/FadeIcon.svelte";
	import PencilIcon from "../icons/PencilIcon.svelte";
	import PlainTextIcon from "../icons/PlainTextIcon.svelte";
	import PlantIcon from "../icons/PlantIcon.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import SparkleIcon from "../icons/SparkleIcon.svelte";

	let {
		top,
		left,
		hideParent,
	}: { top: string; left: string; hideParent: () => void } = $props();

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

	function hideSubmenus() {}

	function addGroup() {
		menu.toggle();
		addObjectEntry({
			name: "New Group",
			objects: [],
			groups: [],
			id: nextId(),
		});
	}

	function addAnimationEntry(name: string) {
		return function () {
			menu.toggle();
			hideParent();
			addAnimation({
				name: name,
				objects: [],
				id: nextId(),
				properties: {},
			});
		};
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add Create Animation</span>
	<button onclick={addAnimationEntry("Appear")}>
		<SparkleIcon
			stroke="#a6e3a1"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Appear
	</button>
	<button onclick={addAnimationEntry("Create")}>
		<PlusIcon
			stroke="#a6e3a1"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Create
	</button>
	<button
		onclick={addGroup}
		onmouseenter={() => {
			hideSubmenus();
		}}
	>
		<BorderIcon
			stroke="#a6e3a1"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Draw Border Then Fill
	</button>
	<button
		onclick={addGroup}
		onmouseenter={() => {
			hideSubmenus();
		}}
	>
		<FadeIcon
			stroke="#a6e3a1"
			style="width: 1rem; height: 1rem; margin-right: 0.5em; rotate: 180deg;"
		/>
		Fade In
	</button>
	<button
		onclick={addGroup}
		onmouseenter={() => {
			hideSubmenus();
		}}
	>
		<PlantIcon
			stroke="#a6e3a1"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Grow In
	</button>
	<button
		onclick={addGroup}
		onmouseenter={() => {
			hideSubmenus();
		}}
	>
		<PlainTextIcon
			stroke="#a6e3a1"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Type
	</button>
	<button
		onclick={addGroup}
		onmouseenter={() => {
			hideSubmenus();
		}}
	>
		<PencilIcon
			stroke="#a6e3a1"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Write
	</button>
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
