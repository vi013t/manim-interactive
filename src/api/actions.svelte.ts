import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { generateCode } from "./codegen.svelte";
import { getPreferences } from "./preferences.svelte";
import { getExplicitProjectLocation, getProjectLocation, loadProjectData, saveProjectData, select, setProjectLocation } from "./project.svelte";

export type KeyModifier = "ctrl" | "shift" | "alt";

export type Key = {
	key: string;
	modifiers: KeyModifier[];
};

type Action = {
	name: string;
	run: (() => void) | (() => Promise<void>);
};

let videoLoaded = $state(true);

export function isVideoLoaded() {
	return videoLoaded;
}

const actions = {
	"Save Project": {
		name: "Save Project",
		async run() {
			videoLoaded = false;
			let projectData = saveProjectData();
			let location = getExplicitProjectLocation();

			if (!location) {
				let selected = await open({
					directory: true,
					multiple: false,
					title: "Save Project To",
				});

				if (typeof selected !== "string") return;

				setProjectLocation(selected);
			}

			let save_data = invoke("save_project_data", {
				path: await getProjectLocation(),
				data: projectData,
			});

			await invoke("recompile", {
				projectPath: await getProjectLocation(),
				lowRes: getPreferences().lowRes,
				code: generateCode(),
			});

			const videoData = (await invoke("load_video", {
				path: await getProjectLocation(),
				lowRes: getPreferences().lowRes,
			})) as string;

			document.getElementById("video-source")?.setAttribute("src", videoData);
			videoLoaded = true;

			await save_data;
		},
	},
	"Open Project": {
		name: "Open Project",
		run: async () => {
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
			}

			// No directory chosen
			else {
				console.log("No directory selected");
			}
		},
	},
	"Add New": {
		name: "Open Project",
		run: () => {},
	},
	Play: {
		name: "Play",
		run: () => {
			(document.getElementById("video-source") as HTMLVideoElement | null)?.play();
		},
	},
	"New Project": {
		name: "New Project",
		run: () => {},
	},
	Deselect: {
		name: "Deselect",
		run: () => select(null),
	},
} as const satisfies { [key: string]: Action };

export async function runAction(name: ActionName) {
	await actions[name].run();
}

export function getActions(): Action[] {
	return Object.values(actions);
}

type ActionName = keyof typeof actions;

export function key(key: string, ...modifiers: KeyModifier[]): Key {
	return { key, modifiers };
}

export function action(name: ActionName): Action {
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
	result += key.key.toUpperCase();
	return result;
}
