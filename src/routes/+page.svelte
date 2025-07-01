<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { onMount } from "svelte";
	import { cache, getFromCache, getMouseX, getMouseY, showNewProjectWindow, updateMouseCoordinates } from "../api/client.svelte";
	import { getPreferences, loadPreferences, runAction, savePreferences } from "../api/preferences.svelte";
	import { deserializeProject, getExplicitProjectLocation, setProjectLocation } from "../api/project.svelte";
	import { checkRequirements, loadFonts } from "../api/system.svelte";
	import { loadTheme } from "../api/theme.svelte";
	import AddMenu from "../components/menus/AddMenu.svelte";
	import Notifications from "../components/Notifications.svelte";
	import Navbar from "../components/panels/Navbar.svelte";
	import Objects from "../components/panels/objects/Objects.svelte";
	import Properties from "../components/panels/properties/Properties.svelte";
	import Timeline from "../components/panels/timeline/Timeline.svelte";
	import VariablesPanel from "../components/panels/variables/VariablesPanel.svelte";
	import VideoPanel from "../components/panels/video/VideoPanel.svelte";

	let mouseX: number;
	let mouseY: number;

	let top: string;
	let left: string;
	let menu: AddMenu;

	getCurrentWindow().listen("close-pip", event => {
		cache("videoState", "normal");
	});

	// Preferences
	if (localStorage.getItem("preferences")) loadPreferences();
	else savePreferences();

	if (getPreferences().autoOpenLastProject) {
		let projectLocation = localStorage.getItem("last-project");
		if (projectLocation) setProjectLocation(projectLocation);
		invoke<string>("get_project_data", { path: projectLocation }).then(deserializeProject);
	}

	onMount(() => {
		document.addEventListener("mousemove", event => {
			mouseX = event.clientX;
			mouseY = event.clientY;

			updateMouseCoordinates(event.clientX, event.clientY);
		});

		document.addEventListener("contextmenu", event => event.preventDefault());

		document.addEventListener("keypress", event => {
			if (event.key === "A") {
				top = `${mouseY}px`;
				left = `${mouseX}px`;
				menu.show();
			}
		});

		loadTheme();
		loadFonts();
		checkRequirements();
	});

	function unpipVideo() {
		getFromCache("videoPipWindow")!.close();
		cache("videoState", "normal");
	}
</script>

<main>
	<Navbar />
	{#if getExplicitProjectLocation()}
		<div class="container">
			<Objects />
			<div class="inner">
				{#if getFromCache("videoState") !== "pip"}
					<VideoPanel />
				{:else}
					<div class="video-popped-out">
						<h1>Video Popped Out</h1>
						<p>The video is currently popped out in it's own Picture-in-Picture window.</p>
						<button onclick={unpipVideo}>Bring Video Back</button>
					</div>
				{/if}
				<div class="bottom"><Properties /><VariablesPanel /></div>
			</div>
			{#if getFromCache("videoState") !== "fullscreen"}
				<Timeline />
			{/if}
		</div>
		<AddMenu bind:this={menu} top="{getMouseY()}px" left="{getMouseX()}px" />
	{:else}
		<div class="no-project">
			<h1>No Project Open</h1>
			<p>When you create or open a project, it will appear here.</p>
			<span>
				<button onclick={showNewProjectWindow}>Create Project</button>
				<button onclick={() => runAction("Open Project")}>Open Project</button>
			</span>
		</div>
	{/if}
</main>
<Notifications />

<style>
	.video-popped-out {
		width: 100%;
		display: flex;
		padding: 3rem;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--crust);
		gap: 1rem;

		h1 {
			color: var(--text);
			font-size: 2rem;
		}

		p {
			color: var(--overlay-0);
			font-size: 1.25rem;
		}

		button {
			padding-left: 1em;
			padding-right: 1em;
			padding-top: 0.5em;
			padding-bottom: 0.5em;
			font-size: 1.25rem;
			border-radius: 0.5em;
			box-shadow: 0px 0px 0.5em black;
			transition: scale 0.2s;
			background-image: linear-gradient(to bottom, var(--lavender), var(--blue));
			margin-top: 3rem;

			&:hover {
				scale: 1.05;
			}
		}
	}

	.no-project {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-image: linear-gradient(to bottom, var(--base), var(--crust));
		gap: 1rem;

		h1 {
			color: var(--text);
			font-size: 3rem;
		}

		p {
			color: var(--overlay-0);
			font-size: 1.5rem;
		}

		span {
			display: flex;
			gap: 3rem;
			margin-top: 3rem;

			button {
				padding-left: 1em;
				padding-right: 1em;
				padding-top: 0.5em;
				padding-bottom: 0.5em;
				font-size: 1.5rem;
				border-radius: 0.5em;
				box-shadow: 0px 0px 0.5em black;
				transition: scale 0.2s;

				&:hover {
					scale: 1.05;
				}

				&:first-child {
					background-image: linear-gradient(to bottom, var(--lavender), var(--blue));
				}

				&:last-child {
					background-image: linear-gradient(to bottom, var(--peach), var(--red));
				}
			}
		}
	}

	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.bottom {
		display: flex;
		height: 100%;
		width: 100%;
	}

	.container {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 66.66666%;
	}
</style>
