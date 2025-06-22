<script lang="ts">
	import { translate } from "../../api/translate.svelte";
	import CircleIcon from "../icons/CircleIcon.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import TransformIcon from "../icons/TransformIcon.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import VariableIcon from "../icons/VariableIcon.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left } = $props();

	export function hide() {
		menu.hide();
	}

	export function show() {
		menu.show();
	}

	let menu: ContextMenu;
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add Event</span>

	<button>
		<VariableIcon stroke="var(--lavender)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Set Variable Value")}
	</button>
	<button>
		<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Hide Object")}
	</button>
	<button>
		<PlusIcon stroke="var(--green)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Show Object")}
	</button>
	<button>
		<TransformIcon stroke="var(--blue)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Tranform Object")}
	</button>
	<button>
		<CircleIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Empty Event")}
	</button>
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
