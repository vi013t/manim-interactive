<script>
	import CloseIcon from "../icons/CloseIcon.svelte";

	let { close } = $props();
</script>

<nav>
	<div class="window-buttons">
		<button onclick={close}>
			<CloseIcon stroke="#cdd6f4" style="height: 1rem; width: 1rem;" />
		</button>
	</div>
</nav>

<style>
	nav {
		display: flex;
		width: 100%;
		background-color: #11111b;
		flex-direction: row-reverse;

		button {
			padding: 0.5rem;
		}
	}
</style>
