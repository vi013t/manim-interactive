<script lang="ts">
	import { listen } from '@tauri-apps/api/event';
	import { getFromCache } from "../../api/client.svelte";
	import { setProject, type Project } from "../../api/project.svelte";
	import CloseIcon from "../../components/icons/CloseIcon.svelte";
	import VideoPanel from "../../components/panels/video/VideoPanel.svelte";

	listen<Project>("data", data => {
		console.log("Received data in webview");
		setProject(data.payload);
	});
</script>

<div data-tauri-drag-region style:outline={getFromCache("videoPipAlwaysOnTop") ? "4px solid red" : "none"}>
	<VideoPanel draggable />
	<button>
		<CloseIcon stroke="white" style="width: 1rem; height: 1rem;" />
	</button>
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		background-color: var(--crust);
		outline-offset: -4px;
	}

	button {
		position: absolute;
		top: 1rem;
		right: 1rem;

		&::before {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			width: 100%;
			height: 100%;
			transform: translate(-50%, -50%);
		}
	}
</style>
