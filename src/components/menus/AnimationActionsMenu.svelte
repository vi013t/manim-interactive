<script lang="ts">
	import TrashIcon from "../icons/TrashIcon.svelte";
	import ContextMenu from "./ContextMenu.svelte";

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
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Animation Actions</span>
	<button>
		<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Delete Animation
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
