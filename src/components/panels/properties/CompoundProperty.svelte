<script lang="ts">
	import type { CompoundProperty } from "../../../api/manim/property";
	import PropertyValueInput from "./PropertyValueInput.svelte";

	let {
		value = $bindable(),
		property,
		width,
		locked,
		onError,
		onErrorFixed,
	}: { value: unknown; locked: boolean; width: string; property: CompoundProperty; onErrorFixed(): void; onError(): void } = $props();
</script>

<div class="compound" style:width>
	{#each Object.entries(property.subProperties) as [propertyName, propertyValue]}
		<PropertyValueInput
			{locked}
			width="calc({width} / {Object.keys(property.subProperties).length})"
			type={propertyValue}
			name={propertyName}
			required
			value={(propertyValue as any).defaultValue}
			subProperty
			{onError}
			{onErrorFixed}
		/>
	{/each}
</div>

<style>
	.compound {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
