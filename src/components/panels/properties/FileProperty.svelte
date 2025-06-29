<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { open, type OpenDialogOptions } from "@tauri-apps/plugin-dialog";
	import { type FileProperty } from "../../../api/manim/property";
	let { locked, value = $bindable(), width, property }: { locked: boolean; value: string | null; width: string; property: FileProperty } = $props();

	async function chooseFile() {
		if (locked) return;

		let options: OpenDialogOptions = {
			directory: false,
			multiple: false,
		};

		if (property.extensions) {
			options.filters = [{ name: "*", extensions: property.extensions }];
		}

		let chosen = await open(options);

		if (chosen) {
			value = await invoke<string>("load_file_base64_data", { path: chosen });
		}
	}
</script>

<button style:width onclick={chooseFile} class="file-button">[File Data]</button>

<style>
	.file-button {
		color: var(--text);
		background-color: var(--crust);
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		padding: 0.2rem;
	}
</style>
