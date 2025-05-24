<script lang="ts">
	import { onMount } from "svelte";

	let { children, top = "0px", left = "0px", background = "#181825", openers = [] } = $props();

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

	let menu: HTMLElement;

	onMount(() => {
		document.addEventListener("click", event => {
			if (!event.composedPath().includes(menu) && openers.every(opener => !event.composedPath().includes(opener))) {
				hide();
			}
		});
	});
</script>

<section bind:this={menu} style:background-color={background} style:display={visible ? "flex" : "none"} style:top style:left>
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
		}

		:global(> *:not(span):hover) {
			background: rgba(180, 150, 255, 10%);
		}

		:global(> span) {
			cursor: default;
		}
	}
</style>
