<script lang="ts">
	import ObjectEntry from "./ObjectEntry.svelte";

	import { onMount } from "svelte";
	import { getHorizontalExpandDirection, getVerticalExpandDirection, isInSelectionBox } from "../../../api/client.svelte";
	import { getProperty } from "../../../api/manim/property";
	import { addToSelection, getObjectFromId, getProject, isObjectInGroup, isObjectUsed, select, selected } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import PlusIcon from "../../icons/PlusIcon.svelte";
	import AddObjectMenu from "../../menus/AddObjectMenu.svelte";
	import SelectRectangle from "../../util/SelectRectangle.svelte";

	let objectMenu: AddObjectMenu;

	let top = $state("100%");
	let left = $state("94%");

	// svelte-ignore non_reactive_update
	let plusButton: HTMLElement;

	function addObject(event: MouseEvent) {
		event.preventDefault();
		top = getVerticalExpandDirection() === "bottom" ? `${event.clientY - 40}px` : `${event.clientY - 230}px`;
		left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
		objectMenu.show();
	}

	function clickPlusButton() {
		top = "4.8rem";
		left = "24rem";
		objectMenu.show();
	}

	let sortedObjects = $derived(
		getProject().objects.toSorted((obj1, obj2) => {
			if (!isObjectUsed(obj1)) {
				if (!isObjectUsed(obj2)) {
					return obj1.properties["Name"].localeCompare(obj2.properties["Name"]);
				}

				return 1;
			}

			if (!isObjectUsed(obj2)) {
				return -1;
			}

			return obj1.properties["Name"].localeCompare(obj2.properties["Name"]);
		}),
	);

	onMount(() => {
		document.addEventListener("mouseup", event => {
			mouseDown = false;
			let idsToSelect = Array.from(document.querySelectorAll(".object-entry"))
				.filter(objectElement => isInSelectionBox(objectElement as HTMLElement))
				.map(objectElement => Number(objectElement.getAttribute("data-object-id")!));
			if (idsToSelect.length > 0) {
				if ((event.shiftKey || event.ctrlKey) && selected().every(id => getObjectFromId(id))) addToSelection(...idsToSelect);
				else select(idsToSelect);
			}
		});

		document.addEventListener("mousemove", event => {
			if (panelElement) {
				selectPoint2 = [Math.min(event.clientX, panelElement.getBoundingClientRect().width), Math.max(event.clientY, panelElement.getBoundingClientRect().top + 40)];
			}
		});
	});

	let selectPoint1: [number, number] = $state([0, 0]);
	let selectPoint2: [number, number] = $state([0, 0]);
	let mouseDown = $state(false);

	function panelMouseDown(event: MouseEvent) {
		selectPoint1 = [event.clientX, event.clientY];
		selectPoint2 = [event.clientX, event.clientY];

		if (!Array.from(document.querySelectorAll(".context-menu")).some(menu => event.composedPath().includes(menu))) mouseDown = true;
	}

	let panelElement: HTMLElement | null = $state(null);

	let resizing = $state(false);

	function resize() {
		resizing = true;
	}

	let width: string | undefined = $state(undefined);

	onMount(() => {
		document.addEventListener("mousemove", event => {
			if (resizing) {
				width = `clamp(10rem, ${event.clientX - panelElement!.getBoundingClientRect().left}px, 90vw)`;
			}
		});

		document.addEventListener("mouseup", () => (resizing = false));
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section style:width bind:this={panelElement} id="object-panel" onmousedown={panelMouseDown}>
	<div class="header">
		<h1>{translate("Objects")}</h1>
		<button bind:this={plusButton} onclick={clickPlusButton}>
			<PlusIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	{#each sortedObjects.filter(object => getProperty(object, "Object Type") === "Group" && !isObjectInGroup(object.id)) as object (object.id)}
		<ObjectEntry entry={object} />
	{/each}

	{#each sortedObjects.filter(object => getProperty(object, "Object Type") !== "Group" && !isObjectInGroup(object.id)) as object (object.id)}
		<ObjectEntry entry={object} />
	{/each}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div style:height="100%;" oncontextmenu={addObject}></div>

	<AddObjectMenu bind:this={objectMenu} {top} {left} openers={[plusButton]} />
	<div onmousedown={resize} class="resizer {resizing ? 'resizing' : ''}" style:background={resizing ? "var(--lavender)" : undefined}></div>
</section>
{#if mouseDown && !resizing}
	<SelectRectangle point1={selectPoint1} point2={selectPoint2} />
{/if}

<style>
	section {
		background-color: var(--base);
		padding: 1em;
		position: relative;
		color: var(--text);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 16.6666%;
	}

	.resizer {
		position: absolute;
		top: 0px;
		right: 0%;
		height: 100%;
		width: 3px;
		cursor: ew-resize;

		&:not(.resizing):hover {
			background: var(--lavender);
			opacity: 50%;
		}
	}

	.header {
		display: flex;
		width: 100%;
		align-items: center;
		position: relative;

		button {
			margin-left: auto;
			padding: 0.25rem;
			border-radius: 0.25rem;

			&:hover {
				background: rgba(255, 255, 255, 8%);
			}
		}
	}

	h1 {
		text-transform: uppercase;
		font-size: 0.75rem;
		color: var(--overlay-2);
		padding-bottom: 1em;
	}
</style>
