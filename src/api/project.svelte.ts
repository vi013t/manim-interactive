import { join, sep, tempDir } from "@tauri-apps/api/path";
import { runAction } from "./preferences.svelte";

let projectLocation: string | null = $state(null);
let projectName: string | null = $state(null);
let id = 0;
let projectObjects: ObjectEntry[] = $state([]);
let projectAnimations: ProjectAnimation[] = $state([]);

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

export function saveProjectData(): string {
	return JSON.stringify({
		objects: projectObjects,
		animations: projectAnimations,
		nextId: id,
	});
}

export function loadProjectData(data: string) {
	const { objects, animations, nextId } = JSON.parse(data);
	projectAnimations = animations;
	projectObjects = objects;
	id = nextId;
}

export function getProjectAnimations(): ProjectAnimation[] {
	return projectAnimations;
}

export function getProjectObjects(): ObjectEntry[] {
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

export type ObjectGroup = {
	name: string;
	id: number;
	objects: ProjectObject[];
	groups: ObjectGroup[];
};

export type ObjectEntry = ProjectObject | ObjectGroup;

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

export function addProjectObject(object: ObjectEntry) {
	projectObjects.push(object);
}

export function removeProjectObject(id: number) {
	if (selected()?.id === id) select(null);
	projectObjects = projectObjects.filter(object => object.id !== id);
	projectAnimations = projectAnimations.filter(animation => !animation.objects.includes(id));
	runAction("Save Project");
}

type Selectable = ProjectObject | ProjectAnimation;

let selectedThing: Selectable | null = $state(null);

export function selected(): Selectable | null {
	return selectedThing;
}

export function select(object: Selectable | null) {
	selectedThing = object;
}

export function getItemFromId(id: number): ObjectEntry | null {
	return getProjectObjects().find(object => object.id === id) ?? null;
}

let errors: Set<number> = $state(new Set([]));

export function addErrorId(errorId: number): void {
	errors.add(errorId);
}

export function projectHasErrors(): boolean {
	return errors.size !== 0;
}

export function removeErrorId(errorId: number): void {
	errors.delete(errorId);
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
