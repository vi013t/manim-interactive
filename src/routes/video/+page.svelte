<script lang="ts">
	import { getFromCache } from "../../api/client.svelte";
	import { deserializeProject } from "../../api/project.svelte";
	import VideoPanel from "../../components/panels/video/VideoPanel.svelte";

	deserializeProject(localStorage.getItem("project")!);

	setInterval(() => {
		if (localStorage.getItem("reloadProject")) {
			deserializeProject(localStorage.getItem("project")!);
			localStorage.removeItem("reloadProject");
		}
	}, 100);
</script>

<div data-tauri-drag-region style:--after-outline={getFromCache("videoPipAlwaysOnTop") ? "4px solid var(--lavender)" : "none"}>
	<VideoPanel draggable />
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		background-color: var(--crust);

		&::after {
			content: "";
			position: absolute;
			left: 0px;
			top: 0px;
			width: 100%;
			height: 100%;
			z-index: 99999;
			outline-offset: -4px;
			outline: var(--after-outline);
			pointer-events: none;
		}
	}
</style>
