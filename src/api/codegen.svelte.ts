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

let objects: ObjectEntry[] = $state([]);

export function allObjects() {
	return objects;
}

let id = 0;

export function nextId() {
	return id++;
}

export function addObjectEntry(object: ObjectEntry) {
	objects.push(object);
}

export function removeObjectEntry(id: number) {
	objects = objects.filter(object => object.id !== id);
}

const animations: Animation[] = $state([]);

export function allAnimations(): Animation[] {
	return animations;
}

export function addAnimation(animation: Animation) {
	animations.push(animation);
}

export const projectLocation = "C:\\Users\\violet\\OneDrive\\Documents\\Coding\\manim-interactive\\test";

export function generateCode(): string {
	const objectLines = objects.map(object => ("objectType" in object ? `\t\tvar = ${object.objectType}()` : ""));
	const animationLines = animations.map(animation => `\t\tself.play(${animation.name}(${animation.objects.join(",")}))`);

	return `from manim import *

class Main(Scene):
	def construct(self):
${objectLines}
${animationLines}
`;
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
	return objects.find(object => "objectType" in object && object.id === id) as Item;
}

export function addProperty(id: number, name: string, value: unknown) {
	(objects.find(object => object.id === id) as ManimObject).properties[name] = value;
}
