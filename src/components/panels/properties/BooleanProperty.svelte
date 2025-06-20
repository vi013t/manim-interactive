<script lang="ts">
	let { locked, value = $bindable(), width, setProperty }: { locked: boolean; value: boolean; width: string; setProperty(value: unknown): void } = $props();

	function trySetProperty() {
		setProperty(inputValue);
	}

	let inputValue = $state(value);
</script>

<button
	style:width
	style:background-color={value ? "#a6e3a1" : "var(--red)"}
	onclick={() => {
		if (locked) return;
		inputValue = !inputValue;
		trySetProperty();
	}}
	style:cursor={locked ? "not-allowed" : "pointer"}
	class="boolean-button"
>
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
