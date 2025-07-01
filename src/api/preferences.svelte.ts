import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { cache, getFromCache, openPreferencesWindow, openProjectSettingsWindow, showAddMenu, showNewProjectWindow } from "./client.svelte";
import { generateCode } from "./codegen.svelte";
import {
	addNotification,
	deselect,
	deserializeProject,
	getExplicitProjectLocation,
	getObjectFromId,
	getProject,
	getProjectLocation,
	getSingleSelection,
	movieLength,
	projectHasErrors,
	serializeProject,
	setProjectLocation,
} from "./project.svelte";
import type { DeepReadonly } from "./types";

export function updateKeybinding(index: number, key: Key) {
	preferences.keybindings[index].key = key;
	savePreferences();
}

export function deleteKeybinding(index: number) {
	preferences.keybindings = preferences.keybindings.filter((_, elementIndex) => index !== elementIndex);
	savePreferences();
}

export function getKeybindings(): Keybinding[] {
	return preferences.keybindings;
}

let videoGenerated = $state(false);

export function hasEverGeneratedVideo(): boolean {
	return videoGenerated;
}

const actions = [
	{
		name: "Save Project",
		async run() {
			const projectData = serializeProject();
			const location = getExplicitProjectLocation();

			if (!location) {
				let selected = await open({
					directory: true,
					multiple: false,
					title: "Save Project To",
				});

				if (typeof selected !== "string") return;

				setProjectLocation(selected);
			}

			await invoke("save_project_data", {
				path: await getProjectLocation(),
				data: projectData,
			});
		},
	},
	{
		name: "Save And Recompile Project",
		async run() {
			videoLoaded = false;
			const projectData = serializeProject();
			const location = getExplicitProjectLocation();

			if (!location) {
				let selected = await open({
					directory: true,
					multiple: false,
					title: "Save Project To",
				});

				if (typeof selected !== "string") return;

				setProjectLocation(selected);
			}

			const saveData = invoke("save_project_data", {
				path: await getProjectLocation(),
				data: projectData,
			});

			if (projectHasErrors()) {
				addNotification("Error Reloading Video", "Your project currently contains errors, so the video couldn't be reloaded. Fix the errors to reload the video.", {
					severity: "error",
				});
				videoLoaded = true;
				return;
			}

			await invoke("recompile", {
				projectPath: await getProjectLocation(),
				code: generateCode(),
				fps: getProject().settings.fps,
				fileFormat: getProject().settings.fileFormat,
				renderer: getProject().settings.renderer.toLowerCase(),
				resolutionWidth: getProject().settings.resolution[0],
				resolutionHeight: getProject().settings.resolution[1],
				outputFileName: getProject().settings.outputFileName,
			});

			getProject().cache.videoData = await invoke<string>("load_video", {
				path: await getProjectLocation(),
				lowRes: getFromCache("lowRes"),
				resolutionHeight: getProject().settings.resolution[1],
				fps: getProject().settings.fps,
				outputFileName: getProject().settings.outputFileName,
				fileFormat: getProject().settings.fileFormat,
			});

			if (getSingleSelection() === null || getObjectFromId(getSingleSelection()!) === null) {
				(document.getElementById("video-source") as HTMLVideoElement | null)?.play();
			}
			videoLoaded = true;
			videoGenerated = true;

			localStorage.setItem("project", serializeProject());
			localStorage.setItem("reloadProject", "true");

			await saveData;
		},
	},
	{
		name: "Open Project",
		async run() {
			const selected = await open({
				directory: true,
				multiple: false,
				title: "Select a directory",
			});

			// Directory Chosen
			if (typeof selected === "string") {
				setProjectLocation(selected);
				deserializeProject(await invoke("get_project_data", { path: selected }));
				localStorage.setItem("last-project", selected);
				videoGenerated = false;
			}

			// No directory chosen
			else {
				console.log("No directory selected");
			}
		},
	},
	{
		name: "Add New",
		run() {
			showAddMenu();
		},
	},
	{
		name: "Play",
		run() {
			(document.getElementById("video-source") as HTMLVideoElement | null)?.play();
		},
	},
	{
		name: "New Project",
		async run() {
			showNewProjectWindow();
		},
	},
	{
		name: "Deselect",
		run() {
			deselect();
		},
	},
	{
		name: "Open Preferences",
		run() {
			openPreferencesWindow();
		},
	},
	{
		name: "Open Project Settings",
		run() {
			openProjectSettingsWindow();
		},
	},
	{
		name: "Compile Project",
		async run() {
			const projectData = serializeProject();

			const saveData = invoke("save_project_data", {
				path: await getProjectLocation(),
				data: projectData,
			});

			if (projectHasErrors()) {
				addNotification("Error Compiling Project", "Your project currently contains errors, so the video couldn't be reloaded. Fix the errors to reload the video.", {
					severity: "error",
				});
				return;
			}

			await invoke("compile", {
				projectPath: await getProjectLocation(),
				code: generateCode(),
				resolutionWidth: getProject().settings.resolution[0],
				resolutionHeight: getProject().settings.resolution[1],
				renderer: getProject().settings.renderer.toLowerCase(),
				fileFormat: getProject().settings.fileFormat,
				fps: getProject().settings.fps,
				outputFileName: getProject().settings.outputFileName,
				audios: getProject().audios.map(audio => ({
					id: audio.id,
					data: audio.properties["Embedded Source"]!,
					duration: audio.duration,
					start_time: audio.properties["Start Time"]!,
				})),
				videoLength: movieLength(),
				openWhenFinished: true,
			});

			await saveData;
		},
	},
] as const satisfies { name: string; run: (() => void) | (() => Promise<void>) }[];

