<script lang="ts">
	let { stroke, ...rest } = $props();
</script>

<svg
	{...rest}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
	<g
		id="SVGRepo_tracerCarrier"
		stroke-linecap="round"
		stroke-linejoin="round"
	></g>
	<g id="SVGRepo_iconCarrier">
		<g id="Arrow / Shrink">
			<path
				id="Vector"
				d="M5 14H10V19M19 10H14V5"
				{stroke}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
		</g>
	</g>
</svg>
