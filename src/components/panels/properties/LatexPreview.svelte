<script lang="ts">
	//@ts-ignore
	import { HtmlGenerator, parse } from "latex.js";

	let { latex, show } = $props();
	let latexHTML = $derived.by(() => {
		try {
			let generator = new HtmlGenerator({ hyphenate: false });
			let body = parse(`$$${latex}$$`, { generator: generator }).htmlDocument().getElementsByClassName("body")[0];
			body!.classList.add("latex");
			return body.outerHTML;
		} catch (error) {
			return "";
		}
	});
</script>

<div class="latex-container" style:display={show ? "block" : "none"}>
	{#if latexHTML}
		{@html latexHTML}
	{/if}
</div>

<style>
	.latex-container {
		bottom: calc(100% + 1rem);
		left: 50%;
		transform: translateX(-50%);
		position: absolute;
	}

	:global(.latex) {
		background-color: #11111b;
		width: fit-content;
		height: fit-content;
		padding: 1rem;
		border-radius: 0.5rem;
		font-size: 1.5rem;
		box-shadow: 0px 0px 1rem black;
		border: 2px solid #1e1e2e;

		:global(&, *) {
			font-family: "CMU Serif"
		}

		:global(.katex-html) {
			display: none;
		}

		&::after {
			content: "";
			display: block;
			width: 1rem;
			height: 1rem;
			background: #11111b;
			position: absolute;
			top: 100%;
			left: 50%;
			transform: translate(-50%, -3px);
			rotate: 45deg;
			border-bottom: 2px solid #1e1e2e;
			border-right: 2px solid #1e1e2e;
		}
	}
</style>
