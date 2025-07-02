import { invoke } from "@tauri-apps/api/core";
import { join, sep, tempDir } from "@tauri-apps/api/path";
import type { AudioProperties } from "./audio";
import { cache } from "./client.svelte";
import { generateAnimationPreview, generateObjectPreview } from "./codegen.svelte";
import type { AnimationProperties } from "./manim/animations";
import type { EventProperties } from "./manim/events";
import { type ObjectProperties } from "./manim/objects";
import type { Properties, PropertyType } from "./manim/property";
import { getAnimationObjects, getPossibleProperties, getProperty } from "./manim/property";
import { getPreferences, runAction } from "./preferences.svelte";

let projectLocation: string | null = $state(null);
let projectName: string | null = $state(null);

export type Project = {
	animations: ProjectAnimation[];
	objects: ProjectObject[];
	audios: ProjectAudio[];
	events: ProjectEvent[];
	variables: ProjectVariable[];
	nextId: number;
	cache: {
		videoData: string | null;
		audioData: string | null;
	};
	settings: {
		fileFormat: "mp4" | "webm" | "mov";
		resolution: [number, number];
		renderer: "Cairo" | "OpenGL";
		fps: number;
		outputFileName: string;
	};
};

let project: Project = $state({
	animations: [],
	objects: [],
	audios: [],
	events: [],
	variables: [],
	nextId: 0,
	cache: {
		videoData: null,
		audioData: null,
	},
	settings: {
		fileFormat: "mp4",
		resolution: [1920, 1080],
		renderer: "Cairo",
		fps: 60,
		outputFileName: "Main",
	},
});

export function getProject(): Project {
	return project;
}

export function setProject(newProject: Project): void {
	console.log("project", newProject);
	project = newProject;
}

export type ProjectVariable = {
	id: number;
	name: string;
	type: PropertyType;
	value: unknown;
	locked: boolean;
};

export function addProjectVariable(variable: ProjectVariable) {
	project.variables.push(variable);
}

export function getVariableDependencies(object: ProjectObject | ProjectAnimation): number[] {
	return Object.values(object.properties)
		.filter(value => (value as any).variableId !== undefined)
		.map(value => (value as any).variableId);
}

export function isVariableUsed(variable: ProjectVariable): boolean {
	return (
		getProject().objects.some(object => getVariableDependencies(object).includes(variable.id)) ||
		getProject().animations.some(animation => getVariableDependencies(animation).includes(variable.id))
	);
}

export function getProjectVariableFromName(name: string): ProjectVariable | null {
	return project.variables.find(variable => variable.name === name) ?? null;
}

export function getProjectVariableFromId(id: number): ProjectVariable | null {
	return project.variables.find(variable => variable.id === id) ?? null;
}

export type ProjectAudio = {
	id: number;
	type: "audio";
	duration: number;
	properties: AudioProperties;
};

let audioLoaded = $state(true);

export async function recompileAudio() {
	if (getProject().audios.length === 0) {
		(document.getElementById("master-audio") as HTMLAudioElement).src = ``;
		return;
	}

	audioLoaded = false;
	project.cache.audioData = await invoke<string>("merge_audios", {
		projectPath: await getProjectLocation(),
		audios: getProject().audios.map(audio => ({
			id: audio.id,
			duration: audio.duration,
			data: audio.properties["Embedded Source"]!,
			start_time: audio.properties["Start Time"]!,
		})),
		videoLength: movieLength(),
		outputPath: null,
	});
	(document.getElementById("master-audio") as HTMLAudioElement).src = `data:audio/mp3;base64,${project.cache.audioData}`;
	audioLoaded = true;
}

export function isAudioLoaded() {
	return audioLoaded;
}

export async function addProjectAudio(name: string, data: string) {
	let duration = await new Promise<number>(resolve => {
		const audioElement = new Audio(`data:audio/mp3;base64,${data}`);
		audioElement.addEventListener("loadedmetadata", () => {
			resolve(audioElement.duration);
		});
	});

	project.audios.push({
		type: "audio",
		duration,
		id: nextId(),
		properties: {
			Name: name,
			"Start Time": 0,
			"Embedded Source": data,
		},
	});

	await recompileAudio();
}

export function getExplicitProjectLocation(): string | null {
	return projectLocation;
}

export async function getProjectLocation(): Promise<string> {
	return projectLocation ?? join(await tempDir(), "manim-interactive-project");
}

export function getProjectName(): string | null {
	return projectName;
}

export function setProjectLocation(location: string) {
	projectLocation = location;
	projectName = location.substring(location.lastIndexOf(sep()) + 1);
}

