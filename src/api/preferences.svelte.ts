import { action, key, keybinding, type Key, type Keybinding } from "./actions.svelte";

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

let preferences = $state({
	previews: true,
	collapseWaitTimes: false,
	relativeTimestamps: false,
	dimUnselectedAnimations: true,
	developerMode: false,
	autosave: true,
	keybindings: [
		keybinding(action("Save Project"), key("s", "ctrl")),
		keybinding(action("New Project"), key("n", "ctrl")),
		keybinding(action("Open Project"), key("o", "ctrl")),
		keybinding(action("Add New"), key("a", "shift")),
		keybinding(action("Deselect"), key("Escape")),
		keybinding(action("Deselect"), key("d", "ctrl")),
	],
});

export type Preference = keyof typeof preferences;

export function savePreferences() {
	localStorage.setItem("manim-interactive-preferences", JSON.stringify(preferences));
}

export function loadPreferences() {
	preferences = JSON.parse(localStorage.getItem("manim-interactive-preferences")!);
	console.log("Loaded", preferences);
}

export function getPreferences() {
	return preferences;
}
