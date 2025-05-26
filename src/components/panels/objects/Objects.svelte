<script lang="ts">
	import ObjectEntry from "./ObjectEntry.svelte";

	import { getHorizontalExpandDirection } from "../../../api/client.svelte";
	import { getProjectObjects } from "../../../api/project.svelte";
	import PlusIcon from "../../icons/PlusIcon.svelte";
	import AddObjectMenu from "../../menus/AddObjectMenu.svelte";

	let objectMenu: AddObjectMenu;

	let top = $state("100%");
	let left = $state("94%");

	// svelte-ignore non_reactive_update
	let plusButton: HTMLElement;

	function addObject(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY - 40}px`;
		left = getHorizontalExpandDirection() === "right" ? `${event.clientX}px` : `calc(${event.clientX}px - 15rem)`;
		objectMenu.show();
	}

	function clickPlusButton() {
		top = "4.8rem";
		left = "24rem";
		objectMenu.show();
	}
</script>

<section>
	<div class="header">
		<h1>Objects</h1>
		<button bind:this={plusButton} onclick={clickPlusButton}>
			<PlusIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	{#each getProjectObjects().filter(object => !("objectType" in object)) as object}
		<ObjectEntry entry={object} />
	{/each}

	{#each getProjectObjects().filter(object => "objectType" in object) as object}
		<ObjectEntry entry={object} />
	{/each}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div style:height="100%;" oncontextmenu={addObject}></div>

	<AddObjectMenu bind:this={objectMenu} {top} {left} openers={[plusButton]} />
</section>

<style>
	section {
		background-color: #1e1e2e;
		padding: 1em;
		position: relative;

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
		color: #9399b2;
		padding-bottom: 1em;
	}
</style>
