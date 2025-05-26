<script lang="ts">
	import { onMount } from "svelte";
	import { deleteKeybinding, displayKey, getActions, getKeybindings, key, updateKeybinding, type Key, type KeyModifier } from "../../api/actions.svelte";
	import { setDeveloperMode } from "../../api/preferences.svelte";
	import FilledCircleIcon from "../icons/FilledCircleIcon.svelte";
	import FilledSquareIcon from "../icons/FilledSquareIcon.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import RevertIcon from "../icons/RevertIcon.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import Window from "./Window.svelte";

	let windowComponent: Window;

	export function openWindow() {
		windowComponent.openWindow();
	}

	let view = $state("appearance");

	// svelte-ignore non_reactive_update
	let developerMode: HTMLInputElement;

	let recordingIndex: number | null = $state(null);

	function record(index: number) {
		if (recordingIndex === index) recordingIndex = null;
		else if (recordingIndex === null) recordingIndex = index;
	}

	let modifiers: KeyModifier[] = $state([]);
	let chosenKey: string = $state("");
	let binding: Key = $derived(key(chosenKey, ...modifiers));

	onMount(() => {
		document.addEventListener("keydown", event => {
			if (recordingIndex !== null) {
				if (event.ctrlKey && !modifiers.includes("ctrl")) modifiers.push("ctrl");
				if (event.shiftKey && !modifiers.includes("shift")) modifiers.push("shift");
				if (event.altKey && !modifiers.includes("alt")) modifiers.push("alt");
				if (!["Control", "Shift", "Alt"].includes(event.key)) {
					chosenKey = event.key;
					let chosen = key(event.key, ...modifiers);
					updateKeybinding(recordingIndex, chosen);
					recordingIndex = null;
					chosenKey = "";
					modifiers = [];
				}
			}
		});
	});
</script>

<Window bind:this={windowComponent} title="Preferences" style="width: 50rem; height: 40rem; padding-bottom: 0px;">
	<div class="container">
		<div class="sidebar">
			<button onclick={() => (view = "appearance")}>Appearance</button>
			<button onclick={() => (view = "timeline")}>Timeline</button>
			<button onclick={() => (view = "keybinds")}>Keybindings</button>
			<button onclick={() => (view = "developer")}>Developer Settings</button>
		</div>
		<div class="content">
			{#if view === "appearance"}
				<h1>Appearance</h1>
				<label for="preview-videos">
					<span>
						Object &amp; Animation Previews
						<input id="preview-videos" type="checkbox" />
					</span>
					<p>Whether to show previews when adding new objects or animations</p>
				</label>
			{:else if view === "timeline"}
				<h1>Timeline Settings</h1>
				<label for="collapse-wait-times">
					<span>
						Automatically Collapse Wait Times
						<input id="collapse-wait-times" type="checkbox" />
					</span>
					<p>Automatically collapse blank space on the timeline. The space will open up when dragging an animation.</p>
				</label>
				<label for="relative-timestamps">
					<span>
						Relative Timestamps
						<input id="relative-timestamps" type="checkbox" />
					</span>
					<p>Show timestamps relative to the last animation instead of relative to the start of the video.</p>
				</label>
			{:else if view === "keybinds"}
				<span>
					<h1>Keybindings</h1>
					<button class="add-keybinding"><PlusIcon stroke="#cdd6f4" style="width: 1rem; height: 1rem;" /></button>
				</span>
				{#each getKeybindings() as keybinding, index}
					<span class="keybinding-entry">
						<span>
							Action: <select>
								{#each getActions() as action}
									<option selected={action.name === keybinding.action.name}>{action.name}</option>
								{/each}
							</select>
						</span>
						<span class="binding">
							Keybind: <button class="key">{displayKey(recordingIndex === index ? binding : keybinding.key)}</button>
						</span>
						<button class="revert" onclick={() => record(index)}>
							{#if recordingIndex === index}
								<FilledSquareIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
							{:else if recordingIndex === null}
								<FilledCircleIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
							{:else}
								<FilledCircleIcon stroke="#585b70" style="width: 1rem; height: 1rem;" />
							{/if}
						</button>
						<button class="revert">
							<RevertIcon stroke="#cdd6f4" style="width: 1rem; height: 1rem;" />
						</button>
						<button class="revert" onclick={() => deleteKeybinding(index)}>
							<TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
						</button>
					</span>
				{/each}
			{:else if view === "developer"}
				<h1>Developer Settings</h1>
				<label for="developer-mode">
					<span>
						Developer Mode
						<input bind:this={developerMode} id="developer-mode" type="checkbox" oninput={() => setDeveloperMode(developerMode.checked)} />
					</span>
					<p>Enabling Developer mode allows adding custom scripts for animations or objects.</p>
				</label>
			{/if}
		</div>
	</div>
</Window>

<style>
	h1,
	button,
	label,
	span {
		color: #cdd6f4;
	}

	.add-keybinding {
		margin-left: auto;
		width: fit-content;
		border-radius: 0.5rem;
		padding: 0.5rem;
	}

	.binding {
		margin-left: 2rem;
	}

	.keybinding-entry {
		margin-left: 2rem;

		.revert {
			width: fit-content;
			border-radius: 0.5rem;
			padding: 0.5rem;
		}

		.key {
			background: #181825;
			width: fit-content;
			margin-left: 1rem;
			border-radius: 0.5rem;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
			width: 8rem;
		}
	}

	button {
		padding: 1rem;
		width: 15rem;

		&:hover {
			background: rgba(180, 150, 255, 10%);
		}
	}

	select {
		color: #cdd6f4;
		background: #181825;
		padding: 0.5rem;
		margin-left: 0.5rem;
		margin-right: 0.5rem;
	}

	p {
		color: #6c7086;
		font-size: 0.85rem;
	}

	.container {
		display: flex;
		height: 100%;
	}

	.sidebar {
		background-color: #181825;
		height: 100%;
	}

	h1 {
		margin-left: 2rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		padding-left: 2rem;
		padding-right: 2rem;
		padding-top: 1rem;
		padding-bottom: 1rem;

		&:hover {
			background: rgba(180, 150, 255, 10%);
		}

		> *:first-child {
			margin-bottom: 0.5rem;
		}
	}

	span {
		display: flex;
	}

	input[type="checkbox"] {
		margin-left: auto;
		accent-color: #b4befe;
	}
</style>
