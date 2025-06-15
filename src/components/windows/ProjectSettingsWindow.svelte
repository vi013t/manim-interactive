<script lang="ts">
	import { onMount } from "svelte";
	import { getKeybindings, getPreferences, key, savePreferences, updateKeybinding, type Key, type KeyModifier, type Preference } from "../../api/preferences.svelte";
	import { getProjectLibraries } from "../../api/project.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import PackageIcon from "../icons/PackageIcon.svelte";
	import PlusIcon from "../icons/PlusIcon.svelte";
	import TrashIcon from "../icons/TrashIcon.svelte";
	import Window from "./Window.svelte";

	let windowComponent: Window;

	export function openWindow() {
		windowComponent.openWindow();
	}
	let view = $derived("general");
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

<Window bind:this={windowComponent} title="Preferences" style="width: 60rem; height: 40rem; padding-bottom: 0px;">
	<div class="container">
		<!-- svelte-ignore a11y_mouse_events_have_key_events -->
		<div class="sidebar">
			<button onmouseout={unHover("general")} onmouseover={() => (hoverView = "general")} style:background={backgroundColor("general")} onclick={() => (view = "general")}>
				<GearIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				General
			</button>
			<button onmouseout={unHover("libraries")} onmouseover={() => (hoverView = "libraries")} style:background={backgroundColor("libraries")} onclick={() => (view = "libraries")}>
				<PlusIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				Add Ons
			</button>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<button onmouseout={unHover("libraries")} onmouseover={() => (hoverView = "libraries")} style:background={backgroundColor("libraries")} onclick={() => (view = "libraries")}>
				<PackageIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				Script Libraries
			</button>
		</div>
		<div class="content">
			{#if view === "general"}
				<h1>General</h1>
			{:else if view === "libraries"}
				<h1>External Libraries</h1>
				{#each getProjectLibraries() as library (library)}
					<div class="library">
						<span>{library}</span>
						<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" />
					</div>
				{/each}
			{/if}
		</div>
	</div>
</Window>

<style>
	h1,
	button,
	span {
		color: var(--text);
	}

	.library {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-left: 2rem;

		> span {
			background-color: var(--mantle);
			padding-left: 1rem;
			padding-right: 1rem;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
			border-radius: 0.5rem;
			width: fit-content;
		}
	}

	.content {
		width: 100%;
	}

	button {
		padding: 1rem;
		width: 15rem;

		&:hover {
			background: rgba(180, 150, 255, 10%);
		}
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

	span {
		display: flex;
	}
</style>
