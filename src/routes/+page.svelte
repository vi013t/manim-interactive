<script lang="ts">
	import Navbar from "../components/Navbar.svelte";
	import Objects from "../components/Objects.svelte";
	import Properties from "../components/Properties.svelte";
	import Timeline from "../components/Timeline.svelte";
</script>

<main>
	<Navbar />
	<div class="container">
		<Objects />
		<div class="inner">
			<!-- svelte-ignore a11y_media_has_caption -->
			<video oncontextmenu={event => event.preventDefault()} controls id="video-source"></video>
			<Properties />
		</div>
		<Timeline />
	</div>
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

	#video-source {
		width: 100%;
		aspect-ratio: 1.78;
	}
</style>
