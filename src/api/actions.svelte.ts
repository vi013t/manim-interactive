import { invoke } from "@tauri-apps/api/core";
import { generateCode } from "./codegen.svelte";
import { getProjectLocation, saveProjectData, select } from "./project.svelte";

export type KeyModifier = "ctrl" | "shift" | "alt";

export type Key = {
	key: string;
	modifiers: KeyModifier[];
};

type Action = {
	name: string;
	run: (() => void) | (() => Promise<void>);
};

const actions = {
	"Save Project": {
		name: "Save Project",
		async run() {
			let projectData = saveProjectData();

			let save_data = invoke("save_project_data", {
				path: await getProjectLocation(),
				data: projectData,
			});

			await invoke("recompile", {
				projectPath: await getProjectLocation(),
				code: generateCode(),
			});

			const videoData = (await invoke("load_video", {
				path: await getProjectLocation(),
			})) as string;

			document.getElementById("video-source")?.setAttribute("src", videoData);

			await save_data;
		},
	},
	"Open Project": {
		name: "Open Project",
		run: () => {},
	},
	"Add New": {
		name: "Open Project",
		run: () => {},
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
