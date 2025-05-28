<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { sep } from "@tauri-apps/api/path";
	import { open } from "@tauri-apps/plugin-dialog";
	import { addProjectAudio, type ProjectAnimation } from "../../api/project.svelte";
	import ContextMenu from "../ContextMenu.svelte";
	import AnimationIcon from "../icons/AnimationIcon.svelte";
	import AudioIcon from "../icons/AudioIcon.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import AddAnimationMenu from "./AddAnimationMenu.svelte";

	let { top, left }: { top: string; left: string } = $props();

	let menu: ContextMenu;
	let addAnimationMenu: AddAnimationMenu;
	let startTime = $state(0);

	export function show() {
		menu.show();
	}

	export function setStartTime(time: number) {
		startTime = time;
	}

	export function toggle() {
		menu.toggle();
	}

	export function hide() {
		menu.hide();
		hideSubmenus();
	}

	function hideSubmenus() {
		addAnimationMenu.hide();
	}

	function onAdd(animation: ProjectAnimation) {
		animation.startTime = startTime;
	}

	type Submenu = "animation";

	let selectedMenu: Submenu | null = $state(null);

	function selectMenu(name: Submenu | null) {
		return function () {
			selectedMenu = name;
			if (name) {
				hideSubmenus();
				({
					animation: addAnimationMenu,
				})[name].show();
			}
		};
	}

	async function addAudio() {
		hide();

		let file = await open({
			directory: false,
			multiple: false,
			filters: [{ name: "Audio", extensions: ["mp3"] }],
		});

		if (typeof file === "string") {
			let audioData = await invoke<string>("load_audio", { path: file });
			addProjectAudio(file.substring(file.lastIndexOf(sep()) + 1), audioData);
		}
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>Timeline Actions</span>
	<button onclick={addAudio} onmouseenter={selectMenu(null)}>
		<AudioIcon stroke="#cba6f7" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Audio
	</button>
	<button style:background={selectedMenu === "animation" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("animation")}>
		<AnimationIcon stroke="#94e2d5" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Add Animation
		<RightArrow stroke="#89b4fa" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button onmouseenter={selectMenu(null)}>
		<GearIcon stroke="#9399b2" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		Open Timeline Preferences
	</button>

	<AddAnimationMenu bind:this={addAnimationMenu} top="3.5rem" left="-100%" hideParent={hide} {onAdd} />
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
