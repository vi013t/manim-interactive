<script lang="ts">
	import { onMount } from "svelte";
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { getManimAnimationByName, animations, getAnimationCategory } from "../../../api/manim/animations";
	import { type ProjectAnimation, animationEndTime, getItemFromId, getProjectAnimations, select, selected } from "../../../api/project.svelte";
	import AnimationActionsMenu from "../../menus/AnimationActionsMenu.svelte";
	import { runAction } from "../../../api/preferences.svelte";

	let { animation, timelineElement }: { animation: ProjectAnimation, timelineElement: HTMLElement } = $props();

	let draggingElement: HTMLElement | null = $state(null);
	let draggingAnimation: ProjectAnimation | null = $state(null);

	const Icon = getManimAnimationByName(animation.name)!.icon;

	let top = $state("");
	let left = $state("");
	let animationActionsMenu: AnimationActionsMenu;

	function animationActions(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
		animationActionsMenu.show();
	}

	const BORDER_SIZE = 4;
	let height: number;

	function resize(element: HTMLElement) {
		return function (event: MouseEvent) {
			element.style.height = `${event.y - element.clientTop}px`;
		};
	}

	function animationMouseDown(animation: ProjectAnimation) {
		return function (event: MouseEvent) {
			if (event.offsetY > (event.target as HTMLElement).clientHeight - BORDER_SIZE) {
				height = event.offsetY;
				document.addEventListener("mousemove", resize(event.target as HTMLElement), false);
			} else {
				draggingElement = event.target as HTMLElement;
				draggingAnimation = animation;
			}
		};
	}

	let ids: number[] = [];

	function onAnimationMount(animation: ProjectAnimation) {
		return function (element: HTMLElement) {
			if (!ids.includes(animation.id)) {
				const otherAnimations = getProjectAnimations().filter(projectAnimation => projectAnimation !== animation);
				let startTime = otherAnimations.length ? Math.max(...otherAnimations.map(animation => animationEndTime(animation))) : 0;
				animation.startTime = startTime;
				element.style.top = `${startTime * 4}rem`;
				ids.push(animation.id);
			}
		};
	}

	function animationColor(animation: ProjectAnimation): string {
		return getAnimationCategory(animations.find(manimation => manimation.name === animation.name)!.category).color;
	}

	onMount(() => {
		document.addEventListener("mousemove", event => {
			if (draggingElement) {
				let newTop = event.clientY - timelineElement.getBoundingClientRect().top - draggingElement.clientHeight / 2;
				draggingElement.style.top = `${newTop}px`;
				draggingElement.style.cursor = "grabbing";
			}
		});

		document.addEventListener("mouseup", event => {
			if (draggingElement) {
				let snapping = !(event.ctrlKey || event.shiftKey);
				let newTop = event.clientY - timelineElement.getBoundingClientRect().top - draggingElement.clientHeight / 2;
				let cellHeight = 64;
				if (snapping) {
					if (newTop % cellHeight < cellHeight / 2) newTop = newTop - (newTop % cellHeight);
					else newTop = newTop + (cellHeight - (newTop % cellHeight));
				}
				draggingElement.style.top = `${newTop}px`;
				draggingElement.style.cursor = "pointer";
				if (draggingAnimation) draggingAnimation.startTime = newTop / cellHeight;
				runAction("Save Project"); 
			}
			draggingElement = null;
			draggingAnimation = null;
		});
	});
</script>

<button
	oncontextmenu={animationActions}
	onmousedown={animationMouseDown(animation)}
	class="animation"
	onclick={() => select(animation)}
	{@attach onAnimationMount(animation)}
	style:background-color={animationColor(animation)}
	style:outline={selected() && animation.objects.includes(selected()!.id) ? "4px solid rgba(255, 255, 255, 50%)" : "none"}
	style:opacity={!selected() || animation.objects.includes(selected()!.id) ? "100%" : "30%"}
>
	<Icon stroke="#181825" style="height: max(1.5rem, 50%); aspect-ratio: 1;" />
	{animation.name}
	{animation.objects.length ? getItemFromId(animation.objects[0])!.name : ""}
</button>
<AnimationActionsMenu bind:this={animationActionsMenu} {top} {left} />

<style>
	.animation {
		margin-left: 8rem;
		border-radius: 0.3rem;
		color: #000000;
		position: absolute;
		width: 60%;
		cursor: pointer;
		text-align: left;
		padding: 1rem;
		height: 4rem;
		z-index: 99999;
		display: flex;
		gap: 0.5rem;
		outline-offset: -4px;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			top: calc(100% - 4px);
			width: 100%;
			height: 4px;
			cursor: ns-resize;
		}
	}
</style>
