<script lang="ts">
	import { onMount } from "svelte";
	import AddMenu from "../components/menus/AddMenu.svelte";
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
	onMount(() => {
		document.addEventListener("mousemove", event => {
			mouseX = event.clientX;
			mouseY = event.clientY;
		});

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
