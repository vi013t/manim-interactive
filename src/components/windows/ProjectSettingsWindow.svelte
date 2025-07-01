<script lang="ts">
	import { closeProjectSettingsWindow, isProjectSettingsWindowOpen, openProjectSettingsWindow } from "../../api/client.svelte";
	import { getProject } from "../../api/project.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import PackageIcon from "../icons/PackageIcon.svelte";
	import ProjectorIcon from "../icons/ProjectorIcon.svelte";
	import Select from "../util/Select.svelte";
	import Window from "./Window.svelte";

	let windowComponent: Window;

	export function openWindow() {
		openProjectSettingsWindow();
	}

	let view = $state("general");
	let hoverView: string | null = $state(null);

	function isUserTyping() {
		const active = document.activeElement as HTMLElement;

		if (!active) return false;

		// Check if active element is an input, textarea, or contenteditable
		const isInputOrTextarea = active.tagName === "INPUT" || active.tagName === "TEXTAREA";
		const isContentEditable = active.isContentEditable;

		return isInputOrTextarea || isContentEditable;
	}

	function backgroundColor(viewName: string) {
		return view === viewName ? "rgba(180, 150, 255, 20%)" : hoverView === viewName ? "rgba(180, 150, 255, 10%)" : "transparent";
	}

	function unHover(viewName: string) {
		return function () {
			if (hoverView === viewName) hoverView = null;
		};
	}

	function setOutputWidth(event: FocusEvent) {
		getProject().settings.resolution[0] = Number((event.target as HTMLInputElement).value);
	}

	function setOutputHeight(event: FocusEvent) {
		getProject().settings.resolution[1] = Number((event.target as HTMLInputElement).value);
	}

	$effect(() => {
		if (isProjectSettingsWindowOpen()) {
			windowComponent.openWindow();
		} else {
			windowComponent.close();
		}
	});
</script>

<Window onClose={closeProjectSettingsWindow} bind:this={windowComponent} title="Project Settings" style="width: 60rem; height: 40rem; padding-bottom: 0px;">
	<div class="container">
		<!-- svelte-ignore a11y_mouse_events_have_key_events -->
		<div class="sidebar">
			<button onmouseout={unHover("general")} onmouseover={() => (hoverView = "general")} style:background={backgroundColor("general")} onclick={() => (view = "general")}>
				<GearIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				General
			</button>
			<button onmouseout={unHover("output")} onmouseover={() => (hoverView = "output")} style:background={backgroundColor("output")} onclick={() => (view = "output")}>
				<ProjectorIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
				Output Settings
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
			{:else if view === "output"}
				<h1>Output Settings</h1>
				<span>
					<span>File Name:</span>
					<input type="text" value="Main" />
				</span>
				<span>
					<span>File Type:</span>
					<Select options={["mp4", "mov", "webm"]} value={getProject().settings.fileFormat} onSelect={format => (getProject().settings.fileFormat = format as any)} />
				</span>
				<span>
					<span>Renderer:</span>
					<Select options={["Cairo", "OpenGL"]} value={getProject().settings.renderer} onSelect={renderer => (getProject().settings.renderer = renderer as any)} />
				</span>
				<span>
					<span>Frames Per Second:</span>
					<input type="text" value={getProject().settings.fps} />
					<Select
						title="Presets"
						style="width: 7rem"
						onSelect={value => {
							getProject().settings.fps = Number(value);
						}}
						options={["15", "24", "30", "59", "60"]}
					/>
				</span>
				<span class="resolution">
					<span>Resolution:</span>
					<input onblur={setOutputWidth} type="text" value={getProject().settings.resolution[0]} />
					<span class="x">x</span>
					<input onblur={setOutputHeight} type="text" value={getProject().settings.resolution[1]} />
					<Select
						title="Presets"
						style="width: 7rem"
						onSelect={value => {
							let [width, _x, height] = value.split(" ");
							getProject().settings.resolution = [Number(width), Number(height)];
						}}
						options={["854 x 480", "1280 x 720", "1920 x 1080", "2560 x 1440", "3840 x 2160"]}
					/>
				</span>
			{:else if view === "libraries"}
				<h1>External Libraries</h1>
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

	.content > span {
		margin-left: 2rem;
		gap: 0.5rem;

		& > span:not(.x) {
			width: 12rem;
			justify-content: right;
		}
	}


	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		> *:not(.resolution) {
			input {
				width: 20rem;
				background-color: var(--crust);
				padding: 0.25rem;
				border-radius: 0.25rem;
				color: var(--text);
			}
		}

		.resolution > input {
			width: 9.3rem;
			background-color: var(--crust);
			padding: 0.25rem;
			border-radius: 0.25rem;
			color: var(--text);
		}
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
			gap: 1rem;
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
