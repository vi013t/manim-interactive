<script lang="ts">
	let { stroke, ...rest } = $props();
</script>

<svg {...rest} fill={stroke} viewBox="0 0 24 24" id="rainbow-2" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color">
	<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
	<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
	<g id="SVGRepo_iconCarrier">
		<path id="primary" d="M9,21a6,6,0,0,0-6-6V3A18,18,0,0,1,21,21Z" style="fill: none; stroke: {stroke}; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path>
	</g>
</svg>
