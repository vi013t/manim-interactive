<script lang="ts">
	let { value, name } = $props();

	let is3D = $state(false);
</script>

<span class="coordinate">
	<span>
		X: <input type="text" />
	</span>
	<span>
		Y: <input type="text" />
	</span>

	{#if is3D}
		<span class="three-d">
			Z: <input type="text" />
		</span>
		<button onclick={() => (is3D = false)}>2D</button>
	{:else}
		<button onclick={() => (is3D = true)}>3D</button>
	{/if}
</span>

<style>
	input,
	button {
		color: #cdd6f4;
		background: #11111b;
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 4.5rem;
	}

	button {
		background-image: linear-gradient(to bottom, #b4befe, #89b4fa);
		color: #11111b;
	}

	.coordinate:has(> .three-d) input {
		width: 4rem;
	}

	.coordinate:not(:has(> .three-d)) input {
		width: 7rem;
	}

	button {
		justify-content: center;
	}

	span {
		align-items: center;
	}

	.coordinate {
		width: 20rem;
		gap: 0.5rem;

		span {
			gap: 0.25rem;
		}
	}
</style>
