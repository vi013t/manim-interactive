import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { generateCode } from "./codegen.svelte";
import {
	addNotification,
	getExplicitProjectLocation,
	getProjectLocation,
	getProjectSaveData,
	loadProjectData,
	projectHasErrors,
	resetProject,
	select,
	setProjectLocation,
} from "./project.svelte";

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

const actions = {
	"Save Project": {
		name: "Save Project",
		async run() {
			const projectData = getProjectSaveData();
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
	"Save And Recompile Project": {
		name: "Save Project",
		async run() {
			videoLoaded = false;
			const projectData = getProjectSaveData();
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
				lowRes: getPreferences().lowRes,
				code: generateCode(),
			});

			const videoData = await invoke<string>("load_video", {
				path: await getProjectLocation(),
				lowRes: getPreferences().lowRes,
			});

			document.getElementById("video-source")?.setAttribute("src", videoData);
			(document.getElementById("video-source") as HTMLVideoElement | null)?.play();
			videoLoaded = true;
			videoGenerated = true;

			await saveData;
		},
	},
	"Open Project": {
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
				loadProjectData(await invoke("get_project_data", { path: selected }));
				localStorage.setItem("last-project", selected);
				videoGenerated = false;
			}

			// No directory chosen
			else {
				console.log("No directory selected");
			}
		},
	},
	"Add New": {
		name: "Open Project",
		run() {},
	},
	Play: {
		name: "Play",
		run() {
			(document.getElementById("video-source") as HTMLVideoElement | null)?.play();
		},
	},
	"New Project": {
		name: "New Project",
		async run({ path, name }: { path: string; name: string }) {
			let projectPath = await invoke<string>("new_project", { path, name });
			setProjectLocation(projectPath);
			resetProject();
			localStorage.setItem("last-project", projectPath);
			videoGenerated = false;
		},
	},
	Deselect: {
		name: "Deselect",
		run() {
			select(null);
		},
	},
} as const satisfies { [key: string]: Action<any> };

let preferences = $state({
	previews: true,
	collapseWaitTimes: false,
	relativeTimestamps: false,
	dimUnselectedAnimations: true,
	developerMode: false,
	autosave: true,
	autoOpenLastProject: true,
	grid: false,
	lowRes: false,
	vimMode: false,
	latexPreviews: true,
	timelineSnapping: true,
	keybindings: [
		keybinding(action("Save And Recompile Project"), key("s", "ctrl")),
		keybinding(action("Open Project"), key("o", "ctrl")),
		keybinding(action("Add New"), key("a", "shift")),
		keybinding(action("Deselect"), key("Escape")),
		keybinding(action("Deselect"), key("d", "ctrl")),
		keybinding(action("Play"), key(" ")),
	],
});

export type Preference = keyof typeof preferences;

export function savePreferences() {
	localStorage.setItem("manim-interactive-preferences", JSON.stringify(preferences));
}

export function loadPreferences() {
	preferences = JSON.parse(localStorage.getItem("manim-interactive-preferences")!);
}

export function getPreferences() {
	return preferences;
}

export type KeyModifier = "ctrl" | "shift" | "alt";

export type Key = {
	key: string;
	modifiers: KeyModifier[];
};

type Action<T = undefined> = {
	name: string;
	run: T extends undefined ? (() => void) | (() => Promise<void>) : ((data: T) => void) | ((data: T) => Promise<void>);
	undo?: T extends undefined ? (() => void) | (() => Promise<void>) : ((data: T) => void) | ((data: T) => Promise<void>);
};

let videoLoaded = $state(true);

export function isVideoLoaded() {
	return videoLoaded;
}

type ActionData<Name extends ActionName> = (typeof actions)[Name] extends Action<infer Data> ? Data : never;

export async function runAction<Name extends ActionName>(name: Name, data?: ActionData<Name>): Promise<void> {
	let action = actions[name];
	await (action.run as any)(data);
	if ("undo" in action) undoHistory.push({ action: action as any, data });
}

export function getActions(): Action<any>[] {
	return Object.values(actions);
}

type ActionName = keyof typeof actions;

export function key(key: string, ...modifiers: KeyModifier[]): Key {
	return { key, modifiers };
}

export function action<Name extends ActionName>(name: Name): (typeof actions)[Name] {
	return actions[name];
}

export type Keybinding = {
	action: Action;
	key: Key;
};

export function keybinding(action: Action, key: Key): Keybinding {
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
