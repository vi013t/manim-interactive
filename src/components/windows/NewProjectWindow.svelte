<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { open } from "@tauri-apps/plugin-dialog";
	import { onMount } from "svelte";
	import { setProjectLocation } from "../../api/project.svelte";
	import FolderIcon from "../icons/FolderIcon.svelte";
	import Titlebar from "./Titlebar.svelte";

	let visible = $state(false);

	export function close() {
		visible = false;
	}

	export function openWindow() {
		visible = true;
	}

	let path: string = $state("");

	// svelte-ignore non_reactive_update
	let name: string;

	async function confirm() {
		setProjectLocation(await invoke("new_project", { path, name }));
		close();
	}

	let fileInput: HTMLElement;

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

<section style:display={visible ? "block" : "none"}>
	<Titlebar {close} />
	<div class="content">
		<h1>New Project</h1>
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
	</div>
</section>

<style>
	.content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 2rem;

		.confirm {
			background-image: linear-gradient(#181825, #11111b);
			padding-left: 1rem;
			padding-right: 1rem;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
			border-radius: 0.5rem;
			width: fit-content;
			margin-top: 1rem;
		}
	}

	section {
		border-radius: 0.5rem;
		background-color: #1e1e2e;
		position: absolute;
		width: 30rem;
		z-index: 999;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.75);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		input {
			background: #181825;
			border-radius: 0.5rem;
			width: 20rem;
		}

		> div {
			display: flex;
			gap: 0.5rem;
		}

		&,
		* {
			color: #cdd6f4;
		}
	}

	h1 {
		margin-bottom: 1rem;
	}
</style>
