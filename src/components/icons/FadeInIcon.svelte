<script lang="ts">
	import FadeIcon from "./FadeOutIcon.svelte";

	let props: any = $props();
	props = { ...props };

	if (!props.style) props.style = "";
	props.style = `rotate: 180deg; ${props.style}`;
</script>

<FadeIcon {...props} />
