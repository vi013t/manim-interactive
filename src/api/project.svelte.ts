import { join, tempDir } from "@tauri-apps/api/path";

let projectLocation: string | null = $state(null);
let projectName: string | null = $state(null);
let id = 0;
let projectObjects: ObjectEntry[] = $state([]);
let projectAnimations: Animation[] = $state([]);

export async function getProjectLocation(): Promise<string> {
	return projectLocation ?? join(await tempDir(), "manim-interactive-project");
}

export function getProjectName(): string | null {
	return projectName;
}

export function setProjectLocation(location: string) {
	projectLocation = location;
}

export function setProjectName(name: string) {
	projectName = name;
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

export function getProjectAnimations(): Animation[] {
	return projectAnimations;
}

export function getProjectObjects(): ObjectEntry[] {
	return projectObjects;
}

export function addProjectAnimation(animation: Animation) {
	projectAnimations.push(animation);
}

export type ManimObject = {
	name: string;
	id: number;
	objectType: string;
	properties: { [key: string]: unknown };
};

export type ObjectGroup = {
	name: string;
	id: number;
	objects: ManimObject[];
	groups: ObjectGroup[];
};

export type ObjectEntry = ManimObject | ObjectGroup;

export type Animation = {
	id: number;
	name: string;
	objects: number[];
	properties: { [key: string]: unknown };
};

export function nextId() {
	return id++;
}

export function addProjectObject(object: ObjectEntry) {
	projectObjects.push(object);
}

export function removeProjectObject(id: number) {
	projectObjects = projectObjects.filter(object => object.id !== id);
}

type Selectable = ManimObject | Animation;

let selectedThing: Selectable | null = $state(null);

export function selected(): Selectable | null {
	return selectedThing;
}

export function select(object: Selectable | null) {
	selectedThing = object;
}

export type Item = {
	objectType: string;
	properties: { [key: string]: unknown };
};

export function getItemFromId(id: number): Item {
	return getProjectObjects().find(object => "objectType" in object && object.id === id) as Item;
}

export function addProperty(id: number, name: string, value: unknown) {
	(getProjectObjects().find(object => object.id === id) as ManimObject).properties[name] = value;
}
