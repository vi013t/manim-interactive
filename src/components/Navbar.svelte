<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { generateCode, projectLocation } from "../api/codegen.svelte";
	import icon from "../assets/icon.png";
	import ContextMenu from "./ContextMenu.svelte";
	import CloseIcon from "./icons/CloseIcon.svelte";
	import MinimizeIcon from "./icons/MinimizeIcon.svelte";
	import UnmaximizeIcon from "./icons/UnmaximizeIcon.svelte";

	let projectMenu: ContextMenu;
	let windowMenu: ContextMenu;

	async function saveProject() {
		projectMenu.hide();
		await invoke("recompile", {
			projectPath: projectLocation,
			code: generateCode(),
		});

		const videoData = (await invoke("load_video", {
			path: `${projectLocation}\\media\\videos\\main\\480p15\\Main.mp4`,
		})) as string;
		document.getElementById("video-source")?.setAttribute("src", videoData);
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
</script>

<nav>
	<img src={icon} alt="Manim Interactive" />

	<button onclick={projectMenu.toggle}>Project</button>
	<ContextMenu bind:this={projectMenu} top="2rem" left="2rem">
		<button>New Project</button>
		<button>Open Project</button>
		<button onclick={saveProject}>Save Project</button>
	</ContextMenu>

	<button onclick={windowMenu.toggle}>Window</button>
	<ContextMenu bind:this={windowMenu} top="2rem" left="6rem">
		<button>Preferences</button>
	</ContextMenu>

	<span class="title">Unnamed Project - Manim Interactive</span>

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

<style>
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
