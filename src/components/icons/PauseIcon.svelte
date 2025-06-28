<script lang="ts">
	let { stroke, ...rest } = $props();
</script>

<svg {...rest} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
	<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
	<g id="SVGRepo_iconCarrier">
		<path d="M7 1H2V15H7V1Z" fill={stroke}></path>
		<path d="M14 1H9V15H14V1Z" fill={stroke}></path>
	</g>
</svg>
