<script lang="ts">
	import { onMount } from "svelte";
	import { closePreferencesWindow, getPreferencesView, isPreferencesWindowOpen, openPreferencesWindow } from "../../api/client.svelte";
	import {
		deleteKeybinding,
		displayKey,
		getActions,
		getKeybindings,
		getPreferences,
		key,
		savePreferences,
		updateKeybinding,
		type Key,
		type KeyModifier,
		type Preference,
	} from "../../api/preferences.svelte";
	import { getThemes, setTheme } from "../../api/theme.svelte";
	import { getLanguage, getLanguageNames, setLanguage, translate, type LanguageName } from "../../api/translate.svelte";
	import BeakerIcon from "../icons/BeakerIcon.svelte";
	import ClockIcon from "../icons/ClockIcon.svelte";
	import CodeIcon from "../icons/CodeIcon.svelte";
	import CubeIcon from "../icons/CubeIcon.svelte";
	import FilledCircleIcon from "../icons/FilledCircleIcon.svelte";
	import FilledSquareIcon from "../icons/FilledSquareIcon.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import KeyIcon from "../icons/KeyIcon.svelte";
	import PaintRollerIcon from "../icons/PaintRollerIcon.svelte";
	import PencilIcon from "../icons/PencilIcon.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import Select from "../util/Select.svelte";
	import Window from "./Window.svelte";

	let windowComponent: Window;

	export function openWindow() {
		openPreferencesWindow();
	}

	$effect(() => {
		if (isPreferencesWindowOpen()) {
			windowComponent.openWindow();
		} else {
			windowComponent.close();
		}
	});

	let view = $derived(getPreferencesView());
	let hoverView: string | null = $state("general");

	let recordingIndex: number | null = $state(null);

	function record(index: number) {
		if (recordingIndex === index) recordingIndex = null;
		else if (recordingIndex === null) recordingIndex = index;
	}

	let modifiers: KeyModifier[] = $state([]);
	let chosenKey: string = $state("");
	let binding: Key = $derived(key(chosenKey, ...modifiers));

	function isUserTyping() {
		const active = document.activeElement as HTMLElement;

		if (!active) return false;

		// Check if active element is an input, textarea, or contenteditable
		const isInputOrTextarea = active.tagName === "INPUT" || active.tagName === "TEXTAREA";
		const isContentEditable = active.isContentEditable;

		return isInputOrTextarea || isContentEditable;
	}

	onMount(() => {
		document.addEventListener("keydown", event => {
			// Recording new keybinding
			if (recordingIndex !== null) {
				event.preventDefault();
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

			// Not Recording (and not typing)
			else if (!isUserTyping()) {
				event.preventDefault();
				getKeybindings().some(keybinding => {
					if (
						event.key === keybinding.key.key &&
						event.ctrlKey === keybinding.key.modifiers.includes("ctrl") &&
						event.altKey === keybinding.key.modifiers.includes("alt") &&
						event.shiftKey === keybinding.key.modifiers.includes("shift")
					) {
						keybinding.action.run();
						return true;
					}

					return false;
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

<Window onClose={closePreferencesWindow} bind:this={windowComponent} title="Preferences" style="width: 60rem; height: 40rem; padding-bottom: 0px;">
	<div class="container">
		<div class="sidebar">
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("general")} onmouseover={() => (hoverView = "general")} style:background={backgroundColor("general")} onclick={() => (view = "general")}>
				<GearIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				{translate("General")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button
				onmouseout={unHover("appearance")}
				onmouseover={() => (hoverView = "appearance")}
				style:background={backgroundColor("appearance")}
				onclick={() => (view = "appearance")}
			>
				<PaintRollerIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				{translate("Appearance")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("timeline")} onmouseover={() => (hoverView = "timeline")} style:background={backgroundColor("timeline")} onclick={() => (view = "timeline")}>
				<ClockIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				{translate("Timeline")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("project")} onmouseover={() => (hoverView = "project")} style:background={backgroundColor("project")} onclick={() => (view = "project")}>
				<CubeIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				{translate("Project Settings")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("keybinds")} onmouseover={() => (hoverView = "keybinds")} style:background={backgroundColor("keybinds")} onclick={() => (view = "keybinds")}>
				<KeyIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				{translate("Keybindings")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("developer")} onmouseover={() => (hoverView = "developer")} style:background={backgroundColor("developer")} onclick={() => (view = "developer")}>
				<CodeIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
				{translate("Developer Settings")}
			</button>
		</div>
		<div class="content">
			{#if view === "general"}
				<h1>{translate("General")}</h1>
				<span class="gap">
					{translate("Language")}: <Select options={getLanguageNames()} value={getLanguage()} onSelect={value => setLanguage(value as LanguageName)} />
				</span>
			{:else if view === "appearance"}
				<h1>{translate("Appearance")}</h1>
				<span>{translate("Themes")}</span>
				<div class="themes">
					<span class="selected">
						<button class="theme-button">Catppuccin Mocha ({translate("Default")})</button>
					</span>
					{#each getThemes() as theme}
						<span>
							<button class="theme-button" onclick={() => setTheme(theme)}>{theme.name}</button>
							<button class="icon"><PencilIcon stroke="#cdd6f4" style="width: 1.25rem; height: 1.25rem;" /></button>
							<button class="icon"><TrashIcon stroke="#f38ba8" style="width: 1.25rem; height: 1.25rem;" /></button>
						</span>
					{/each}
					<button class="create">{translate("Create New Theme")}</button>
				</div>
				<label for="preview-videos">
					<span>
						{translate("Object & Animation Previews")}
						<input oninput={updateBooleanPreference("previews")} id="preview-videos" type="checkbox" checked={getPreferences().previews} />
					</span>
					<p>{translate("Show preview images and videos when adding new objects or animations")}.</p>
				</label>
				<label for="latex-preview">
					<span>
						{translate("Show LaTeX Previews")}
						<input oninput={updateBooleanPreference("latexPreviews")} id="latex-preview" type="checkbox" checked={getPreferences().latexPreviews} />
					</span>
					<p>{translate("Show previews for LaTeX math equations as you type them")}.</p>
				</label>
			{:else if view === "timeline"}
				<h1>{translate("Timeline Settings")}</h1>
				<label for="collapse-wait-times">
					<span>
						{translate("Automatically Collapse Wait Times")}
						<input checked={getPreferences().collapseWaitTimes} oninput={updateBooleanPreference("collapseWaitTimes")} id="collapse-wait-times" type="checkbox" />
					</span>
					<p>{translate("Automatically collapse blank space on the timeline. The space will open up when dragging an animation.")}</p>
				</label>
				<label for="relative-timestamps">
					<span>
						{translate("Relative Timestamps")}
						<input checked={getPreferences().relativeTimestamps} oninput={updateBooleanPreference("relativeTimestamps")} id="relative-timestamps" type="checkbox" />
					</span>
					<p>{translate("Show timestamps relative to the last animation instead of relative to the start of the video")}.</p>
				</label>
				<label for="dim-inactive-animations">
					<span>
						{translate("Dim Unselected Animations")}
						<input oninput={updateBooleanPreference("dimUnselectedAnimations")} id="dim-inactive-animations" checked={getPreferences().dimUnselectedAnimations} type="checkbox" />
					</span>
					<p>{translate("When an object is selected, dim animations for other objects, and highlight animations for the selected object")}.</p>
				</label>
			{:else if view === "project"}
				<h1>{translate("Project Settings")}</h1>
				<label for="autosave">
					<span>
						{translate("Autosave")}
						<input oninput={updateBooleanPreference("autosave")} id="autosave" checked={getPreferences().autosave} type="checkbox" />
					</span>
					<p>{translate("Automatically save the project when making changes, such as adding or deleting objects or animations, moving animations, changing properties, etc")}.</p>
				</label>
				<label for="auto-open-last">
					<span>
						{translate("Automatically Open Last Project")}
						<input oninput={updateBooleanPreference("autoOpenLastProject")} id="auto-open-last" checked={getPreferences().autoOpenLastProject} type="checkbox" />
					</span>
					<p>{translate("When first opening Manim Interactive, automatically open the last project that was open last time Manim Interactive was open")}.</p>
				</label>
			{:else if view === "keybinds"}
				<h1>{translate("Keybindings")}</h1>
				<label for="vim-mode">
					<span>
						<span>
							{translate("Vim Mode")}
							<div title="This feature is currently experimental"><BeakerIcon stroke="#a6e3a1" style="width: 1rem; height: 1rem;" /></div>
						</span>
						<input oninput={updateBooleanPreference("vimMode")} id="vim-mode" checked={getPreferences().vimMode} type="checkbox" />
					</span>
					<p>{translate("Enable keyboard navigation with Vim-style bindings")}.</p>
				</label>
				<span>
					<button class="add-keybinding"><PlusIcon stroke="#cdd6f4" style="width: 1rem; height: 1rem;" /></button>
				</span>
				{#each getKeybindings() as keybinding, index}
					<span class="keybinding-entry">
						<span>
							{translate("Action")}:
							<select>
								{#each getActions() as action}
									<option selected={action.name === keybinding.action.name}>{translate(action.name)}</option>
								{/each}
							</select>
						</span>
						<span class="binding">
							{translate("Keybind")}:
							<button class="key">{displayKey(recordingIndex === index ? binding : keybinding.key)}</button>
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
				<h1>{translate("Developer Settings")}</h1>
				<label for="developer-mode">
					<span>
						{translate("Developer Mode")}
						<input checked={getPreferences().developerMode} id="developer-mode" type="checkbox" oninput={updateBooleanPreference("developerMode")} />
					</span>
					<p>{translate("Enabling Developer mode allows adding custom Python scripts for animations or objects with access to the Manim library")}.</p>
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

		> span {
			margin-left: 2rem;
			padding-bottom: 0.5rem;
		}
	}

	.gap {
		gap: 0.5rem;
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
			height: 100%;
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

		> span > span {
			gap: 1rem;

			> div {
				width: fit-content;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	span {
		display: flex;
	}

	input[type="checkbox"] {
		margin-left: auto;
		accent-color: #b4befe;
	}

	.themes {
		display: flex;
		flex-direction: column;
		margin-left: 2rem;
		gap: 0.25rem;

		.theme-button {
			background-color: #11111b;
			border-radius: 0.5rem;
			padding: 0.5rem;
			width: 20rem;
		}

		span {
			&.selected button {
				color: #a6e3a1;
			}
		}

		.create {
			background-color: #b4befe;
			color: #11111b;
			border-radius: 0.5rem;
			width: fit-content;
			padding: 0.5rem;
			margin-top: 0.25rem;
		}

		.icon {
			width: fit-content;
			height: fit-content;
			padding: 0.5rem;
			border-radius: 0.25rem;
		}
	}
</style>
