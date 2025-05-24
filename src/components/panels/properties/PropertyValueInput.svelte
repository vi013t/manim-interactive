<script lang="ts">
	let { propertyType, defaultValue } = $props();

	let inputType = propertyType === "color" ? "color" : "text";
</script>

<input type={inputType} placeholder={defaultValue} />
