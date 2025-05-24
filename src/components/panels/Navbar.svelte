<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { sep } from "@tauri-apps/api/path";
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { open } from "@tauri-apps/plugin-dialog";
	import { generateCode } from "../../api/codegen.svelte";
	import { getProjectLocation, getProjectName, loadProjectData, saveProjectData, setProjectLocation, setProjectName } from "../../api/project.svelte";
	import icon from "../../assets/icon.png";
	import ContextMenu from "../ContextMenu.svelte";
	import CloseIcon from "../icons/CloseIcon.svelte";
	import MinimizeIcon from "../icons/MinimizeIcon.svelte";
	import UnmaximizeIcon from "../icons/UnmaximizeIcon.svelte";
	import NewProjectWindow from "../windows/NewProjectWindow.svelte";

	let projectButton: HTMLElement;
	let windowButton: HTMLElement;
	let projectMenu: ContextMenu;
	let windowMenu: ContextMenu;

	async function saveProject() {
		projectMenu.hide();

		let projectData = saveProjectData();
		await invoke("save_project_data", {
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
	}

	async function openProject() {
		projectMenu.hide();
		const selected = await open({
			directory: true,
			multiple: false,
			title: "Select a directory",
		});

		// Directory Chosen
		if (typeof selected === "string") {
			setProjectLocation(selected);
			let components = selected.split(sep());
			setProjectName(components[components.length - 1]);
			loadProjectData(await invoke("get_project_data", { path: selected }));
		}

		// No directory chosen
		else {
			console.log("No directory selected");
		}
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

	function newProject() {
		newProjectWindow.openWindow();
		projectMenu.hide();
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
	</ContextMenu>

	<button bind:this={windowButton} onclick={windowMenu.toggle}>Window</button>
	<ContextMenu bind:this={windowMenu} top="2rem" left="6rem" openers={[windowButton]}>
		<button>Preferences</button>
	</ContextMenu>

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

<style>
	button:has(> span) {
		display: flex;

		> *:last-child {
			margin-left: auto;
			color: #9399b2;
		}
	}

	nav {
		font-size: 0.75rem;
		display: flex;
		grid-area: nav;
		background-color: #11111b;
		color: #cdd6f4;
		padding-left: 0.5em;
		position: relative;

		img {
			height: 1.75rem;
			width: 1.75rem;
		}

		> button {
			font-size: inherit;
			color: inherit;
			padding: 0.5rem;
			padding-left: 1em;
			padding-right: 1em;

			&:hover {
				background: rgba(255, 255, 255, 8%);
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
				background: rgba(255, 255, 255, 8%);
			}
		}
	}
</style>
