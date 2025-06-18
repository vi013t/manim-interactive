<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { getPreferences, runAction, savePreferences, setPreference, type Preference } from "../../api/preferences.svelte";
	import { getProjectLocation, getProjectName, getProjectSettings } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import icon from "../../assets/icon.png";
	import ClockCheckIcon from "../icons/ClockCheckIcon.svelte";
	import CloseIcon from "../icons/CloseIcon.svelte";
	import CollapseIcon from "../icons/CollapseIcon.svelte";
	import GridIcon from "../icons/GridIcon.svelte";
	import MagnetIcon from "../icons/MagnetIcon.svelte";
	import MinimizeIcon from "../icons/MinimizeIcon.svelte";
	import ProjectorIcon from "../icons/ProjectorIcon.svelte";
	import ResolutionIcon from "../icons/ResolutionIcon.svelte";
	import UnmaximizeIcon from "../icons/UnmaximizeIcon.svelte";
	import ContextMenu from "../menus/ContextMenu.svelte";
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
		runAction("Save And Recompile Project");
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
			setPreference(preferenceName, !getPreferences()[preferenceName]);
			if (preferenceName === "lowRes" && getPreferences().autosave) runAction("Save And Recompile Project");
			savePreferences();
		};
	}

	async function openMovieLocation() {
		invoke("open_movie_location", {
			projectPath: await getProjectLocation(),
			lowRes: getPreferences().lowRes,
			outputFileName: getProjectSettings().outputFileName,
			fileFormat: getProjectSettings().fileFormat,
		});
		projectMenu.hide();
	}
</script>

<nav id="navbar" oncontextmenu={event => event.preventDefault()}>
	<img src={icon} alt="Manim Interactive" />

	<button bind:this={projectButton} onclick={projectMenu.toggle}>{translate("Project")}</button>
	<ContextMenu bind:this={projectMenu} top="2rem" left="2rem" openers={[projectButton]}>
		<button onclick={newProject}>
			<span>{translate("New Project")}</span>
			<span>Ctrl+N</span>
		</button>
		<button onclick={openProject}>
			<span>{translate("Open Project")}</span>
			<span>Ctrl+O</span>
		</button>
		<button onclick={saveProject}>
			<span>{translate("Save Project")}</span>
			<span>Ctrl+S</span>
		</button>
		<button onclick={projectSettings}>
			<span>{translate("Project Settings")}</span>
			<span>Ctrl+,</span>
		</button>
		<button onclick={openMovieLocation}>
			<span>{translate("Open Movie File Folder")}</span>
			<span>Ctrl+E</span>
		</button>
	</ContextMenu>

	<button bind:this={windowButton} onclick={windowMenu.toggle}>{translate("Window")}</button>
	<ContextMenu bind:this={windowMenu} top="2rem" left="6rem" openers={[windowButton]}>
		<button onclick={preferences}>
			<span>{translate("Preferences")}</span>
			<span>Ctrl+.</span>
		</button>
	</ContextMenu>

	<button bind:this={helpButton} onclick={helpMenu.toggle}>{translate("Help")}</button>
	<ContextMenu bind:this={helpMenu} top="2rem" left="10rem" openers={[helpButton]}>
		<a href="https://github.com/vi013t/manim-interactive" target="_blank">{translate("Manim Interactive Documentation")}</a>
		<a href="https://docs.manim.community/en/stable/tutorials/quickstart.html" target="_blank">{translate("Manim Documentation")}</a>
	</ContextMenu>

	<div class="video-options">
		<button onclick={togglePreference("lowRes")} title="Toggle Low Resolution (faster reload times)" class:option-on={getPreferences().lowRes}>
			<ResolutionIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
		</button>
		<button onclick={togglePreference("grid")} title="Toggle Grid" class:option-on={getPreferences().grid}>
			<GridIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
		</button>
		<button onclick={togglePreference("showMovieOverPreview")} title="Toggle Showing Movie Over Preview" class:option-on={getPreferences().showMovieOverPreview}>
			<ProjectorIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
		</button>
	</div>

	<div class="timeline-options">
		<button title="Toggle Timeline Snapping" onclick={togglePreference("timelineSnapping")} class:option-on={getPreferences().timelineSnapping}>
			<MagnetIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
		</button>
		<button title="Toggle Collapsing Wait Times" onclick={togglePreference("collapseWaitTimes")} class:option-on={getPreferences().collapseWaitTimes}>
			<CollapseIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
		</button>
		<button title="Toggle Showing Waits" onclick={togglePreference("showWaits")} class:option-on={getPreferences().showWaits}>
			<ClockCheckIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
		</button>
	</div>

	<span class="title">{getProjectName() ?? "Untitled Project"} - {translate("Manim Interactive")}</span>

	<div class="window-buttons">
		<button onclick={minimize}>
			<MinimizeIcon stroke="var(--text)" style="height: 0.7rem; width: 0.7rem;" />
		</button>
		<button onclick={maximize}>
			<UnmaximizeIcon stroke="var(--text)" style="height: 0.7rem; width: 0.7rem;" />
		</button>
		<button onclick={close}>
			<CloseIcon stroke="var(--text)" style="height: 0.7rem; width: 0.7rem;" />
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
			color: var(--overlay-2);
		}
	}

	.video-options,
	.timeline-options {
		display: flex;
		height: 100%;
		align-items: center;
		position: absolute;

		> * {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			aspect-ratio: 1;

			&:hover {
				background-color: rgba(180, 150, 255, 10%);
			}
		}
	}

	.option-on {
		background-color: rgba(180, 150, 255, 20%);
	}

	.video-options {
		left: 16.67%;
	}

	.timeline-options {
		left: 83.33%;
	}

	#navbar {
		font-size: 0.75rem;
		display: flex;
		background-color: var(--crust);
		color: var(--text);
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
