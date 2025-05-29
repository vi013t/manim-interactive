<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { open } from "@tauri-apps/plugin-dialog";
	import { onMount } from "svelte";
	import { runAction } from "../../api/preferences.svelte";
	import ErrorIcon from "../icons/ErrorIcon.svelte";
	import FolderIcon from "../icons/FolderIcon.svelte";
	import Window from "./Window.svelte";

	let fileInput: HTMLElement;
	let windowComponent: Window;

	let path: string = $state("");
	let name: string = $state("");
	let nameErrorMessage: string | null = $state(null);
	let pathErrorMessage: string | null = $state(null);
	let valid = $derived(nameErrorMessage === null && pathErrorMessage === null);

	async function confirm() {
		runAction("New Project", { path, name });
		name = "";
		windowComponent.close();
	}

	export function openWindow() {
		windowComponent.openWindow();
	}

	async function generatePathErrorMessage(): Promise<string | null> {
		if (path === "") return "Path cannot be empty";
		if (!(await invoke<boolean>("path_exists", { path }))) return "Path does not exist";
		return null;
	}

	async function generateNameErrorMessage(): Promise<string | null> {
		if (name === "") return "Name cannot be empty";
		if (/[<>:"\/\\\|\?\*]/.test(name)) return "Name contains invalid character";
		if ((await generatePathErrorMessage()) !== null) return null;
		if (!(await invoke<boolean>("is_new_project_valid", { path, name }))) return "Path already exists";
		return null;
	}

	onMount(() => {
		fileInput.addEventListener("click", async _event => {
			const selected = await open({
				directory: true,
				multiple: false,
				title: "Select a directory",
			});

			// Directory Chosen
			if (typeof selected === "string") {
				path = selected;
				pathErrorMessage = null;
			}

			// No directory chosen
			else {
				console.log("No directory selected");
			}
		});
	});
</script>

<Window title="New Project" bind:this={windowComponent}>
	<div class="content">
		<div class="section">
			<span>
				<span class="name">Name:</span>
				<input
					oninput={() => (nameErrorMessage = null)}
					onblur={async () => (nameErrorMessage = await generateNameErrorMessage())}
					style:outline-color={nameErrorMessage ? "#f38ba8" : "transparent"}
					type="text"
					bind:value={name}
				/>
			</span>
			{#if nameErrorMessage}
				<span class="error">
					<ErrorIcon stroke="#f38ba8" style="width: 1rem; height: 1rem" />
					{nameErrorMessage}
				</span>
			{/if}
		</div>
		<div class="section">
			<span>
				<span class="name">Location:</span>
				<input
					oninput={() => (pathErrorMessage = null)}
					onblur={async () => (pathErrorMessage = await generatePathErrorMessage())}
					style:outline-color={pathErrorMessage ? "#f38ba8" : "transparent"}
					type="text"
					bind:value={path}
				/>
				<button bind:this={fileInput}><FolderIcon stroke="#a6adc8" style="width: 2rem; height: 2rem;" /></button>
			</span>
			{#if pathErrorMessage}
				<span class="error">
					<ErrorIcon stroke="#f38ba8" style="width: 1rem; height: 1rem" />
					{pathErrorMessage}
				</span>
			{/if}
		</div>

		<div class="bottom">
			<button
				class="confirm"
				class:enabled={valid}
				onclick={async () => {
					nameErrorMessage = await generateNameErrorMessage();
					pathErrorMessage = await generatePathErrorMessage();
					if (valid) confirm();
				}}
			>
				Create
			</button>
		</div>
	</div>
</Window>

<style>
	.content {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.name {
		width: 5rem;
	}

	.bottom {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	input {
		background: #181825;
		border-radius: 0.5rem;
		width: 18rem;
		padding: 0.5rem;
		outline-width: 3px;
		outline-offset: -3px;
		outline-style: solid;
	}

	span {
		gap: 0.5rem;
	}

	input,
	span {
		color: #cdd6f4;
	}

	.confirm {
		padding-left: 2em;
		padding-right: 2rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		border-radius: 0.5rem;
		width: fit-content;
		margin-top: 1rem;

		&.enabled {
			background-image: linear-gradient(#b4befe, #89b4fa);
			color: black;
			box-shadow: 0px 0px 1rem black;
		}

		&:not(.enabled) {
			background-image: linear-gradient(#181825, #11111b);
			color: #6c7086;
			cursor: not-allowed;
		}
	}

	.section {
		display: flex;
		flex-direction: column;
	}

	.error {
		color: #f38ba8;
		font-size: 0.85rem;
		display: flex;
		align-items: center;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		margin-left: 6rem;
	}
</style>
