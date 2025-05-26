<script lang="ts">
	import { onMount } from "svelte";
	import Titlebar from "./Titlebar.svelte";

	let { title = "", children, ...rest }: { title?: string; children: any; [key: string]: unknown } = $props();

	let visible = $state(false);

	export function close() {
		visible = false;
	}

	export function openWindow() {
		visible = true;
	}

	let draggable: HTMLElement;

	onMount(() => {
		const handle = draggable.firstElementChild as HTMLDivElement;

		let offsetX = 0;
		let offsetY = 0;
		let isDragging = false;

		handle.style.cursor = "grab";

		handle.addEventListener("mousedown", (e: MouseEvent) => {
			isDragging = true;
			offsetX = e.clientX - draggable.offsetLeft;
			offsetY = e.clientY - draggable.offsetTop;

			handle.style.cursor = "grabbing";
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
		});

		function onMouseMove(e: MouseEvent) {
			if (!isDragging) return;

			draggable.style.left = `${e.clientX - offsetX}px`;
			draggable.style.top = `${e.clientY - offsetY}px`;
		}

		function onMouseUp() {
			isDragging = false;
			handle.style.cursor = "grab";
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		}
	});
</script>

<section bind:this={draggable} style:display={visible ? "flex" : "none"} {...rest}>
	<Titlebar {close} {title} />
	<div class="content">
		{@render children()}
	</div>
</section>

<style>
	section {
		border-radius: 0.5rem;
		background-color: #1e1e2e;
		position: absolute;
		width: 30rem;
		z-index: 999;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.75);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex-grow: 1;
		width: 100%;
	}
</style>
