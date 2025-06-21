<script lang="ts">
	import { onMount, untrack } from "svelte";

	let {
		children,
		top = undefined,
		left = "0px",
		width = "15rem",
		background = "var(--mantle)",
		openers = [],
		bottom = undefined,
		onHide = () => {},
		getVisible = undefined,
		setVisible = undefined,
	}: {
		children: () => any;
		top?: string;
		left?: string;
		width?: string;
		background?: string;
		openers?: HTMLElement[];
		bottom?: string;
		onHide?: () => void;
		getVisible?: () => boolean;
		setVisible?: (visible: boolean) => void;
	} = $props();

	let left_ = $state(left);
	let top_ = $state(top);

	let visible = $state(false);

	export function show() {
		left_ = left;
		top_ = top;
		setVisible?.(true);
		visible = true;
	}

	export function hide() {
		setVisible?.(false);
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

	export function isVisible(): boolean {
		return getVisible?.() ?? visible;
	}

	export function element(): HTMLElement {
		return menu;
	}

	let styleString = $derived(top ? `top: ${top_};` : `bottom: ${bottom};`);

	$effect(() => {
		if (getVisible?.()) {
			left_ = untrack(() => left);
			top_ = untrack(() => top);
		}
	});
</script>

<section
	class="context-menu"
	style:min-width={width}
	bind:this={menu}
	style={styleString}
	style:background-color={background}
	style:display={isVisible() ? "flex" : "none"}
	style:left={left_}
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
			color: var(--text);
			text-align: left;
			padding: 0.4em;
			padding-left: 2em;
			padding-right: 2em;
			width: 100%;
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
