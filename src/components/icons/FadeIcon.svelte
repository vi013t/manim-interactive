<script lang="ts">
	let { stroke, ...rest } = $props();
</script>

<svg
	{...rest}
	fill={stroke}
	viewBox="0 0 32 32"
	id="icon"
	xmlns="http://www.w3.org/2000/svg"
>
	<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
	<g
		id="SVGRepo_tracerCarrier"
		stroke-linecap="round"
		stroke-linejoin="round"
	></g>
	<g id="SVGRepo_iconCarrier">
		<defs>
			<style>
				.cls-1 {
					fill: none;
				}
			</style>
		</defs>
		<path
			d="M26,4H6A2.0023,2.0023,0,0,0,4,6V26a2.0023,2.0023,0,0,0,2,2H26a2.0023,2.0023,0,0,0,2-2V6A2.0023,2.0023,0,0,0,26,4ZM22,26V22H18v4H14V22H10V18h4V14H10V10h4V6h4v4h4V6h4V26Z"
		></path>
		<rect x="14" y="10" width="4" height="4"></rect>
		<rect x="14" y="18" width="4" height="4"></rect>
		<rect x="18" y="14" width="4" height="4"></rect>
		<rect
			id="_Transparent_Rectangle_"
			data-name="<Transparent Rectangle>"
			class="cls-1"
			width="32"
			height="32"
		></rect>
	</g>
</svg>
