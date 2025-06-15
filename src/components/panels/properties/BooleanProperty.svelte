<script lang="ts">
	let { value = $bindable() }: { value: boolean } = $props();
</script>

<button style:width="20rem" style:background-color={value ? "#a6e3a1" : "var(--red)"} onclick={() => (value = !value)} class="boolean-button">
	{value ? "Yes" : "No"}
</button>

<style>
	.boolean-button {
		border-radius: 0.5rem;
		color: var(--crust);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		padding: 0.2rem;
	}
</style>
