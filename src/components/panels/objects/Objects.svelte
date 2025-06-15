<script lang="ts">
	import ObjectEntry from "./ObjectEntry.svelte";

	import { getHorizontalExpandDirection, getVerticalExpandDirection } from "../../../api/client.svelte";
	import { getProperty } from "../../../api/manim/properties";
	import { getProjectObjects } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import PlusIcon from "../../icons/PlusIcon.svelte";
	import AddObjectMenu from "../../menus/AddObjectMenu.svelte";

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
</script>

<section id="object-panel">
	<div class="header">
		<h1>{translate("Objects")}</h1>
		<button bind:this={plusButton} onclick={clickPlusButton}>
			<PlusIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	{#each getProjectObjects().filter(object => getProperty(object, "Object Type") === "Group") as object (object.id)}
		<ObjectEntry entry={object} />
	{/each}

	{#each getProjectObjects().filter(object => getProperty(object, "Object Type") !== "Group") as object (object.id)}
		<ObjectEntry entry={object} />
	{/each}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div style:height="100%;" oncontextmenu={addObject}></div>

	<AddObjectMenu bind:this={objectMenu} {top} {left} openers={[plusButton]} />
</section>

<style>
	section {
		background-color: var(--base);
		padding: 1em;
		position: relative;
		color: var(--text);

		&::after {
			content: "";
			height: 100%;
			width: 4px;
			position: absolute;
			left: calc(100% - 2px);
			top: 0px;
			z-index: 999;
			cursor: ew-resize;
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
