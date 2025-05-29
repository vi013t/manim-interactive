import { join, sep, tempDir } from "@tauri-apps/api/path";
import { runAction } from "./preferences.svelte";

let projectLocation: string | null = $state(null);
let projectName: string | null = $state(null);
let id = 0;

let projectObjects: ProjectObject[] = $state([]);
let projectAnimations: ProjectAnimation[] = $state([]);
let projectAudios: ProjectAudio[] = $state([]);
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
	name: string;
	id: number;
	objectType: string;
	properties: { [key: string]: unknown };
};

export type ProjectAnimation = {
	id: number;
	name: string;
	objects: number[];
	startTime: number;
	duration: number;
	properties: { [key: string]: unknown };
};

export function animationEndTime(animation: ProjectAnimation): number {
	return animation.startTime + animation.duration;
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
	projectAnimations = projectAnimations.filter(animation => !animation.objects.includes(id));
	projectAudios = projectAudios.filter(audio => audio.id !== id);
	errors = errors.filter(error => error.objectId !== id);
	runAction("Save Project");
}

type Selectable = ProjectObject | ProjectAnimation;

let selectedThing: number | null = $state(null);

export function selected(): number | null {
	return selectedThing;
}

export function select(object: Selectable | null) {
	selectedThing = object?.id ?? null;
}

export function getItemFromId(id: number): ProjectObject | null {
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

export function addNotification(header: string, message: string, severity: "normal" | "error" | "warning" = "normal") {
	let id = notificationId++;
	notifications.push({
		header,
		message,
		severity,
		id,
	});

	setTimeout(() => {
		notifications = notifications.filter(notification => notification.id !== id);
	}, 5000);
}

export function getNotifications(): NotificationData[] {
	return notifications;
}

export function removeNotification(id: number): void {
	notifications = notifications.filter(notification => notification.id !== id);
}

export function isNameTaken(name: string, exclude?: number): boolean {
	return (
		projectObjects.some(object => object.name === name && (exclude === undefined || object.id !== exclude)) ||
		projectAnimations.some(animation => animation.name === name && (exclude === undefined || animation.id !== exclude))
	);
}
