<script lang="ts">
	import type { CompoundProperty } from "../../../api/manim/property";
	import PropertyValueInput from "./PropertyValueInput.svelte";

	let { value = $bindable(), property, name }: { value: unknown; name: string; property: CompoundProperty } = $props();
</script>

<div class="compound">
	{#each Object.entries(property.subProperties) as [propertyName, propertyValue]}
		<PropertyValueInput type={propertyValue} name={propertyName} required value={(propertyValue as any).defaultValue} subProperty />
	{/each}
</div>

<style>
	.compound {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
