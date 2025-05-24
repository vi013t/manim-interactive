<script lang="ts">
	import { addObjectEntry, nextId } from "../../api/codegen.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import BlinkIcon from "../icons/BlinkIcon.svelte";
	import CircledLightningIcon from "../icons/CircledLightningIcon.svelte";
	import IncompleteCircle from "../icons/IncompleteCircle.svelte";
	import LightningIcon from "../icons/LightningIcon.svelte";
	import MegaphoneIcon from "../icons/MegaphoneIcon.svelte";
	import ReticleIcon from "../icons/ReticleIcon.svelte";
	import WaveIcon from "../icons/WaveIcon.svelte";
	import WiggleIcon from "../icons/WiggleIcon.svelte";

	let { top, left }: { top: string; left: string } = $props();

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

	function addGroup() {
		menu.toggle();
		addObjectEntry({
			name: "New Group",
			objects: [],
			groups: [],
			id: nextId(),
		});
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add Highlight Animation</span>
	<button onclick={addGroup}>
		<BlinkIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Blink
	</button>
	<button onclick={addGroup}>
		<IncompleteCircle
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Circumscribe
	</button>
	<button onclick={addGroup}>
		<LightningIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Flash
	</button>
	<button onclick={addGroup}>
		<ReticleIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Focus
	</button>
	<button onclick={addGroup}>
		<MegaphoneIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Indicate
	</button>
	<button onclick={addGroup}>
		<CircledLightningIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Passing Flash
	</button>
	<button onclick={addGroup}>
		<WaveIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Wave
	</button>
	<button onclick={addGroup}>
		<WiggleIcon
			stroke="#f9e2af"
			style="width: 1rem; height: 1rem; margin-right: 0.5em;"
		/>
		Wiggle
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
