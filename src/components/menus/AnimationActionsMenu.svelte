<script lang="ts">
	import ContextMenu from "../ContextMenu.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";

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
		<TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
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
		border-bottom: 1px solid #313244;
	}
</style>
