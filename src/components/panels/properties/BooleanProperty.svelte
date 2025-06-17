<script lang="ts">
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getPropertiesFromId, selected } from "../../../api/project.svelte";

	let { value = $bindable(), name }: { value: boolean; name: string } = $props();

	function setProperty() {
		(getPropertiesFromId(selected()![0])! as any)[name] = inputValue;
		if (getPreferences().autosave) runAction("Save And Recompile Project");
	}

	let inputValue = $state(value);
</script>

<button
	style:width="20rem"
	style:background-color={value ? "#a6e3a1" : "var(--red)"}
	onclick={() => {
		inputValue = !inputValue;
		setProperty();
	}}
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
