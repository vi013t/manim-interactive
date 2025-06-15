<script lang="ts">
	import { onMount } from "svelte";
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { animations, getAnimationCategory, getManimAnimationByName } from "../../../api/manim/animations";
	import { getAnimationObjects, getProperty } from "../../../api/manim/properties";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { type ProjectAnimation, animationEndTime, getProjectAnimations, select, selected } from "../../../api/project.svelte";
	import AnimationActionsMenu from "../../menus/AnimationActionsMenu.svelte";

	let { animation, timelineElement }: { animation: ProjectAnimation; timelineElement: HTMLElement } = $props();

	let draggingElement: HTMLElement | null = $state(null);
	let expandingElement: HTMLElement | null = $state(null);
	let draggingAnimation: ProjectAnimation | null = $state(null);

	const Icon = $derived(getManimAnimationByName(getProperty(animation, "Animation Type")!)!.icon);

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

	function animationMouseDown(animation: ProjectAnimation) {
		return function (event: MouseEvent) {
			if (event.offsetY > (event.target as HTMLElement).clientHeight - BORDER_SIZE) {
				expandingElement = event.target as HTMLElement;
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
				animation.properties["Start Time"] = startTime;
				element.style.top = `${startTime * 4}rem`;
				ids.push(animation.id);
			}
		};
	}

	function animationColor(animation: ProjectAnimation): string {
		return getAnimationCategory(animations.find(manimation => manimation.name === getProperty(animation, "Animation Type"))!.category).color;
	}

	onMount(() => {
		document.addEventListener("mousemove", event => {
			const cellHeight = 64;
			if (timelineElement) {
				if (expandingElement) {
					let snapping = getPreferences().timelineSnapping;
					let newHeight = event.y - expandingElement.getBoundingClientRect().top;
					if (snapping) {
						if (newHeight % cellHeight < cellHeight / 2) newHeight = newHeight - (newHeight % cellHeight);
						else newHeight = newHeight + (cellHeight - (newHeight % cellHeight));
					}
					expandingElement.style.height = `${newHeight}px`;
				} else if (draggingElement) {
					let newTop = event.clientY - timelineElement.getBoundingClientRect().top - draggingElement.clientHeight / 2;
					draggingElement.style.top = `${newTop}px`;
					draggingElement.style.cursor = "grabbing";
				}
			}
		});

		document.addEventListener("mouseup", event => {
			const cellHeight = 64;
			if (draggingElement) {
				let snapping = getPreferences().timelineSnapping;
				let newTop = event.clientY - timelineElement.getBoundingClientRect().top - draggingElement.clientHeight / 2;
				if (snapping) {
					if (newTop % cellHeight < cellHeight / 2) newTop = newTop - (newTop % cellHeight);
					else newTop = newTop + (cellHeight - (newTop % cellHeight));
				}
				draggingElement.style.top = `${newTop}px`;
				draggingElement.style.cursor = "pointer";
				if (draggingAnimation) draggingAnimation.properties["Start Time"] = newTop / cellHeight;
				if (getPreferences().autosave) runAction("Save And Recompile Project");
			}

			if (expandingElement) {
				animation.properties["Duration"] = expandingElement.getBoundingClientRect().height / cellHeight;
				runAction("Save And Recompile Project");
			}

			draggingElement = null;
			draggingAnimation = null;
			expandingElement = null;
		});
	});

	let element: HTMLElement;

	$effect(() => {
		element.style.height = `${getProperty<number>(animation, "Duration")! * 64}px`;
	});
</script>

<button
	oncontextmenu={animationActions}
	onmousedown={animationMouseDown(animation)}
	class="animation"
	onclick={() => select(animation)}
	{@attach onAnimationMount(animation)}
	style:background-color={animationColor(animation)}
	style:outline={selected() === animation.id || (selected() !== null && getAnimationObjects(animation).includes(selected()!)) ? "4px solid rgba(255, 255, 255, 50%)" : "none"}
	style:opacity={selected() === null || selected() === animation.id || getAnimationObjects(animation).includes(selected()!) ? "100%" : "30%"}
	bind:this={element}
>
	<Icon stroke="var(--mantle)" style="height: clamp(1rem, 50%, 1.5rem); aspect-ratio: 1;" />
	{getProperty(animation, "Name")}
</button>
<AnimationActionsMenu bind:this={animationActionsMenu} {top} {left} />

<style>
	.animation {
		margin-left: calc(4rem + 20%);
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
