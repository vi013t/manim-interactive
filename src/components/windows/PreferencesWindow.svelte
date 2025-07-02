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
		keysAreEqual,
		runAction,
		savePreferences,
		setPreference,
		updateKeybinding,
		type Key,
		type KeyModifier,
		type Preference,
	} from "../../api/preferences.svelte";
	import { getTheme, getThemes, setTheme } from "../../api/theme.svelte";
	import { getLanguage, getLanguageNames, setLanguage, translate, type LanguageName } from "../../api/translate.svelte";
	import ClockIcon from "../icons/ClockIcon.svelte";
	import CodeIcon from "../icons/CodeIcon.svelte";
	import CubeIcon from "../icons/CubeIcon.svelte";
	import FilledCircleIcon from "../icons/FilledCircleIcon.svelte";
	import FilledSquareIcon from "../icons/FilledSquareIcon.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import KeyIcon from "../icons/KeyIcon.svelte";
	import MoonIcon from "../icons/MoonIcon.svelte";
	import PaintRollerIcon from "../icons/PaintRollerIcon.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import SunIcon from "../icons/SunIcon.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import RadioInput from "../util/RadioInput.svelte";
	import Select from "../util/Select.svelte";
	import Tooltip from "../util/Tooltip.svelte";
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
				getKeybindings().forEach(keybinding => {
					if (
						event.key.toLowerCase() === keybinding.key.key.toLowerCase() &&
						event.ctrlKey === keybinding.key.modifiers.includes("ctrl") &&
						event.altKey === keybinding.key.modifiers.includes("alt") &&
						event.shiftKey === keybinding.key.modifiers.includes("shift")
					) {
						runAction(keybinding.action);
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
			setPreference(preferenceName, (event.target as HTMLInputElement).checked);
		};
	}
</script>

<Window onClose={closePreferencesWindow} bind:this={windowComponent} title="Preferences" style="width: 60rem; height: 40rem; padding-bottom: 0px;">
	<div class="container">
		<div class="sidebar">
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("general")} onmouseover={() => (hoverView = "general")} style:background={backgroundColor("general")} onclick={() => (view = "general")}>
				<GearIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				{translate("General")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button
				onmouseout={unHover("appearance")}
				onmouseover={() => (hoverView = "appearance")}
				style:background={backgroundColor("appearance")}
				onclick={() => (view = "appearance")}
			>
				<PaintRollerIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				{translate("Appearance")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("timeline")} onmouseover={() => (hoverView = "timeline")} style:background={backgroundColor("timeline")} onclick={() => (view = "timeline")}>
				<ClockIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				{translate("Timeline")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("project")} onmouseover={() => (hoverView = "project")} style:background={backgroundColor("project")} onclick={() => (view = "project")}>
				<CubeIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				{translate("Project Settings")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("keybinds")} onmouseover={() => (hoverView = "keybinds")} style:background={backgroundColor("keybinds")} onclick={() => (view = "keybinds")}>
				<KeyIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				{translate("Keybindings")}
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("developer")} onmouseover={() => (hoverView = "developer")} style:background={backgroundColor("developer")} onclick={() => (view = "developer")}>
				<CodeIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
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
				<div class="themes">
					{translate("Theme")}: <Select
						options={getThemes().map(theme => ({ name: theme.name, icon: theme.isDark ? MoonIcon : SunIcon, color: "var(--text)" }))}
						value={getTheme()}
						onSelect={value => setTheme(value)}
					/>
					<button class="create">{translate("Create New Theme")}</button>
				</div>
				<label for="preview-videos">
					<span>
						{translate("Object & Animation Previews")}
						<RadioInput id="preview-videos" bind:value={() => getPreferences().previews, value => setPreference("previews", value)} style="margin-left: auto;" />
					</span>
					<p>{translate("Show preview images and videos when adding new objects or animations")}.</p>
				</label>
				<label for="latex-preview">
					<span>
						{translate("Show LaTeX Previews")}
						<RadioInput id="latex-videos" bind:value={() => getPreferences().latexPreviews, value => setPreference("latexPreviews", value)} style="margin-left: auto;" />
					</span>
					<p>{translate("Show previews for LaTeX math equations as you type them")}.</p>
				</label>
				<label for="show-tooltips">
					<span>
						{translate("Show Tooltips")}
						<RadioInput id="show-tooltips" bind:value={() => getPreferences().showTooltips, value => setPreference("showTooltips", value)} style="margin-left: auto;" />
					</span>
					<p>{translate("Show tooltips when hovering on buttons or icons that explain them.")}.</p>
				</label>
				<label for="pip-on-top">
					<span>
						{translate("Picture-in-Picture Starts in Always-On-Top")}
						<RadioInput id="pip-on-top" bind:value={() => getPreferences().pipOnTopByDefault, value => setPreference("pipOnTopByDefault", value)} style="margin-left: auto;" />
					</span>
					<p>
						{translate("When opening the video in picture-in-picture mode, it will stay on top of other windows unless toggled.")}
					</p>
				</label>
			{:else if view === "timeline"}
				<h1>{translate("Timeline Settings")}</h1>
				<label for="timeline-snapping">
					<span>
						{translate("Snap by Default")}
						<RadioInput
							id="timeline-snapping"
							bind:value={() => getPreferences().timelineSnappingByDefault, value => setPreference("timelineSnappingByDefault", value)}
							style="margin-left: auto;"
						/>
					</span>
					<p>
						{translate(
							"By default, timeline elements such as animations, markers, and audios, will snap to even times. Holding control disables this temporarily. If this is disabled, holding control will enable it temporarily instead.",
						)}
					</p>
				</label>
				<label for="collapse-wait-times">
					<span>
						{translate("Automatically Collapse Wait Times")}
						<RadioInput
							id="collapse-wait-times"
							bind:value={() => getPreferences().collapseWaitsByDefault, value => setPreference("collapseWaitsByDefault", value)}
							style="margin-left: auto;"
						/>
					</span>
					<p>{translate("Automatically collapse blank space on the timeline. The space will open up when dragging an animation.")}</p>
				</label>
				<label for="relative-timestamps">
					<span>
						{translate("Relative Timestamps")}
						<RadioInput
							id="relative-timestamps"
							bind:value={() => getPreferences().relativeTimestamps, value => setPreference("relativeTimestamps", value)}
							style="margin-left: auto;"
						/>
					</span>
					<p>{translate("Show timestamps relative to the last animation instead of relative to the start of the video")}.</p>
				</label>
				<label for="dim-inactive-animations">
					<span>
						{translate("Dim Unselected Animations")}
						<RadioInput
							id="dim-inactive-animations"
							bind:value={() => getPreferences().dimUnselectedAnimations, value => setPreference("dimUnselectedAnimations", value)}
							style="margin-left: auto;"
						/>
					</span>
					<p>{translate("When an object is selected, dim animations for other objects, and highlight animations for the selected object")}.</p>
				</label>
			{:else if view === "project"}
				<h1>{translate("Project Settings")}</h1>
				<label for="autosave">
					<span>
						{translate("Autosave")}
						<RadioInput id="autosave" bind:value={() => getPreferences().autosave, value => setPreference("autosave", value)} style="margin-left: auto;" />
					</span>
					<p>{translate("Automatically save the project when making changes, such as adding or deleting objects or animations, moving animations, changing properties, etc")}.</p>
				</label>
				<label for="auto-open-last">
					<span>
						{translate("Automatically Open Last Project")}
						<RadioInput
							id="auto-open-last"
							bind:value={() => getPreferences().autoOpenLastProject, value => setPreference("autoOpenLastProject", value)}
							style="margin-left: auto;"
						/>
					</span>
					<p>{translate("When first opening Manim Interactive, automatically open the last project that was open last time Manim Interactive was open")}.</p>
				</label>
			{:else if view === "keybinds"}
				<h1>{translate("Keybindings")}</h1>
				<span>
					<button class="add-keybinding"><PlusIcon stroke="var(--text)" style="width: 1rem; height: 1rem;" /></button>
				</span>
				{#each getKeybindings() as keybinding, index}
					<span class="keybinding-entry">
						<span>
							{translate("Action")}:
							<Select height="1.5rem" options={getActions().map(action => action.name)} bind:value={keybinding.action} onSelect={savePreferences} width="15rem" />
						</span>
						<span class="binding">
							{translate("Keybind")}:
							<span
								class="key"
								style:outline={getKeybindings()
									.filter((_key, otherIndex) => otherIndex !== index)
									.some(otherKey => keysAreEqual(keybinding.key, otherKey.key))
									? "2px solid var(--red)"
									: "none"}
							>
								{displayKey(recordingIndex === index ? binding : keybinding.key)}
							</span>
						</span>
						<button style:margin-left="0.5rem" class="revert" onclick={() => record(index)}>
							{#if recordingIndex === index}
								<Tooltip text="Stop recording keybinding">
									<FilledSquareIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" />
								</Tooltip>
							{:else if recordingIndex === null}
								<Tooltip text="Record keybinding">
									<FilledCircleIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" />
								</Tooltip>
							{:else}
								<FilledCircleIcon stroke="var(--surface-2)" style="width: 1rem; height: 1rem;" />
							{/if}
						</button>
						<Tooltip element="button" text="Delete keybinding" onclick={() => deleteKeybinding(index)} style="border-radius: 0.5rem; padding: 0.5rem;">
							<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" />
						</Tooltip>
					</span>
				{/each}
			{:else if view === "developer"}
				<h1>{translate("Developer Settings")}</h1>
				<label for="developer-mode">
					<span>
						{translate("Developer Mode")}
						<RadioInput id="developer-mode" bind:value={() => getPreferences().developerMode, value => setPreference("developerMode", value)} style="margin-left: auto;" />
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
		color: var(--text);
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

		> * {
			gap: 0.5rem;
		}

		.revert {
			width: fit-content;
			border-radius: 0.5rem;
			padding: 0.5rem;
		}

		.key {
			background: var(--mantle);
			width: fit-content;
			border-radius: 0.5rem;
			padding: 0.5rem;
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

	p {
		color: var(--overlay-0);
		font-size: 0.85rem;
	}

	.container {
		display: flex;
		height: 100%;
	}

	.sidebar {
		background-color: var(--mantle);
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
			margin-bottom: 0.25rem;
		}
	}

	span {
		display: flex;
	}

	.themes {
		display: flex;
		margin-left: 2rem;
		gap: 0.5rem;
		color: var(--text);
		align-items: center;
		margin-bottom: 1rem;

		.create {
			background-color: var(--lavender);
			color: var(--crust);
			border-radius: 0.5rem;
			width: fit-content;
			padding: 0.5rem;
		}
	}
</style>
