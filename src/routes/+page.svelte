<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { onMount } from "svelte";
	import { updateMouseCoordinates } from "../api/client.svelte";
	import { getPreferences, loadPreferences, savePreferences } from "../api/preferences.svelte";
	import { loadProjectData, setProjectLocation } from "../api/project.svelte";
	import AddMenu from "../components/menus/AddMenu.svelte";
	import Notifications from "../components/Notifications.svelte";
	import Navbar from "../components/panels/Navbar.svelte";
	import Objects from "../components/panels/objects/Objects.svelte";
	import Properties from "../components/panels/properties/Properties.svelte";
	import Timeline from "../components/panels/timeline/Timeline.svelte";
	import VideoPanel from "../components/panels/video/VideoPanel.svelte";

	let mouseX: number;
	let mouseY: number;

	let top: string;
	let left: string;
	let menu: AddMenu;

	// Preferences
	if (localStorage.getItem("manim-interactive-preferences")) loadPreferences();
	else savePreferences();

	if (getPreferences().autoOpenLastProject) {
		let projectLocation = localStorage.getItem("last-project");
		if (projectLocation) setProjectLocation(projectLocation);
		invoke<string>("get_project_data", { path: projectLocation }).then(loadProjectData);
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
	});
</script>

<main>
	<Navbar />
	<div class="container">
		<Objects />
		<div class="inner">
			<VideoPanel />
			<Properties />
		</div>
		<Timeline />
	</div>
	<AddMenu bind:this={menu} {top} {left} />
</main>
<Notifications />

<style>
	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.container {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 4fr 1fr;
		grid-template-rows: 1fr;
		height: 100%;
	}

	.inner {
		display: flex;
		flex-direction: column;
	}
</style>
