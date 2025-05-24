<script lang="ts">
	import { addObjectEntry, nextId } from "../../api/codegen.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import AnnulusIcon from "../icons/AnnulusIcon.svelte";
	import CircleIcon from "../icons/CircleIcon.svelte";
	import EllipseIcon from "../icons/EllipseIcon.svelte";
	import HexagonIcon from "../icons/HexagonIcon.svelte";
	import RectangleIcon from "../icons/RectangleIcon.svelte";
	import SquareIcon from "../icons/SquareIcon.svelte";
	import StarIcon from "../icons/StarIcon.svelte";
	import TriangleIcon from "../icons/TriangleIcon.svelte";

	let { top, left, hideOuter }: { top: string; left: string; hideOuter: () => void } = $props();

	let menu: ContextMenu;

	export function show() {
		menu.show();
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
	}

	function addShape(shapeName: string) {
		return function () {
			menu.toggle();
			addObjectEntry({
				name: shapeName,
				objectType: shapeName,
				properties: {},
				id: nextId(),
			});
			hideOuter();
		};
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Add Shape</span>
	<button onclick={addShape("Annulus")}>
		<AnnulusIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Annulus
	</button>
	<button onclick={addShape("Circle")}>
		<CircleIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Circle
	</button>
	<button onclick={addShape("Ellipse")}>
		<EllipseIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Ellipse
	</button>
	<button onclick={addShape("Polygon")}>
		<HexagonIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Polygon
	</button>
	<button onclick={addShape("Rectangle")}>
		<RectangleIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Rectangle
	</button>
	<button onclick={addShape("Square")}>
		<SquareIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Square
	</button>
	<button onclick={addShape("Star")}>
		<StarIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Star
	</button>
	<button onclick={addShape("Triangle")}>
		<TriangleIcon stroke="#f38ba8" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Triangle
	</button>
</ContextMenu>

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid #313244;
	}
</style>