let preferences = $state({
	previews: true,
	relativeTimestamps: false,
	dimUnselectedAnimations: true,
	developerMode: false,
	autosave: true,
	autoOpenLastProject: true,
	vimMode: false,
	latexPreviews: true,
	showWaits: false,
	showTooltips: true,
	timelineSnappingByDefault: true,
	collapseWaitsByDefault: false,
	pipOnTopByDefault: true,
	keybindings: [
		{ action: "Save And Recompile Project", key: key("s", "ctrl") },
		{ action: "Open Project", key: key("o", "ctrl") },
		{ action: "New Project", key: key("n", "ctrl") },
		{ action: "Add New", key: key("a", "shift") },
		{ action: "Deselect", key: key("Escape") },
		{ action: "Deselect", key: key("d", "ctrl") },
		{ action: "Play", key: key(" ") },
		{ action: "Open Preferences", key: key(".", "ctrl") },
		{ action: "Open Project Settings", key: key(",", "ctrl") },
	] satisfies Keybinding[],
});

export type Preferences = typeof preferences;

let preferenceHooks: { name: Preference; hook: (value: unknown) => void }[] = [];

export function onPreferenceChange(name: Preference, hook: (value: unknown) => void) {
	preferenceHooks.push({ name, hook });
}

export type Preference = keyof typeof preferences;

export function savePreferences() {
	localStorage.setItem("preferences", JSON.stringify(preferences));
}

export function loadPreferences() {
	preferences = JSON.parse(localStorage.getItem("preferences")!);
	cache("videoPipAlwaysOnTop", preferences.pipOnTopByDefault);
	cache("timelineSnapping", preferences.timelineSnappingByDefault);
}

export function getPreferences(): DeepReadonly<Preferences> {
	return preferences;
}

export function setPreferences(newPreferences: Preferences): void {
	preferences = newPreferences;
}

export function bindPreference<Name extends Preference>(preferenceName: Name): [() => DeepReadonly<Preferences[Name]>, (value: Preferences[Name]) => void] {
	return [() => getPreferences()[preferenceName], (value: Preferences[Preference]) => setPreference(preferenceName, value)];
}

export function setPreference(name: Preference, value: any) {
	preferences[name] = value;
	preferenceHooks.filter(listener => listener.name === name).forEach(listener => listener.hook(value));
	savePreferences();
}

export type KeyModifier = "ctrl" | "shift" | "alt";

export type Key = {
	key: string;
	modifiers: KeyModifier[];
};

export function keysAreEqual(key: Key, other: Key): boolean {
	return key.key === other.key && key.modifiers.every(modifier => other.modifiers.includes(modifier)) && other.modifiers.every(modifier => key.modifiers.includes(modifier));
}

type Action<T = undefined> = {
	name: string;
	undo?: T extends undefined ? (() => void) | (() => Promise<void>) : ((data: T) => void) | ((data: T) => Promise<void>);
};

let videoLoaded = $state(true);

export function isVideoLoaded() {
	return videoLoaded;
}

export async function runAction<Name extends ActionName>(name: Name): Promise<void> {
	let action = actions.find(action => action.name === name)!;
	await action.run();
}

export function getActions(): Action<any>[] {
	return Object.values(actions);
}

type ActionName = typeof actions extends (infer A)[] ? (A extends { name: string } ? A["name"] : never) : never;

export function key(key: string, ...modifiers: KeyModifier[]): Key {
	return { key, modifiers };
}

export function action<Name extends ActionName>(name: Name): Name {
	return name;
}

export type Keybinding = {
	action: ActionName;
	key: Key;
};

export function keybinding(action: ActionName, key: Key): Keybinding {
	return { action, key };
}

export function displayKey(key: Key): string {
	let result = "";
	if (key.modifiers.includes("ctrl")) result += "Ctrl+";
	if (key.modifiers.includes("alt")) result += "Alt+";
	if (key.modifiers.includes("shift")) result += "Shift+";
	result += key.key === " " ? "Space" : key.key.length > 1 ? key.key.charAt(0).toUpperCase() + key.key.substring(1).toLowerCase() : key.key.toUpperCase();
	return result;
}

let undoHistory: { action: Action<unknown>; data: unknown }[] = [];

export function undo() {
	let action = undoHistory.pop();
	action?.action.undo!(action.data);
}

export function getKeybindingForAction(name: ActionName): Keybinding | null {
	return preferences.keybindings.find(keybinding => keybinding.action === name) ?? null;
}

export function tryDisplayActionKeybinding(name: ActionName): string {
	const keybinding = getKeybindingForAction(name);
	if (!keybinding) return "";
	return displayKey(keybinding.key);
}
