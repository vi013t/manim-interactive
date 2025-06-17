<script lang="ts">
	import { deleteProjectItem } from "../../api/project.svelte";
	import Window from "./Window.svelte";

	let { id } = $props();

	let deleteWindow: Window;

	export function show() {
		deleteWindow.openWindow();
	}

	function deleteObject() {
		deleteProjectItem(id);
		deleteWindow.close();
	}
</script>

<Window bind:this={deleteWindow} title="Delete Group?">
	<p>This group contains objects. Deleting this group will also delete the objects inside of it. Continue to delete group?</p>
	<p>Note: Setting the group's "Group in Heirarchy" property to "No" will cause its contents to be kept if the group is deleted.</p>
	<span>
		<button onclick={() => deleteWindow.close()}>Cancel</button>
		<button onclick={deleteObject}>Delete</button>
	</span>
</Window>

<style>
	p,
	button {
		color: var(--text);
	}

	p {
		margin-left: 2rem;
		margin-right: 2rem;
	}

	p:first-child {
		margin-top: 2rem;
	}

	span:last-child {
		width: 100%;
		justify-content: center;
		margin-top: 1rem;
		margin-bottom: 2rem;
		gap: 2rem;
	}

	button {
		background-color: var(--crust);
		padding-left: 2rem;
		padding-right: 2rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;

		&:last-child {
			background-color: var(--red);
			color: var(--crust);
		}
	}
</style>