export async function getVideoLocation(): Promise<string> {
	return join(await getProjectLocation(), "media", "videos", "main", "1080p60", "Main.mp4");
}

export function serializeProject(): string {
	return JSON.stringify(project);
}

let projectReloadCounter = 0;

export function deserializeProject(data: string) {
	project = JSON.parse(data);
	projectReloadCounter++;
}

/**
 * Returns an opaque value that changes when the project is reloaded. Used for expressions like `{#key}` and `$effect`
 * to reload components or data when the project data is updated.
 */
export function projectReloadKey(): unknown {
	return projectReloadCounter;
}

export function resetProject() {
	project = {
		animations: [],
		objects: [],
		audios: [],
		events: [],
		variables: [],
		nextId: 0,
		cache: {
			videoData: null,
			audioData: null,
		},
		settings: {
			fileFormat: "mp4",
			resolution: [1920, 1080],
			renderer: "Cairo",
			fps: 60,
			outputFileName: "Main",
		},
	};
	addEndMarker();
}

export async function addProjectAnimation(animation: ProjectAnimation) {
	const anim = await generateAnimationPreview(animation);
	const nonWaits = getProject().animations.filter(projectAnimation => projectAnimation.properties["Animation Type"] !== "Wait");
	let startTime = nonWaits.length ? Math.max(...nonWaits.map(animation => animationEndTime(animation))) : 0;
	animation.properties["Start Time"] = startTime;
	project.animations.push(anim);
	regenerateWaits();
	updateEndMarker();
}

export type ProjectObject = {
	id: number;
	type: "object";
	previewData: string;
	properties: ObjectProperties;
};

export type ProjectEvent = {
	id: number;
	type: "event";
	properties: EventProperties;
};

export type ProjectAnimation = {
	id: number;
	type: "animation";
	previewData: string;
	properties: AnimationProperties;
};

export function getObjectDependencies(id: number): number[] {
	const object = getItemFromId(id)! as ProjectObject;
	const possibleProperties = getPossibleProperties(object);
	return Object.entries(object.properties)
		.map(([propertyName, propertyValue]) => {
			if (propertyName === "Object Type" || propertyName === "Name") return [];
			const propertyBase = possibleProperties.find(property => property.name === propertyName)!;
			if (propertyBase.type.base === "object") return [propertyValue as number];
			return [];
		})
		.flat();
}

export function checkForObjectDependencyCycles(): boolean {
	const visited = new Set();
	const recStack = new Set();

	function dfs(id: number) {
		if (recStack.has(id)) return true;
		if (visited.has(id)) return false;

		visited.add(id);
		recStack.add(id);

		if (getObjectDependencies(id).some(dependency => dfs(dependency))) return true;
		recStack.delete(id);

		return false;
	}

	return project.objects.some(object => dfs(object.id));
}

export function animationEndTime(animation: ProjectAnimation): number {
	return getProperty(animation, "Start Time")! + getProperty(animation, "Duration")!;
}

export function nextId() {
	return project.nextId++;
}

export async function addProjectObject(object: Omit<ProjectObject, "previewData">) {
	const obj = await generateObjectPreview(object);
	project.objects.push(obj);
}

export function addProjectEvent(event: ProjectEvent): void {
	project.events.push(event);
}

export function deleteProjectItem(id: number) {
	if (selected().includes(id)) select(selected().filter(sel => sel !== id));

	getProject()
		.objects.filter(object => getProperty(object, "Object Type") === "Group")
		.forEach(group => {
			(group.properties as any)["Objects"] = group.properties["Objects"]!.filter(contentId => contentId !== id);
		});

	getObjectFromId(id)?.properties["Objects"]?.forEach(objectId => {
		deleteProjectItem(objectId as number);
	});

	project.objects = project.objects.filter(object => object.id !== id);
	project.animations = project.animations.filter(animation => animation.properties["Object"] !== id && animation.id !== id);
	project.audios = project.audios.filter(audio => audio.id !== id);
	project.variables = project.variables.filter(variable => variable.id !== id);
	project.events = project.events.filter(marker => marker.id !== id);
	errors = errors.filter(error => error.objectId !== id);

	if (getPreferences().autosave) runAction("Save And Recompile Project");
}

let selectedItems: number[] = $state([]);

export function selected(): number[] {
	return selectedItems;
}

export function addToSelection(...ids: number[]) {
	selectedItems.push(...ids);
}

export function removeFromSelection(...ids: number[]) {
	selectedItems = selectedItems?.filter(id => !ids.includes(id)) ?? null;
}

export function deselect() {
	selectedItems = [];
}

