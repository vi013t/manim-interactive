import { join, sep, tempDir } from "@tauri-apps/api/path";
import type { AnimationProperties } from "./manim/animations";
import { type ObjectProperties } from "./manim/objects";
import type { Properties } from "./manim/property";
import { getAnimationObjects, getPossibleProperties, getProperty } from "./manim/property";
import { getPreferences, runAction } from "./preferences.svelte";

let projectLocation: string | null = $state(null);
let projectName: string | null = $state(null);
let id = 0;

let projectObjects: ProjectObject[] = $state([]);
let projectAnimations: ProjectAnimation[] = $state([]);
let projectAudios: ProjectAudio[] = $state([]);
let projectLibraries: Set<string> = $state(new Set(["manim"]));

export type ProjectMarker = { id: number; name: string; time: number };
let projectMarkers: ProjectMarker[] = $state([]);

export type ProjectAudio = {
	id: number;
	data: string;
	name: string;
	duration: number;
};

export async function addProjectAudio(name: string, data: string) {
	let duration = await new Promise<number>(resolve => {
		const audioElement = new Audio(`data:audio/mp3;base64,${data}`);
		audioElement.addEventListener("loadedmetadata", () => {
			resolve(audioElement.duration);
		});
	});

	projectAudios.push({
		name,
		data,
		duration,
		id: nextId(),
	});
}

export function getProjectAudios() {
	return projectAudios;
}

export function getProjectLibraries() {
	return projectLibraries;
}

export function addProjectLibrary(library: string) {
	projectLibraries.add(library);
}

export function removeProjectLibrary(name: string) {
	projectLibraries.delete(name);
}

export function addProjectMarker(name: string, time: number) {
	projectMarkers.push({ name, time, id: nextId() });
}

export function getProjectMarkers() {
	return projectMarkers;
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

export function getProjectSaveData(): string {
	return JSON.stringify({
		objects: projectObjects,
		animations: projectAnimations,
		audios: projectAudios,
		markers: projectMarkers,
		nextId: id,
	});
}

export function loadProjectData(data: string) {
	const { objects, animations, nextId, audios, markers } = JSON.parse(data);
	projectAnimations = animations;
	projectObjects = objects;
	projectAudios = audios;
	projectMarkers = markers;
	id = nextId;
}

export function resetProject() {
	projectAnimations = [];
	projectObjects = [];
	projectAudios = [];
	projectMarkers = [];
	id = 0;
	addEndMarker();
}

export function getProjectAnimations(): ProjectAnimation[] {
	return projectAnimations;
}

export function getProjectObjects(): ProjectObject[] {
	return projectObjects;
}

export function addProjectAnimation(animation: ProjectAnimation) {
	projectAnimations.push(animation);
	regenerateWaits();
}

export type ProjectObject = {
	id: number;
	type: "object";
	properties: ObjectProperties;
};

export type ProjectAnimation = {
	id: number;
	type: "animation";
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

	return projectObjects.some(object => dfs(object.id));
}

export function animationEndTime(animation: ProjectAnimation): number {
	return getProperty(animation, "Start Time")! + getProperty(animation, "Duration")!;
}

export function nextId() {
	return id++;
}

export function addProjectObject(object: ProjectObject) {
	projectObjects.push(object);
}

export function deleteProjectItem(id: number) {
	if (selected().includes(id)) select(selected().filter(sel => sel !== id));

	getProjectObjects()
		.filter(object => getProperty(object, "Object Type") === "Group")
		.forEach(group => {
			(group.properties as any)["Objects"] = group.properties["Objects"]!.filter(contentId => contentId !== id);
		});

	getObjectFromId(id)?.properties["Objects"]?.forEach(objectId => {
		deleteProjectItem(objectId as number);
	});

	projectObjects = projectObjects.filter(object => object.id !== id);
	projectAnimations = projectAnimations.filter(animation => getProperty(animation, "Object") !== id);
	projectAudios = projectAudios.filter(audio => audio.id !== id);
	projectMarkers = projectMarkers.filter(marker => marker.id !== id);
	errors = errors.filter(error => error.objectId !== id);
	if (getPreferences().autosave) runAction("Save And Recompile Project");
}

type Selectable = ProjectObject | ProjectAnimation;

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
}

export function getSingleSelection(): number | null {
	return selectedItems.length === 1 ? selectedItems[0] : null;
}

export function areMultipleSelected(): boolean {
	return selectedItems.length > 1;
}

export function getPropertiesFromId<T extends ProjectObject | ProjectAnimation>(id: number): Properties<T> | null {
	return (getProjectObjects().find(object => object.id === id)?.properties ??
		getProjectAnimations().find(animation => animation.id === id)?.properties ??
		null) as Properties<T> | null;
}

export function getItemFromId<T extends ProjectObject | ProjectAnimation | ProjectMarker>(id: number): T | null {
	return (getProjectObjects().find(object => object.id === id) ??
		getProjectAnimations().find(animation => animation.id === id) ??
		getProjectMarkers().find(marker => marker.id === id) ??
		null) as T | null;
}

