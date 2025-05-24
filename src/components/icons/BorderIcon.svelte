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
		<path
			d="M20 4H4L4 20M20 8H20.01M20 20H20.01M16 20H16.01M12 20H12.01M8 20H8.01M20 16H20.01M20 12H20.01"
			{stroke}
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		></path>
	</g>
</svg>
