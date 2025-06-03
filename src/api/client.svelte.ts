let mouseX = $state(0);
let mouseY = $state(0);

export function getMouseX(): number {
	return mouseX;
}

export function getMouseY(): number {
	return mouseY;
}

export function updateMouseCoordinates(x: number, y: number): void {
	mouseX = x;
	mouseY = y;
}

export function getHorizontalExpandDirection(): "left" | "right" {
	return mouseX < screen.width / 2 ? "right" : "left";
}

export function getVerticalExpandDirection(): "top" | "bottom" {
	return mouseY < screen.height / 2 ? "bottom" : "top";
}

export function getHorizontalExpandDirectionFromPosition(position: number): "left" | "right" {
	return position < screen.width / 2 ? "right" : "left";
}

export function getVerticalExpandDirectionFromPosition(position: number): "top" | "bottom" {
	return position < screen.height / 2 ? "bottom" : "top";
}

let isPreferencesOpen = $state(false);
let preferencesView = $state("appearance");

export function openPreferencesWindow() {
	isPreferencesOpen = true;
}

export function closePreferencesWindow() {
	isPreferencesOpen = false;
}

export function isPreferencesWindowOpen(): boolean {
	return isPreferencesOpen;
}

export function setPreferencesView(view: string) {
	preferencesView = view;
}

export function getPreferencesView(): string {
	return preferencesView;
}

export function cursorIsIn(rect: DOMRect): boolean {
	return mouseX >= rect.x && mouseX <= rect.x + rect.width && mouseY >= rect.y && mouseY <= rect.y + rect.height;
}
