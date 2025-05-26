<script lang="ts">
	import { onMount } from "svelte";
	import { displayKey, getActions, key, type Key, type KeyModifier } from "../../api/actions.svelte";
	import { deleteKeybinding, getKeybindings, getPreferences, savePreferences, updateKeybinding, type Preference } from "../../api/preferences.svelte";
	import ClockIcon from "../icons/ClockIcon.svelte";
	import CodeIcon from "../icons/CodeIcon.svelte";
	import FilledCircleIcon from "../icons/FilledCircleIcon.svelte";
	import FilledSquareIcon from "../icons/FilledSquareIcon.svelte";
	import KeyIcon from "../icons/KeyIcon.svelte";
	import PaintRollerIcon from "../icons/PaintRollerIcon.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import Window from "./Window.svelte";

	let windowComponent: Window;

	export function openWindow() {
		windowComponent.openWindow();
	}

	let view = $state("appearance");
	let hoverView: string | null = $state("appearance");

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
			// Recording new keybinding
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

			// Not Recording
			else {
				getKeybindings().forEach(keybinding => {
					if (
						event.key === keybinding.key.key &&
						event.ctrlKey === keybinding.key.modifiers.includes("ctrl") &&
						event.altKey === keybinding.key.modifiers.includes("alt") &&
						event.shiftKey === keybinding.key.modifiers.includes("shift")
					) {
						keybinding.action.run();
					}
				});
			}
		});
	});

	function backgroundColor(viewName: string) {
		return view === viewName ? "rgba(180, 150, 255, 20%)" : hoverView === viewName ? "rgba(180, 150, 255, 10%)" : "transparent";
	}

	function unHover(viewName: string) {
		return function () {
			if (hoverView === viewName) hoverView = null;
		};
	}

	function updateBooleanPreference(preferenceName: Preference) {
		return function (event: Event) {
			getPreferences()[preferenceName] = (event.target as HTMLInputElement).checked as any;
			savePreferences();
		};
	}
</script>

<Window bind:this={windowComponent} title="Preferences" style="width: 60rem; height: 40rem; padding-bottom: 0px;">
	<div class="container">
		<div class="sidebar">
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button
				onmouseout={unHover("appearance")}
				onmouseover={() => (hoverView = "appearance")}
				style:background={backgroundColor("appearance")}
				onclick={() => (view = "appearance")}
			>
				<PaintRollerIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				Appearance
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("timeline")} onmouseover={() => (hoverView = "timeline")} style:background={backgroundColor("timeline")} onclick={() => (view = "timeline")}>
				<ClockIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				Timeline
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("keybinds")} onmouseover={() => (hoverView = "keybinds")} style:background={backgroundColor("keybinds")} onclick={() => (view = "keybinds")}>
				<KeyIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				Keybindings
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("developer")} onmouseover={() => (hoverView = "developer")} style:background={backgroundColor("developer")} onclick={() => (view = "developer")}>
				<CodeIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				Developer Settings
			</button>
		</div>
		<div class="content">
			{#if view === "appearance"}
				<h1>Appearance</h1>
				<label for="preview-videos">
					<span>
						Object &amp; Animation Previews
						<input id="preview-videos" type="checkbox" />
					</span>
					<p>Show preview images and videos when adding new objects or animations.</p>
				</label>
			{:else if view === "timeline"}
				<h1>Timeline Settings</h1>
				<label for="collapse-wait-times">
					<span>
						Automatically Collapse Wait Times
						<input oninput={updateBooleanPreference("collapseWaitTimes")} id="collapse-wait-times" type="checkbox" />
					</span>
					<p>Automatically collapse blank space on the timeline. The space will open up when dragging an animation.</p>
				</label>
				<label for="relative-timestamps">
					<span>
						Relative Timestamps
						<input oninput={updateBooleanPreference("relativeTimestamps")} id="relative-timestamps" type="checkbox" />
					</span>
					<p>Show timestamps relative to the last animation instead of relative to the start of the video.</p>
				</label>
				<label for="dim-inactive-animations">
					<span>
						Dim Unselected Animations
						<input oninput={updateBooleanPreference("dimUnselectedAnimations")} id="dim-inactive-animations" checked type="checkbox" />
					</span>
					<p>When an object is selected, dim animations for other objects, and highlight animations for the selected object.</p>
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
						<input checked={getPreferences().developerMode} id="developer-mode" type="checkbox" oninput={updateBooleanPreference("developerMode")} />
					</span>
					<p>Enabling Developer mode allows adding custom Python scripts for animations or objects with access to the Manim library.</p>
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

	.content {
		width: 100%;
	}

	.add-keybinding {
		margin-left: auto;
		width: fit-content;
		border-radius: 0.5rem;
		padding: 0.5rem;
		margin-right: 2rem;
	}

	.binding {
		margin-left: 2rem;
	}

	.keybinding-entry {
		margin-left: 2rem;
		margin-bottom: 0.5rem;

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
		width: 15rem;
		border-radius: 0.5rem;

		option {
			&:hover {
				background: rgba(180, 150, 255, 10%);
			}
		}
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

		> button {
			display: flex;
			gap: 0.5rem;
		}
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
		width: 100%;

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
