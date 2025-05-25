export type KeyModifier = "ctrl" | "shift" | "alt";

export type Key = {
	key: string;
	modifiers: KeyModifier[];
};

type Action = {
	name: string;
};

const actions = {
	"Save Project": {
		name: "Save Project",
	},
	"Open Project": {
		name: "Open Project",
	},
	"New Project": {
		name: "New Project",
	},
} as const satisfies { [key: string]: Action };

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

let keybindings: Keybinding[] = $state([
	keybinding(action("Save Project"), key("s", "ctrl")),
	keybinding(action("New Project"), key("n", "ctrl")),
	keybinding(action("Open Project"), key("o", "ctrl")),
]);

export function updateKeybinding(index: number, key: Key) {
	keybindings[index].key = key;
}

export function deleteKeybinding(index: number) {
	keybindings = keybindings.filter((_, elementIndex) => index !== elementIndex);
}

export function getKeybindings(): Keybinding[] {
	return keybindings;
}
