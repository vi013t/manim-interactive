<script lang="ts">
	import { onMount } from "svelte";
	import { getHorizontalExpandDirection, isInSelectionBox } from "../../../api/client.svelte";
	import { getPreferences, onPreferenceChange, runAction, setPreference } from "../../../api/preferences.svelte";
	import {
		addToSelection,
		animationEndTime,
		getAnimationFromId,
		getProjectAnimations,
		getProjectAudios,
		getProjectEvents,
		regenerateWaits,
		select,
		selected,
		type ProjectEvent,
	} from "../../../api/project.svelte";
	import { currentTime, getRelativeTime, isPlaying, togglePlaying } from "../../../api/timeline.svelte";
	import { translate } from "../../../api/translate.svelte";
	import PlayIcon from "../../icons/PlayIcon.svelte";
	import SquareIcon from "../../icons/SquareIcon.svelte";
	import AddToTimelineMenu from "../../menus/AddToTimelineMenu.svelte";
	import AudioMenu from "../../menus/AudioMenu.svelte";
	import MarkerMenu from "../../menus/MarkerMenu.svelte";
	import SelectRectangle from "../../util/SelectRectangle.svelte";
	import Animation from "./Animation.svelte";
	import Audio from "./Audio.svelte";

	// svelte-ignore non_reactive_update
	let timelineElement: HTMLElement;
	let addAnimationMenu: AddToTimelineMenu;
	let audioActionsMenu: AudioMenu | null = $state(null);
	let markerMenu: MarkerMenu;

	let top = $state("100%");
	let left = $state("94%");
	let markerId = $state(0);

	let seconds = 1;

	function formatTime(seconds: number): string {
		if (seconds < 60) return `${seconds}s`;
		if (seconds / 60 < 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
		return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds / 3600) % 60}m ${seconds % 60}s`;
	}

	onMount(() => {
		onPreferenceChange("relativeTimestamps", relativeTimestamps => {
			Array.from(document.querySelectorAll(".timestamp")).forEach(timestamp => {
				let absoluteTime = Number(timestamp.getAttribute("data-time"));
				timestamp.textContent = formatTime(relativeTimestamps ? getRelativeTime(absoluteTime) : absoluteTime);
			});
		});

		const wrapper = document.getElementById("timeline-wrapper")!;
		wrapper.addEventListener("scroll", checkForNewDiv);

		function checkForNewDiv() {
			const lastDiv = document.querySelector("#timeline-content > div:last-child") as HTMLElement;
			const lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
			const pageOffset = wrapper.scrollTop + wrapper.clientHeight;

			if (pageOffset > lastDivOffset - 500) {
				const newDiv = document.createElement("div");
				newDiv.classList.add("timeline-segment");
				newDiv.setAttribute("data-time", `${seconds}`);
				document.getElementById("timeline-content")!.appendChild(newDiv);

				const timestamp = document.createElement("span");
				timestamp.classList.add("timestamp");
				timestamp.innerHTML = formatTime(seconds);
				timestamp.setAttribute("data-time", `${seconds}`);
				newDiv.appendChild(timestamp);
				newDiv.oncontextmenu = addAnimation;

				seconds++;
				checkForNewDiv();
			}
		}

		document.addEventListener("keydown", event => {
			setPreference("timelineSnapping", !event.ctrlKey);
		});
		document.addEventListener("keyup", event => {
			setPreference("timelineSnapping", !event.ctrlKey);
		});
		document.addEventListener("mousemove", event => {
			setPreference("timelineSnapping", !event.ctrlKey);
		});

		checkForNewDiv();

		document.addEventListener("mousemove", event => {
			if (draggingEvent) {
				const cellHeight = 64;
				let minimum = 0;
				if (draggingEvent.textContent === "End" && getProjectAnimations().length > 0) {
					minimum =
						getProjectAnimations()
							.filter(animation => animation.properties["Animation Type"] !== "Wait")
							.map(animationEndTime)
							.toSorted((anim1, anim2) => anim2 - anim1)[0] * cellHeight;
				}
				let newTop = Math.max(event.clientY - timelineElement.getBoundingClientRect().top, minimum);
				if (getPreferences().timelineSnapping) {
					if (newTop % cellHeight < cellHeight / 2) newTop = newTop - (newTop % cellHeight);
					else newTop = newTop + (cellHeight - (newTop % cellHeight));
				}
				draggingEvent.style.top = `${newTop}px`;
			}

			if (mouseDown) {
				selectPoint2 = [Math.max(event.clientX, timelineElement.getBoundingClientRect().left), Math.max(event.clientY, timelineElement.getBoundingClientRect().top)];
			}
		});

		document.addEventListener("mouseup", event => {
			if (draggingEvent) {
				getProjectEvents().find(marker => marker.properties.Name === draggingEvent!.textContent)!.properties.Time = parseInt(draggingEvent.style.top) / 64;
				regenerateWaits();
				runAction("Save And Recompile Project");
			}
			draggingEvent = null;

			// Selection
			mouseDown = false;
			let idsToSelect = Array.from(document.querySelectorAll(".animation"))
				.filter(animationElement => isInSelectionBox(animationElement as HTMLElement))
				.map(animationElement => Number(animationElement.getAttribute("data-animation-id")!));
			if (idsToSelect.length > 0) {
				if ((event.shiftKey || event.ctrlKey) && selected().every(id => getAnimationFromId(id))) addToSelection(...idsToSelect);
				else select(idsToSelect);
			}
		});
	});

	function addAnimation(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
		addAnimationMenu.show();
	}

	function markerOptions(marker: ProjectEvent) {
		return function (event: MouseEvent) {
			event.preventDefault();
			top = `${event.clientY}px`;
			left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
			markerId = marker.id;
			markerMenu.show();
		};
	}

	let draggingEvent: HTMLElement | null = $state(null);

	let markers: HTMLElement[] = $state([]);

	function typeMarker(event: KeyboardEvent) {
		if (event.key === "Enter") {
			(event.target as HTMLElement).blur();
		}
	}

	let selectPoint1: [number, number] = $state([0, 0]);
	let selectPoint2: [number, number] = $state([0, 0]);
	let mouseDown = $state(false);

	function timelineMouseDown(event: MouseEvent) {
		selectPoint1 = [event.clientX, event.clientY];
		selectPoint2 = [event.clientX, event.clientY];
		let element = event.target as HTMLElement;
		if (element.hasAttribute("data-time")) {
			mouseDown = true;
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section id="timeline">
	<div class="header">
		<h1>{translate("Timeline")}</h1>
		<button onclick={togglePlaying}>
			{#if isPlaying()}
				<SquareIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
			{:else}
				<PlayIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
			{/if}
		</button>
	</div>

	<div bind:this={timelineElement} id="timeline-wrapper" onmousedown={timelineMouseDown}>
		<div id="timeline-content">
			<!-- Animations -->
			{#each getProjectAnimations() as animation (animation.id)}
				<Animation {animation} {timelineElement} />
			{/each}

			<!-- Audios -->
			{#each getProjectAudios() as audio (audio.id)}
				<Audio {audio} menu={audioActionsMenu} />
			{/each}

			<!-- Markers -->
			{#each getProjectEvents() as marker, index (marker.id)}
				<div
					oncontextmenu={markerOptions(marker)}
					bind:this={markers[index]}
					onmousedown={() => (draggingEvent = markers[index])}
					class="marker"
					style:top="{marker.properties.Time! * 4}rem"
				>
					{#if marker.properties.Name === "End"}
						<span id="marker-{marker.id}-name" style:cursor="grab" onkeydown={typeMarker} onblur={() => runAction("Save Project")}>{translate("End")}</span>
					{:else}
						<span id="marker-{marker.id}-name" onkeydown={typeMarker} bind:textContent={marker.properties.Name} contenteditable onblur={() => runAction("Save Project")}></span>
					{/if}
				</div>
			{/each}

			<div oncontextmenu={addAnimation}></div>

			<div class="time" style:top="{currentTime() * 4}rem"></div>
		</div>
	</div>
</section>
<AddToTimelineMenu bind:this={addAnimationMenu} {top} {left} />
<AudioMenu bind:this={audioActionsMenu} />
<MarkerMenu bind:this={markerMenu} {top} {left} id={markerId} />
{#if mouseDown}
	<SelectRectangle point1={selectPoint1} point2={selectPoint2} />
{/if}

<style>
	.header {
		display: flex;

		> *:first-child {
			margin-right: auto;
		}

		> *:last-child {
			margin-right: 0.5rem;
		}
	}

	.marker {
		position: absolute;
		width: 100%;
		height: 2px;
		background-color: var(--yellow);
		left: 0px;
		transform: translateY(-50%);
		margin-left: 4rem;

		> span {
			background: var(--yellow);
			width: fit-content;
			top: 50%;
			position: absolute;
			transform: translateY(-50%);
			padding: 0.15em;
			padding-left: 0.5em;
			padding-right: 0.25em;
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
			left: 0px;
			font-size: 0.75rem;
			cursor: text;

			&::after {
				content: "";
				width: 0px;
				height: 0px;
				box-sizing: content-box;
				--size: 0.9em;
				border-top: var(--size) solid transparent;
				border-left: var(--size) solid var(--yellow);
				border-right: var(--size) solid transparent;
				border-bottom: var(--size) solid transparent;
				position: absolute;
				left: 100%;
			}
		}

		&:hover {
			cursor: grab;
		}
	}

	.time {
		height: 2px;
		width: 100%;
		background-color: var(--lavender);
		position: absolute;
		left: 0px;
		cursor: move;
		z-index: 99;

		&::after {
			content: "";
			width: 0px;
			height: 0px;
			border-top: 0.5rem solid transparent;
			border-bottom: 0.5rem solid transparent;
			border-left: 0.5rem solid var(--lavender);
			z-index: 9999;
			position: absolute;
			top: 50%;
			left: 0px;
			transform: translateY(-50%);
		}
	}

	section {
		background-color: var(--base);
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	h1 {
		text-transform: uppercase;
		font-size: 0.75rem;
		color: var(--overlay-2);
		padding: 1em;
	}

	#timeline-wrapper {
		position: relative;
		overflow: auto;
		height: 95vh;
		background-color: inherit;
	}

	#timeline-content {
		background-color: inherit;

		:global(> div:not(.time, .marker)) {
			background-color: inherit;
			height: 4rem;
			border-bottom: 1px solid var(--surface-0);
			display: flex;
			flex-direction: column;

			&:first-child {
				border-top: 1px solid var(--surface-0);
			}
		}
	}

	:global(.timestamp) {
		position: relative;
		top: -1.6em;
		padding: 0.75em;
		background-color: inherit;
		color: var(--surface-2);
		font-size: 0.75rem;
		left: 0px;
		width: fit-content;
	}
</style>
