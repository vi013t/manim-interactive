<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { cache, getFromCache, type CacheKey } from "../../api/client.svelte";
	import { getPreferences, runAction, savePreferences, setPreference, type Preference } from "../../api/preferences.svelte";
	import { getExplicitProjectLocation, getProjectLocation, getProjectName, getProjectSettings } from "../../api/project.svelte";
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
	import SlidesIcon from "../icons/SlidesIcon.svelte";
	import UnmaximizeIcon from "../icons/UnmaximizeIcon.svelte";
	import ContextMenu from "../menus/ContextMenu.svelte";
	import Tooltip from "../util/Tooltip.svelte";
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
			savePreferences();
		};
	}

	function toggleCachePreference(preferenceName: CacheKey<boolean>) {
		return function () {
			cache(preferenceName, !getFromCache(preferenceName));
			if (preferenceName === "lowRes" && getPreferences().autosave) runAction("Save And Recompile Project");
		};
	}

	async function openMovieLocation() {
		invoke("open_movie_location", {
			projectPath: await getProjectLocation(),
			lowRes: getFromCache("lowRes"),
			outputFileName: getProjectSettings().outputFileName,
			fileFormat: getProjectSettings().fileFormat,
			resolutionHeight: getProjectSettings().resolution[1],
			fps: getProjectSettings().fps,
		});
		projectMenu.hide();
	}
</script>

<nav id="navbar" oncontextmenu={event => event.preventDefault()} data-tauri-drag-region>
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
		<button class="first-disableable" disabled={getExplicitProjectLocation() === null} onclick={saveProject}>
			<span>{translate("Save Project")}</span>
			{#if getExplicitProjectLocation()}
				<span>Ctrl+S</span>
			{/if}
		</button>
		<button disabled={getExplicitProjectLocation() === null} onclick={projectSettings}>
			<span>{translate("Project Settings")}</span>
			{#if getExplicitProjectLocation()}
				<span>Ctrl+,</span>
			{/if}
		</button>
		<button disabled={getExplicitProjectLocation() === null} onclick={openMovieLocation}>
			<span>{translate("Open Movie File Folder")}</span>
			{#if getExplicitProjectLocation()}
				<span>Ctrl+E</span>
			{/if}
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

	{#if getExplicitProjectLocation()}
		<div class="video-options">
			<Tooltip text="Toggle low resolution (for faster load times)" element="button" onclick={toggleCachePreference("lowRes")} class={getFromCache("lowRes") ? "option-on" : ""}>
				<ResolutionIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
			</Tooltip>
			<Tooltip text="Toggle grid overlay" element="button" onclick={toggleCachePreference("grid")} class={getFromCache("grid") ? "option-on" : undefined}>
				<GridIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
			</Tooltip>
			<Tooltip
				text="Toggle showing main movie over selected item preview"
				element="button"
				onclick={toggleCachePreference("showMovieOverPreview")}
				class={getFromCache("showMovieOverPreview") ? "option-on" : undefined}
			>
				<ProjectorIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
			</Tooltip>
		</div>

		<div class="timeline-options">
			<Tooltip text="Toggle timeline snapping" element="button" onclick={togglePreference("timelineSnapping")} class={getPreferences().timelineSnapping ? "option-on" : undefined}>
				<MagnetIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
			</Tooltip>
			<Tooltip
				text="Toggle collapsing wait times"
				element="button"
				onclick={togglePreference("collapseWaitTimes")}
				class={getPreferences().collapseWaitTimes ? "option-on" : undefined}
			>
				<CollapseIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
			</Tooltip>
			<Tooltip text="Toggle showing waits" element="button" onclick={togglePreference("showWaits")} class={getPreferences().showWaits ? "option-on" : undefined}>
				<ClockCheckIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
			</Tooltip>
			<Tooltip text="Toggle slides mode" element="button" onclick={toggleCachePreference("slidesMode")} class={getFromCache("slidesMode") ? "option-on" : undefined}>
				<SlidesIcon stroke="var(--overlay-2)" style="width: 1.25rem; height: 1.25rem;" />
			</Tooltip>
		</div>
	{/if}

	<span class="title" data-tauri-drag-region>{getProjectName() ? `${getProjectName()} - ` : ""}{translate("Manim Interactive")}</span>

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

		> *:last-child:not(:first-child) {
			margin-left: auto;
			color: var(--overlay-2);
		}
	}

	button[disabled] {
		cursor: default;
		color: var(--overlay-0);

		&:hover {
			background-color: inherit;
		}

		&.first-disableable {
			border-top: 1px solid var(--surface-0);
		}
	}

	.video-options,
	.timeline-options {
		display: flex;
		height: 100%;
		align-items: center;
		position: absolute;

		:global(> *) {
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

	:global(.option-on) {
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