export function getSelectableFromId<T extends ProjectObject | ProjectAnimation>(id: number): T | null {
	return (getProjectObjects().find(object => object.id === id) ?? getProjectAnimations().find(animation => animation.id === id) ?? null) as T | null;
}

export function getObjectFromId(id: number): ProjectObject | null {
	return getProjectObjects().find(object => object.id === id) ?? null;
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
		projectObjects.some(object => getProperty(object, "Name") === name && (exclude === undefined || object.id !== exclude)) ||
		projectAnimations.some(animation => getProperty(animation, "Name") === name && (exclude === undefined || animation.id !== exclude)) ||
		projectMarkers.some(marker => marker.name === name && (exclude === undefined || marker.id !== exclude))
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

	projectObjects.forEach(obj => {
		visit(obj);
	});

	return sorted;
}

export function animationIntersectsOther(animation: ProjectAnimation) {
	return getProjectAnimations()
		.filter(projectAnimation => projectAnimation.id !== animation.id)
		.some(projectAnimation =>
			intervalsOverlap([getProperty(projectAnimation, "Start Time")!, animationEndTime(projectAnimation)], [getProperty(animation, "Start Time")!, animationEndTime(animation)])
		);
}

export function intervalsOverlap([start1, end1]: [number, number], [start2, end2]: [number, number]): boolean {
	return end1 > start2 && end2 > start1;
}

export function nextAnimation(animation: ProjectAnimation): ProjectAnimation | null {
	return (
		getProjectAnimations()
			.filter(projectAnimation => projectAnimation.id !== animation.id && projectAnimation.properties["Animation Type"] !== "Wait")
			.toSorted((anim1, anim2) => getProperty(anim1, "Start Time")! - getProperty(anim2, "Start Time")!)
			.find(projectAnimation => getProperty(projectAnimation, "Start Time")! > getProperty(animation, "Start Time")!) ?? null
	);
}

export function previousAnimation(animation: ProjectAnimation): ProjectAnimation | null {
	return (
		getProjectAnimations()
			.filter(projectAnimation => projectAnimation.id !== animation.id && projectAnimation.properties["Animation Type"] !== "Wait")
			.toSorted((anim1, anim2) => getProperty(anim1, "Start Time")! - getProperty(anim2, "Start Time")!)
			.toReversed()
			.find(projectAnimation => getProperty(projectAnimation, "Start Time")! < getProperty(animation, "Start Time")!) ?? null
	);
}

export function isObjectUsed(object: ProjectObject): boolean {
	return (
		projectAnimations.some(animation => getAnimationObjects(animation).includes(object.id)) ||
		(getProperty(object, "Object Type") === "Group" && getProperty(object, "Objects")!.length > 0) ||
		(() => {
			let properties = getPossibleProperties(object);
			return projectObjects.some(object => {
				return Object.entries(object.properties).some(([propertyName, propertyValue]) => {
					let propertyBase = properties.find(property => property.name === propertyName);
					if (!propertyBase) return false;
					return propertyBase.type.base === "object" && propertyValue === object.id;
				});
			});
		})()
	);
}

export function movieLength(): number {
	if (projectAnimations.length === 0) return 0;
	return projectAnimations.map(animation => animationEndTime(animation)).toSorted((anim1, anim2) => anim2 - anim1)[0];
}

export function addEndMarker() {
	projectMarkers.push({ name: "End", id: nextId(), time: 0 });
	runAction("Save Project");
}

export function updateEndMarker() {
	let endMarker = projectMarkers.find(marker => marker.name === "End")!;
	let lastAnimation = projectAnimations.toSorted((anim1, anim2) => animationEndTime(anim2) - animationEndTime(anim1))[0];
	endMarker.time = animationEndTime(lastAnimation);
}

export function isObjectInGroup(id: number) {
	return projectObjects
		.filter(object => getProperty(object, "Object Type") === "Group")
		.some(group => getProperty(group, "Objects")!.includes(id) && getProperty(group, "Group in Hierarchy") !== false);
}

export function regenerateWaits() {
	projectAnimations = getProjectAnimations().filter(animation => animation.properties["Animation Type"] !== "Wait");
	let animations = getProjectAnimations().toSorted((first, other) => first.properties["Start Time"]! - other.properties["Start Time"]!);
	let waits: ProjectAnimation[] = [];
	animations.forEach((animation, index) => {
		if (index != animations.length - 1) {
			let waitStart = animationEndTime(animation);
			console.log(waitStart);
			let waitDuration = animations[index + 1].properties["Start Time"]! - waitStart;
			if (waitDuration > 0) {
				waits.push({ id: nextId(), type: "animation", properties: { "Animation Type": "Wait", Name: `Wait ${waitDuration}s`, "Start Time": waitStart, Duration: waitDuration } });
			}
		}
	});
	projectAnimations.push(...waits);
}