export function select(id: number[]) {
	selectedItems = id;
	if (selectedItems.length === 1) cache("showMovieOverPreview", false);
}

export function getSingleSelection(): number | null {
	return selectedItems.length === 1 ? selectedItems[0] : null;
}

export function areMultipleSelected(): boolean {
	return selectedItems.length > 1;
}

export function getPropertiesFromId<T extends ProjectObject | ProjectAnimation | ProjectAudio>(id: number): Properties<T> | null {
	return (getProject().objects.find(object => object.id === id)?.properties ??
		getProject().animations.find(animation => animation.id === id)?.properties ??
		getProject().audios.find(audio => audio.id === id)?.properties ??
		null) as Properties<T> | null;
}

export function getItemFromId<T extends ProjectObject | ProjectAnimation | ProjectEvent>(id: number): T | null {
	return (getProject().objects.find(object => object.id === id) ??
		getProject().animations.find(animation => animation.id === id) ??
		getProject().events.find(marker => marker.id === id) ??
		null) as T | null;
}

export function getSelectableFromId<T extends ProjectObject | ProjectAnimation | ProjectAudio>(id: number): T | null {
	return (getProject().objects.find(object => object.id === id) ??
		getProject().animations.find(animation => animation.id === id) ??
		getProject().audios.find(audio => audio.id === id) ??
		null) as T | null;
}

export function getObjectFromId(id: number): ProjectObject | null {
	return getProject().objects.find(object => object.id === id) ?? null;
}

export function getAnimationFromId(id: number): ProjectAnimation | null {
	return getProject().animations.find(animation => animation.id === id) ?? null;
}

export function getAudioFromId(id: number): ProjectAudio | null {
	return getProject().audios.find(audio => audio.id === id) ?? null;
}

type Error = PropertyError;
type PropertyError = { propertyName: string; objectId: number };

let errors: Error[] = $state([]);

export function addError(error: Error): void {
	if (errors.every(existingError => existingError.objectId !== error.objectId || existingError.propertyName !== error.propertyName)) {
		errors.push(error);
	}
}

export function projectHasErrors(): boolean {
	return errors.length !== 0;
}

export function itemHasErrors(id: number): boolean {
	return !!errors.find(error => error.objectId === id);
}

export function removeError(error: Error): void {
	errors = errors.filter(existingError => existingError.propertyName !== error.propertyName || existingError.objectId !== error.objectId);
}

let errorId = 0;

export function nextErrorId(): number {
	return errorId++;
}

let notifications: NotificationData[] = $state([]);
let notificationId = 0;

export type NotificationData = {
	header: string;
	message: string;
	severity: "normal" | "error" | "warning";
	id: number;
};

export type NotificationPart = string | {};

export function addNotification(header: string, message: string, options: { severity?: "normal" | "error" | "warning"; autohide?: false }) {
	options.severity = options.severity ?? "normal";
	(options as any).autohide = options.autohide ?? true;

	let id = notificationId++;
	notifications.push({
		header,
		message,
		severity: options.severity,
		id,
	});

	if (options.autohide) {
		setTimeout(() => {
			notifications = notifications.filter(notification => notification.id !== id);
		}, 5000);
	}
}

export function getNotifications(): NotificationData[] {
	return notifications;
}

export function removeNotification(id: number): void {
	notifications = notifications.filter(notification => notification.id !== id);
}

export function isNameTaken(name: string, exclude?: number): boolean {
	return (
		project.objects.some(object => getProperty(object, "Name") === name && (exclude === undefined || object.id !== exclude)) ||
		project.variables.some(variable => variable.name === name && (exclude === undefined || variable.id !== exclude)) ||
		project.animations.some(animation => getProperty(animation, "Name") === name && (exclude === undefined || animation.id !== exclude)) ||
		project.events.some(event => event.properties.Name === name && (exclude === undefined || event.id !== exclude))
	);
}

export function topologicalProjectObjects(): ProjectObject[] {
	const sorted: ProjectObject[] = [];

	function visit(node: ProjectObject) {
		if (!sorted.includes(node)) {
			getObjectDependencies(node.id).forEach(dependency => visit(getItemFromId(dependency)! as ProjectObject));
			sorted.push(node);
		}
	}

	project.objects.forEach(obj => {
		visit(obj);
	});

	return sorted;
}

export function animationIntersectsOther(animation: ProjectAnimation) {
	return getProject()
		.animations.filter(projectAnimation => projectAnimation.id !== animation.id)
		.some(projectAnimation =>
			intervalsOverlap([getProperty(projectAnimation, "Start Time")!, animationEndTime(projectAnimation)], [getProperty(animation, "Start Time")!, animationEndTime(animation)])
		);
}

