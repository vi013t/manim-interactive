<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { open } from "@tauri-apps/plugin-dialog";
	import { onMount } from "svelte";
	import { setProjectLocation } from "../../api/project.svelte";
	import FolderIcon from "../icons/FolderIcon.svelte";
	import Window from "./Window.svelte";

	let fileInput: HTMLElement;
	let windowComponent: Window;

	let path: string = $state("");

	// svelte-ignore non_reactive_update
	let name: string;

	async function confirm() {
		setProjectLocation(await invoke("new_project", { path, name }));
		close();
	}

	export function openWindow() {
		windowComponent.openWindow();
	}

	onMount(() => {
		fileInput.addEventListener("click", async event => {
			const selected = await open({
				directory: true,
				multiple: false,
				title: "Select a directory",
			});

			// Directory Chosen
			if (typeof selected === "string") {
				path = selected;
			}

			// No directory chosen
			else {
				console.log("No directory selected");
			}
		});
	});
</script>

<Window title="New Project" bind:this={windowComponent}>
	<div>
		<span>Name</span>
		<input type="text" bind:value={name} />
	</div>
	<div>
		<span>Location</span>
		<input type="text" bind:value={path} />
		<button bind:this={fileInput}><FolderIcon stroke="red" style="width: 1rem; height: 1rem;" /></button>
	</div>
	<button class="confirm" onclick={confirm}>Create</button>
</Window>

<style>
	h1 {
		margin-bottom: 1rem;
		color: #cdd6f4;
	}

	input {
		background: #181825;
		border-radius: 0.5rem;
		width: 20rem;
		color: #cdd6f4;
	}

	.confirm {
		background-image: linear-gradient(#181825, #11111b);
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		border-radius: 0.5rem;
		width: fit-content;
		margin-top: 1rem;
		color: #cdd6f4;
	}
</style>
