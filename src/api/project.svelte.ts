import { join, sep, tempDir } from "@tauri-apps/api/path";
import type { AnimationPropertyName } from "./manim/animations";
import type { ObjectPropertyName } from "./manim/objects";
import { getPossibleProperties, getProperty } from "./manim/properties";
import { getPreferences, runAction } from "./preferences.svelte";

let projectLocation: string | null = $state(null);
let projectName: string | null = $state(null);
let id = 0;

let projectObjects: ProjectObject[] = $state([]);
let projectAnimations: ProjectAnimation[] = $state([]);
let projectAudios: ProjectAudio[] = $state([]);
let projectLibraries: Set<string> = $state(new Set(["manim"]));
let projectMarkers: { id: number; name: string; time: number }[] = $state([]);

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
}

export function getProjectAnimations(): ProjectAnimation[] {
	return projectAnimations;
}

export function getProjectObjects(): ProjectObject[] {
	return projectObjects;
}

export function addProjectAnimation(animation: ProjectAnimation) {
	projectAnimations.push(animation);
}

export type ProjectObject = {
	id: number;
	type: "object";
	properties: { [Key in ObjectPropertyName]?: unknown };
};

export type ProjectAnimation = {
	id: number;
	type: "animation";
	properties: { [Key in AnimationPropertyName]?: unknown };
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
	return getProperty<number>(animation, "Start Time")! + getProperty<number>(animation, "Duration")!;
}

export function nextId() {
	return id++;
}

export function addProjectObject(object: ProjectObject) {
	projectObjects.push(object);
}

export function removeProjectObject(id: number) {
	if (selected() === id) select(null);
	projectObjects = projectObjects.filter(object => object.id !== id);
	projectAnimations = projectAnimations.filter(animation => getProperty<number>(animation, "Object") !== id);
	projectAudios = projectAudios.filter(audio => audio.id !== id);
	errors = errors.filter(error => error.objectId !== id);
	if (getPreferences().autosave) runAction("Save And Recompile Project");
}

type Selectable = ProjectObject | ProjectAnimation;

let selectedThing: number | null = $state(null);

export function selected(): number | null {
	return selectedThing;
}

export function select(object: Selectable | null) {
	selectedThing = object?.id ?? null;
}

export function getItemFromId(id: number): ProjectObject | ProjectAnimation | null {
	return getProjectObjects().find(object => object.id === id) ?? getProjectAnimations().find(animation => animation.id === id) ?? null;
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
		projectAnimations.some(animation => getProperty(animation, "Name") === name && (exclude === undefined || animation.id !== exclude))
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
			intervalsOverlap(
				[getProperty<number>(projectAnimation, "Start Time")!, animationEndTime(projectAnimation)],
				[getProperty<number>(animation, "Start Time")!, animationEndTime(animation)]
			)
		);
}

export function intervalsOverlap([start1, end1]: [number, number], [start2, end2]: [number, number]): boolean {
	return end1 > start2 && end2 > start1;
}

export function nextAnimation(animation: ProjectAnimation): ProjectAnimation | null {
	return (
		getProjectAnimations()
			.filter(projectAnimation => projectAnimation.id !== animation.id)
			.toSorted((anim1, anim2) => getProperty<number>(anim1, "Start Time")! - getProperty<number>(anim2, "Start Time")!)
			.find(projectAnimation => getProperty<number>(projectAnimation, "Start Time")! > getProperty<number>(animation, "Start Time")!) ?? null
	);
}

export function previousAnimation(animation: ProjectAnimation): ProjectAnimation | null {
	return (
		getProjectAnimations()
			.filter(projectAnimation => projectAnimation.id !== animation.id)
			.toSorted((anim1, anim2) => getProperty<number>(anim1, "Start Time")! - getProperty<number>(anim2, "Start Time")!)
			.toReversed()
			.find(projectAnimation => getProperty<number>(projectAnimation, "Start Time")! < getProperty<number>(animation, "Start Time")!) ?? null
	);
}
