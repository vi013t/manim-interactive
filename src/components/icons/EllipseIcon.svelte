<script lang="ts">
	let { stroke, ...rest } = $props();
</script>

<svg
	{...rest}
	viewBox="0 0 48 48"
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
		<ellipse
			cx="24"
			cy="24"
			rx="14"
			ry="20"
			{stroke}
			stroke-width="4"
		></ellipse>
	</g>
</svg>
