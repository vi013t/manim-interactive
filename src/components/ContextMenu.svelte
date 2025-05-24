<script lang="ts">
	let {
		children,
		top = "0px",
		left = "0px",
		background = "#181825",
	} = $props();

	let visible = $state(false);

	export function show() {
		visible = true;
	}

	export function hide() {
		visible = false;
	}

	export function toggle() {
		if (visible) hide();
		else show();
	}
</script>

<section
	style:background-color={background}
	style:display={visible ? "flex" : "none"}
	style:top
	style:left
>
	{@render children()}
</section>

<style>
	section {
		flex-direction: column;
		position: absolute;
		border-radius: 0.5em;
		z-index: 9999;
		font-size: 1rem;

		:global(> *:not(section)) {
			color: #cdd6f4;
			text-align: left;
			padding: 0.4em;
			padding-left: 2em;
			padding-right: 2em;
			min-width: 15rem;

			&:hover {
				background: rgba(180, 150, 255, 10%);
			}
		}
	}
</style>
