<script lang="ts">
	import { setDeveloperMode } from "../../api/preferences.svelte";
	import Window from "./Window.svelte";

	let windowComponent: Window;

	export function openWindow() {
		windowComponent.openWindow();
	}

	let view = $state("appearance");

	// svelte-ignore non_reactive_update
	let developerMode: HTMLInputElement;
</script>

<Window bind:this={windowComponent} style="width: 50rem; height: 40rem; padding-bottom: 0px;">
	<h1>Preferences</h1>
	<div class="container">
		<div class="sidebar">
			<button onclick={() => (view = "appearance")}>Appearance</button>
			<button onclick={() => (view = "timeline")}>Timeline</button>
			<button onclick={() => (view = "developer")}>Developer Settings</button>
		</div>
		<div class="content">
			{#if view === "appearance"}{:else if view === "developer"}
				<label for="developer-mode">
					<span>
						Developer Mode
						<input bind:this={developerMode} id="developer-mode" type="checkbox" oninput={() => setDeveloperMode(developerMode.checked)} />
					</span>
					<p>Enabling Developer mode allows adding custom scripts for animations or objects.</p>
				</label>
			{/if}
		</div>
	</div>
</Window>

<style>
	h1,
	button,
	label,
	span {
		color: #cdd6f4;
	}

	button {
		padding: 1rem;
		width: 15rem;

		&:hover {
			background: rgba(180, 150, 255, 10%);
		}
	}

	p {
		color: #6c7086;
	}

	.container {
		display: flex;
	}

	.sidebar {
		background-color: #181825;
		margin-left: -2rem;
	}

	label {
		display: flex;
		flex-direction: column;
		padding-left: 2rem;
		padding-right: 2rem;
		padding-top: 1rem;
		padding-bottom: 1rem;

		&:hover {
			background: rgba(180, 150, 255, 10%);
		}
	}

	span {
		display: flex;
	}

	input[type="checkbox"] {
		margin-left: auto;
		accent-color: #b4befe;
	}
</style>
