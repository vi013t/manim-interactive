import { animationEndTime, getProjectAnimations } from "./project.svelte";

let timeInSeconds = $state(0);

export function currentTime() {
	return timeInSeconds;
}

export function setCurrentTime(newTime: number) {
	timeInSeconds = newTime;
}

export function getRelativeTime(absoluteTime: number) {
	let available = getProjectAnimations()
		.map(animation => absoluteTime - animationEndTime(animation))
		.filter(timeDifference => timeDifference >= 0);
	return available.length === 0 ? absoluteTime : Math.min(...available);
}
