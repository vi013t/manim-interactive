<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { sep } from "@tauri-apps/api/path";
	import { open } from "@tauri-apps/plugin-dialog";
	import { openPreferencesWindow, setPreferencesView } from "../../api/client.svelte";
	import { addProjectAudio, addProjectMarker, type ProjectAnimation } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import AnimationIcon from "../icons/AnimationIcon.svelte";
	import AudioIcon from "../icons/AudioIcon.svelte";
	import BookmarkIcon from "../icons/BookmarkIcon.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import AddAnimationMenu from "./AddAnimationMenu.svelte";
	import ContextMenu from "./ContextMenu.svelte";

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
		animation.properties["Start Time"] = startTime;
	}

	type Submenu = "animation" | "marker";

	let selectedMenu: Submenu | null = $state(null);

	function selectMenu(name: Submenu | null) {
		return function () {
			selectedMenu = name;
			hideSubmenus();
			if (name) {
				({
					animation: addAnimationMenu,
					marker: addAnimationMenu,
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

	function addMarker(event: MouseEvent) {
		hide();
		addProjectMarker("", event.clientY / 64);
	}

	function openTimelinePreferences() {
		hide();
		setPreferencesView("timeline");
		openPreferencesWindow();
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>{translate("Timeline Actions")}</span>
	<button onclick={addAudio} onmouseenter={selectMenu(null)}>
		<AudioIcon stroke="var(--mauve)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Audio")}
	</button>
	<button style:background={selectedMenu === "animation" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("animation")}>
		<AnimationIcon stroke="var(--teal)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Animation")}
		<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button onclick={addMarker} style:background={selectedMenu === "marker" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={selectMenu("marker")}>
		<BookmarkIcon stroke="var(--yellow)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Marker")}
	</button>
	<button onmouseenter={selectMenu(null)} onclick={openTimelinePreferences}>
		<GearIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Open Timeline Preferences")}
	</button>

	<AddAnimationMenu bind:this={addAnimationMenu} top="3.5rem" left="-100%" {onAdd} />
</ContextMenu>

<style>
	:global(button) {
		display: flex;
		align-items: center;
	}

	span {
		font-size: 0.85rem;
		border-bottom: 1px solid var(--surface-0);
	}
</style>
