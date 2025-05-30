<script lang="ts">
	import { onMount } from "svelte";

	let { children, top = undefined, left = "0px", background = "#181825", openers = [], bottom = undefined, onHide = () => {} } = $props();

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
				onHide();
			}
		});
	});

	export function element(): HTMLElement {
		return menu;
	}

	let styleString = $derived(top ? `top: ${top};` : `bottom: ${bottom};`);
</script>

<section bind:this={menu} style={styleString} style:background-color={background} style:display={visible ? "flex" : "none"} style:left>
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

		:global(> *:last-child) {
			border-bottom-left-radius: 0.5em;
			border-bottom-right-radius: 0.5em;
		}
	}
</style>
