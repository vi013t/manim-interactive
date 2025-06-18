<script lang="ts">
	import { onMount } from "svelte";
	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { animations, getAnimationCategory, getManimAnimationByName } from "../../../api/manim/animations";
	import { getAnimationObjects, getProperty } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import {
		type ProjectAnimation,
		animationEndTime,
		getProjectAnimations,
		nextAnimation,
		previousAnimation,
		regenerateWaits,
		select,
		selected,
		updateEndMarker,
	} from "../../../api/project.svelte";
	import AnimationActionsMenu from "../../menus/AnimationActionsMenu.svelte";

	let { animation, timelineElement }: { animation: ProjectAnimation; timelineElement: HTMLElement } = $props();

	let draggingElement: HTMLElement | null = $state(null);
	let expandingElement: HTMLElement | null = $state(null);

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
			}
		};
	}

	let ids: number[] = [];

	function onAnimationMount(animation: ProjectAnimation) {
		return function (element: HTMLElement) {
			if (!ids.includes(animation.id)) {
				if (animation.properties["Animation Type"] !== "Wait") {
					const otherAnimations = getProjectAnimations().filter(projectAnimation => projectAnimation !== animation);
					let startTime = otherAnimations.length ? Math.max(...otherAnimations.map(animation => animationEndTime(animation))) : 0;
					animation.properties["Start Time"] = startTime;
					ids.push(animation.id);
				}
			}
		};
	}

	function animationColor(animation: ProjectAnimation): string {
		return getAnimationCategory(animations.find(manimation => manimation.name === getProperty(animation, "Animation Type")!)!.category).color;
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

					let next = nextAnimation(animation);
					if (next) {
						newHeight = Math.min(newHeight / cellHeight, getProperty(next, "Start Time")! - getProperty(animation, "Start Time")!) * cellHeight;
					}
					newHeight = Math.max(cellHeight, newHeight);

					expandingElement.style.height = `${newHeight}px`;
					updateEndMarker();
				} else if (draggingElement) {
					let newTop = event.clientY - timelineElement.getBoundingClientRect().top - draggingElement.clientHeight / 2;
					let snapping = getPreferences().timelineSnapping;
					if (snapping) {
						if (newTop % cellHeight < cellHeight / 2) newTop = newTop - (newTop % cellHeight);
						else newTop = newTop + (cellHeight - (newTop % cellHeight));
					}

					let previous = previousAnimation(animation);
					if (previous) {
						newTop = Math.max(newTop / cellHeight, animationEndTime(previous)) * cellHeight;
					}

					let next = nextAnimation(animation);
					if (next) {
						newTop = Math.min(newTop / cellHeight, getProperty(next, "Start Time")! - getProperty(animation, "Duration")!) * cellHeight;
					}
					newTop = Math.max(0, newTop);

					draggingElement.style.top = `${newTop}px`;
					draggingElement.style.cursor = "grabbing";
					updateEndMarker();
				}
			}
		});

		document.addEventListener("mouseup", event => {
			const cellHeight = 64;

			if (draggingElement && timelineElement) {
				draggingElement.style.cursor = "pointer";
				let newStartTime = draggingElement.getBoundingClientRect().top / cellHeight - timelineElement.getBoundingClientRect().top / cellHeight;
				if (newStartTime !== animation.properties["Start Time"]) {
					animation.properties["Start Time"] = newStartTime;
					if (getPreferences().autosave) runAction("Save And Recompile Project");
				}
				regenerateWaits();
			}

			if (expandingElement) {
				animation.properties["Duration"] = expandingElement.getBoundingClientRect().height / cellHeight;
				regenerateWaits();
				runAction("Save And Recompile Project");
			}

			draggingElement = null;
			expandingElement = null;
		});
	});

	let element: HTMLElement;

	let animationTop = $derived.by(() => {
		let top = 0;
		getProjectAnimations()
			.toSorted((anim1, anim2) => anim1.properties["Start Time"]! - anim2.properties["Start Time"]!)
			.some(projectAnimation => {
				if (projectAnimation.id === animation.id) return true;
				if (projectAnimation.properties["Animation Type"] === "Wait") return false;
				top += projectAnimation.properties["Duration"]! + 1;
				return false;
			});
		if (animation.properties["Animation Type"] === "Wait") top--;
		return getPreferences().collapseWaitTimes ? `${top * 4}rem` : `${animation.properties["Start Time"]! * 4}rem`;
	});

	let animationHeight = $derived.by(() => {
		if (getPreferences().collapseWaitTimes && animation.properties["Animation Type"] === "Wait") return "4rem";
		return `${animation.properties["Duration"]! * 4}rem`;
	});

	$effect(() => {
		console.log(animation.properties["Name"], $state.snapshot(getProjectAnimations()));
	});
</script>

<button
	oncontextmenu={animationActions}
	onmousedown={animationMouseDown(animation)}
	class="animation"
	onclick={() => select([animation.id])}
	{@attach onAnimationMount(animation)}
	style:background-color={animationColor(animation)}
	style:outline={selected()[0] === animation.id || (selected() !== null && getAnimationObjects(animation).includes(selected()[0])) ? "4px solid rgba(255, 255, 255, 50%)" : "none"}
	style:opacity={selected() === null || selected()[0] === animation.id || getAnimationObjects(animation).includes(selected()[0]) ? "100%" : "30%"}
	style:top={animationTop}
	style:height={animationHeight}
	style:display={animation.properties["Animation Type"] === "Wait" && !getPreferences().showWaits ? "none" : "flex"}
	bind:this={element}
>
	<Icon stroke="var(--mantle)" style="height: clamp(1rem, 50%, 1.5rem); aspect-ratio: 1;" />
	<span contenteditable>{getProperty(animation, "Name")}</span>
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
