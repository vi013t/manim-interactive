<script lang="ts">
	import ObjectEntry from "./ObjectEntry.svelte";

	import { allObjects } from "../api/codegen.svelte";
	import PlusIcon from "./icons/PlusIcon.svelte";
	import {
		default as AddObjectMenu,
		default as ObjectMenu,
	} from "./menus/AddObjectMenu.svelte";

	let objectMenu: ObjectMenu;

	let top = $state("100%");
	let left = $state("94%");

	function addObject(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		objectMenu.show();
	}

	function clickPlusButton() {
		top = "4.8rem";
		left = "24rem";
		objectMenu.toggle();
	}
</script>

<section>
	<div class="header">
		<h1>Objects</h1>
		<button onclick={clickPlusButton}>
			<PlusIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	{#each allObjects().filter((object) => !("objectType" in object)) as object}
		<ObjectEntry entry={object} />
	{/each}

	{#each allObjects().filter((object) => "objectType" in object) as object}
		<ObjectEntry entry={object} />
	{/each}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div style:height="100%;" oncontextmenu={addObject}></div>

	<AddObjectMenu bind:this={objectMenu} {top} {left} />
</section>

<style>
	section {
		background-color: #1e1e2e;
		padding: 1em;
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
