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

let isProjectSettingsOpen = $state(false);

export function openProjectSettingsWindow() {
	isProjectSettingsOpen = true;
}

export function closeProjectSettingsWindow() {
	isProjectSettingsOpen = false;
}

export function isProjectSettingsWindowOpen(): boolean {
	return isProjectSettingsOpen;
}

let isPreferencesOpen = $state(false);
let preferencesView = $state("general");

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

let openContextMenu: number | null = $state(null);

export function openMenu(id: number) {
	openContextMenu = id;
}

export function closeMenu() {
	openContextMenu = null;
}

export function isMenuOpen(id: number): boolean {
	return openContextMenu === id;
}

let nextMenuId = 0;

export function getNextMenuId() {
	return nextMenuId++;
}

let point: null | [number, number] = $state(null);

export function setPoint(x: number, y: number) {
	point = [x, y];
}

export function getPoint() {
	return point;
}

export function hidePoint() {
	point = null;
}

let isAddMenuVisible = $state(false);

export function showAddMenu() {
	isAddMenuVisible = true;
}

export function toggleAddMenuVisible(visible: boolean) {
	isAddMenuVisible = visible;
}

export function isAddMenuOpen(): boolean {
	return isAddMenuVisible;
}

let isNewProjectWindowVisible = $state(false);

export function showNewProjectWindow() {
	isNewProjectWindowVisible = true;
}

export function toggleNewProjectWindowVisible(visible: boolean) {
	isNewProjectWindowVisible = visible;
}

export function isNewProjectWindowOpen(): boolean {
	return isNewProjectWindowVisible;
}

export type Cache = {
	slidesMode: boolean;
	showMovieOverPreview: boolean;
	grid: boolean;
	lowRes: boolean;
	timelineSnapping: boolean;
	collapseWaitTimes: boolean;
	volume: number;
	loopVideo: boolean;
	videoState: "fullscreen" | "normal" | "pip";
	videoPipAlwaysOnTop: boolean;
};

/**
 * The stored cache for the current session. The cache is similar to `preferences`, except they're localized to the current
 * session and not saved between window restarts.
 */
let storedCache: Cache = $state({
	slidesMode: false,
	showMovieOverPreview: false,
	grid: false,
	lowRes: false,
	timelineSnapping: true,
	collapseWaitTimes: false,
	volume: 1,
	loopVideo: false,
	videoState: "normal",
	videoPipAlwaysOnTop: true,
});

export function cache<Key extends keyof Cache>(key: Key, value: Cache[Key]): void {
	storedCache[key] = value;

	if (key === "volume") {
		Array.from(document.querySelectorAll<HTMLAudioElement>(".audio")).forEach(audioElement => {
			audioElement.volume = value as number;
		});
	}
}

export function getFromCache<Key extends keyof Cache>(key: Key): Cache[Key] {
	return storedCache[key];
}

export function getCache(): Cache {
	return storedCache;
}

export function setCache(cache: Cache): void {
	storedCache = cache;
}

export function isInSelectionBox(element: HTMLElement): boolean {
	let selectionBox = document.getElementById("selection-box");
	if (!selectionBox) return false;

	let rectSelection = selectionBox.getBoundingClientRect();
	let rect = element.getBoundingClientRect();

	return rect.bottom > rectSelection.top && rect.right > rectSelection.left && rect.top < rectSelection.bottom && rect.left < rectSelection.right;
}

/**
 * The name of a key in the local cache map.
 *
 * If a generic type argument is provided, only keys that are mapped to values of that type
 * are returned. For example, `CacheKey<boolean>` only returns cache keys that have boolean
 * values.
 *
 * If no generic type argument is provided, all cache keys are returned.
 */
export type CacheKey<CacheValue = any> = { [Key in keyof Cache]: Cache[Key] extends CacheValue ? Key : never }[keyof Cache];
