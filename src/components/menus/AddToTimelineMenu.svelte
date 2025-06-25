<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { sep } from "@tauri-apps/api/path";
	import { open } from "@tauri-apps/plugin-dialog";
	import { openPreferencesWindow, setPreferencesView } from "../../api/client.svelte";
	import { addProjectAudio, type ProjectAnimation } from "../../api/project.svelte";
	import { translate } from "../../api/translate.svelte";
	import AnimationIcon from "../icons/AnimationIcon.svelte";
	import AudioIcon from "../icons/AudioIcon.svelte";
	import CalendarIcon from "../icons/CalendarIcon.svelte";
	import GearIcon from "../icons/GearIcon.svelte";
	import RightArrow from "../icons/RightArrow.svelte";
	import AddAnimationMenu from "./AddAnimationMenu.svelte";
	import AddEventMenu from "./AddEventMenu.svelte";
	import ContextMenu from "./ContextMenu.svelte";

	let { top, left }: { top: string; left: string } = $props();

	let menu: ContextMenu;

	let addAnimationMenu: AddAnimationMenu;
	let addEventMenu: AddEventMenu;

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
		addEventMenu.hide();
	}

	function onAdd(animation: ProjectAnimation) {
		animation.properties["Start Time"] = startTime;
	}

	type Submenu = "animation" | "event";

	let hoveredMenu: Submenu | null = $state(null);

	function hoverMenu(name: Submenu | null) {
		return function () {
			hoveredMenu = name;
			hideSubmenus();
			if (name) {
				({
					animation: addAnimationMenu,
					event: addEventMenu,
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
			let audioData = await invoke<string>("load_file_base64_data", { path: file });
			addProjectAudio(file.substring(file.lastIndexOf(sep()) + 1), audioData);
		}
	}

	function openTimelinePreferences() {
		hide();
		setPreferencesView("timeline");
		openPreferencesWindow();
	}
</script>

<ContextMenu bind:this={menu} {top} {left}>
	<span>{translate("Timeline Actions")}</span>
	<button onclick={addAudio} onmouseenter={hoverMenu(null)}>
		<AudioIcon stroke="var(--mauve)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Audio")}
	</button>
	<button style:background={hoveredMenu === "animation" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={hoverMenu("animation")}>
		<AnimationIcon stroke="var(--teal)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Animation")}
		<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button style:background={hoveredMenu === "event" ? "rgba(180, 150, 255, 10%)" : "transparent"} onmouseenter={hoverMenu("event")}>
		<CalendarIcon stroke="var(--yellow)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Add Event")}
		<RightArrow stroke="var(--blue)" style="width: 1rem; height: 0.8rem; margin-left: 0.5em;" />
	</button>
	<button onmouseenter={hoverMenu(null)} onclick={openTimelinePreferences}>
		<GearIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem; margin-right: 0.5em;" />
		{translate("Open Timeline Preferences")}
	</button>

	<AddAnimationMenu bind:this={addAnimationMenu} top="3.5rem" left="-100%" {onAdd} />
	<AddEventMenu bind:this={addEventMenu} top="5.25rem" left="-100%" />
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
