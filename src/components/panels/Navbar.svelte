<script lang="ts">
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { getPreferences, runAction, savePreferences, type Preference } from "../../api/preferences.svelte";
	import { getProjectName } from "../../api/project.svelte";
	import icon from "../../assets/icon.png";
	import ContextMenu from "../ContextMenu.svelte";
	import CloseIcon from "../icons/CloseIcon.svelte";
	import GridIcon from "../icons/GridIcon.svelte";
	import MinimizeIcon from "../icons/MinimizeIcon.svelte";
	import ResolutionIcon from "../icons/ResolutionIcon.svelte";
	import UnmaximizeIcon from "../icons/UnmaximizeIcon.svelte";
	import NewProjectWindow from "../windows/NewProjectWindow.svelte";
	import PreferencesWindow from "../windows/PreferencesWindow.svelte";
	import ProjectSettingsWindow from "../windows/ProjectSettingsWindow.svelte";

	let projectButton: HTMLElement;
	let windowButton: HTMLElement;
	let projectMenu: ContextMenu;
	let windowMenu: ContextMenu;
	let helpMenu: ContextMenu;
	let helpButton: HTMLElement;

	async function saveProject() {
		projectMenu.hide();
		runAction("Save Project");
	}

	async function openProject() {
		projectMenu.hide();
		runAction("Open Project");
	}

	function close() {
		const appWindow = getCurrentWindow();
		appWindow.close();
	}

	function minimize() {
		const appWindow = getCurrentWindow();
		appWindow.minimize();
	}

	function maximize() {
		const appWindow = getCurrentWindow();
		appWindow.toggleMaximize();
	}

	let newProjectWindow: NewProjectWindow;
	let preferencesWindow: PreferencesWindow;
	let projectSettingsWindow: ProjectSettingsWindow;

	function newProject() {
		newProjectWindow.openWindow();
		projectMenu.hide();
	}

	function preferences() {
		preferencesWindow.openWindow();
		windowMenu.hide();
	}

	function projectSettings() {
		projectSettingsWindow.openWindow();
		projectMenu.hide();
	}

	function togglePreference(preferenceName: Preference) {
		return function (_event: Event) {
			getPreferences()[preferenceName] = !(getPreferences()[preferenceName] as boolean) as any;
			if (preferenceName === "lowRes" && getPreferences().autosave) runAction("Save Project");
			savePreferences();
		};
	}
</script>

<nav oncontextmenu={event => event.preventDefault()}>
	<img src={icon} alt="Manim Interactive" />

	<button bind:this={projectButton} onclick={projectMenu.toggle}>Project</button>
	<ContextMenu bind:this={projectMenu} top="2rem" left="2rem" openers={[projectButton]}>
		<button onclick={newProject}>
			<span>New Project</span>
			<span>Ctrl+N</span>
		</button>
		<button onclick={openProject}>
			<span>Open Project</span>
			<span>Ctrl+O</span>
		</button>
		<button onclick={saveProject}>
			<span>Save Project</span>
			<span>Ctrl+S</span>
		</button>
		<button onclick={projectSettings}>
			<span>Project Settings</span>
			<span>Ctrl+,</span>
		</button>
	</ContextMenu>

	<button bind:this={windowButton} onclick={windowMenu.toggle}>Window</button>
	<ContextMenu bind:this={windowMenu} top="2rem" left="6rem" openers={[windowButton]}>
		<button onclick={preferences}>
			<span>Preferences</span>
			<span>Ctrl+.</span>
		</button>
	</ContextMenu>

	<button bind:this={helpButton} onclick={helpMenu.toggle}>Help</button>
	<ContextMenu bind:this={helpMenu} top="2rem" left="10rem" openers={[helpButton]}>
		<a href="https://github.com/vi013t/manim-interactive" target="_blank">Manim Interactive Documentation</a>
		<a href="https://docs.manim.community/en/stable/tutorials/quickstart.html" target="_blank">Manim Documentation</a>
	</ContextMenu>

	<div class="video-options">
		<button
			onclick={togglePreference("lowRes")}
			title="Toggle Low Resolution (faster reload times)"
			style:background-color={getPreferences().lowRes ? "rgba(180, 150, 255, 20%)" : "transparent"}
		>
			<ResolutionIcon stroke="#9399b2" style="width: 1.25rem; height: 1.25rem;" />
		</button>
		<button onclick={togglePreference("grid")} title="Toggle Grid" style:background-color={getPreferences().grid ? "rgba(180, 150, 255, 20%)" : "transparent"}>
			<GridIcon stroke="#9399b2" style="width: 1.25rem; height: 1.25rem;" />
		</button>
	</div>

	<span class="title">{getProjectName() ?? "Untitled Project"} - Manim Interactive</span>

	<div class="window-buttons">
		<button onclick={minimize}>
			<MinimizeIcon stroke="#cdd6f4" style="height: 0.7rem; width: 0.7rem;" />
		</button>
		<button onclick={maximize}>
			<UnmaximizeIcon stroke="#cdd6f4" style="height: 0.7rem; width: 0.7rem;" />
		</button>
		<button onclick={close}>
			<CloseIcon stroke="#cdd6f4" style="height: 0.7rem; width: 0.7rem;" />
		</button>
	</div>
</nav>

<NewProjectWindow bind:this={newProjectWindow} />
<PreferencesWindow bind:this={preferencesWindow} />
<ProjectSettingsWindow bind:this={projectSettingsWindow} />

<style>
	button:has(> span) {
		display: flex;

		> *:last-child {
			margin-left: auto;
			color: #9399b2;
		}
	}

	.video-options {
		display: flex;
		height: 100%;
		align-items: center;
		position: absolute;
		left: 16.67vw;

		> * {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			aspect-ratio: 1;
		}
	}

	nav {
		font-size: 0.75rem;
		display: flex;
		background-color: #11111b;
		color: #cdd6f4;
		padding-left: 0.5em;
		position: relative;

		img {
			height: 1.75rem;
			width: 1.75rem;
		}

		> button,
		a {
			font-size: 0.75rem;
			color: inherit;
			padding: 0.5rem;
			padding-left: 1em;
			padding-right: 1em;
			text-decoration: none;

			&:hover {
				background: rgba(180, 150, 255, 10%);
			}
		}
	}

	.title {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.window-buttons {
		height: 100%;
		margin-left: auto;
		display: flex;
		align-items: center;
		padding: 0px;

		> * {
			padding-left: 0.75rem;
			padding-right: 0.75rem;
			height: 100%;

			&:hover {
				background: rgba(180, 150, 255, 10%);
			}
		}
	}
</style>