export function intervalsOverlap([start1, end1]: [number, number], [start2, end2]: [number, number]): boolean {
	return end1 > start2 && end2 > start1;
}

export function nextAnimation(animation: ProjectAnimation): ProjectAnimation | null {
	return (
		getProject()
			.animations.filter(projectAnimation => projectAnimation.id !== animation.id && projectAnimation.properties["Animation Type"] !== "Wait")
			.toSorted((anim1, anim2) => getProperty(anim1, "Start Time")! - getProperty(anim2, "Start Time")!)
			.find(projectAnimation => getProperty(projectAnimation, "Start Time")! > getProperty(animation, "Start Time")!) ?? null
	);
}

export function previousAnimation(animation: ProjectAnimation): ProjectAnimation | null {
	return (
		getProject()
			.animations.filter(projectAnimation => projectAnimation.id !== animation.id && projectAnimation.properties["Animation Type"] !== "Wait")
			.toSorted((anim1, anim2) => getProperty(anim1, "Start Time")! - getProperty(anim2, "Start Time")!)
			.toReversed()
			.find(projectAnimation => getProperty(projectAnimation, "Start Time")! < getProperty(animation, "Start Time")!) ?? null
	);
}

export function isObjectUsed(object: ProjectObject): boolean {
	return (
		project.animations.some(animation => getAnimationObjects(animation).includes(object.id)) ||
		(getProperty(object, "Object Type") === "Group" && getProperty(object, "Objects")!.length > 0) ||
		(() => {
			let properties = getPossibleProperties(object);
			return project.objects.some(object => {
				return Object.entries(object.properties).some(([propertyName, propertyValue]) => {
					let propertyBase = properties.find(property => property.name === propertyName);
					if (!propertyBase) return false;
					return propertyBase.type.base === "object" && propertyValue === object.id;
				});
			});
		})()
	);
}

export function lastAnimationEndTime(): number {
	if (project.animations.length === 0) return 0;
	return project.animations.map(animation => animationEndTime(animation)).toSorted((anim1, anim2) => anim2 - anim1)[0];
}

export function movieLength(): number {
	return project.events.find(event => event.properties.Name === "End")!.properties.Time!;
}

export function addEndMarker() {
	project.events.push({ id: nextId(), type: "event", properties: { Time: 0, Name: "End", "Event Type": "Empty Event" } });
	runAction("Save Project");
}

export function updateEndMarker() {
	let endMarker = project.events.find(event => event.properties.Name === "End")!;
	let lastAnimation = project.animations.toSorted((anim1, anim2) => animationEndTime(anim2) - animationEndTime(anim1))[0];
	endMarker.properties.Time = animationEndTime(lastAnimation);
}

export function isObjectInGroup(id: number) {
	return project.objects
		.filter(object => getProperty(object, "Object Type") === "Group")
		.some(group => getProperty(group, "Objects")!.includes(id) && getProperty(group, "Group in Hierarchy") !== false);
}

export function regenerateWaits() {
	project.animations = getProject().animations.filter(animation => animation.properties["Animation Type"] !== "Wait");

	let times = (getProject().animations as (ProjectAnimation | ProjectEvent)[])
		.concat(getProject().events)
		.toSorted((first, other) => {
			let startTime1 = first.type === "animation" ? first.properties["Start Time"]! : first.properties.Time!;
			let startTime2 = other.type === "animation" ? other.properties["Start Time"]! : other.properties.Time!;
			return startTime1 - startTime2;
		})
		.map(item => {
			if (item.type === "event") return { startTime: item.properties.Time!, endTime: item.properties.Time! };
			return { startTime: item.properties["Start Time"]!, endTime: animationEndTime(item) };
		});

	let waits: ProjectAnimation[] = [];

	// Beginning Wait
	if (times.length > 0 && times[0].startTime !== 0) {
		let duration = times[0].startTime;
		waits.push({ id: nextId(), type: "animation", previewData: "", properties: { "Animation Type": "Wait", Name: `Wait ${duration}s`, Duration: duration, "Start Time": 0 } });
	}

	// Middle Waits
	times.forEach((time, index) => {
		if (index != times.length - 1) {
			let waitStart = time.endTime;
			let waitDuration = times[index + 1].startTime - waitStart;
			if (waitDuration > 0) {
				waits.push({
					id: nextId(),
					type: "animation",
					previewData: "",
					properties: { "Animation Type": "Wait", Name: `Wait ${waitDuration}s`, "Start Time": waitStart, Duration: waitDuration },
				});
			}
		}
	});

	project.animations.push(...waits);
	runAction("Save Project");
}
