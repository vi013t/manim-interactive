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
