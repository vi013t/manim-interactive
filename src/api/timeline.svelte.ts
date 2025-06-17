let timeInSeconds = $state(0);

export function currentTime() {
	return timeInSeconds;
}

export function setCurrentTime(newTime: number) {
	timeInSeconds = newTime;
}

let intervalId: number | null = $state(null);
let framesPerSecond = 60;

export function togglePlaying() {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	} else {
		intervalId = setInterval(() => {
			timeInSeconds += 1.0 / framesPerSecond;
			if (timeInSeconds > 120) {
				clearInterval(intervalId!);
				intervalId = null;
			}
		}, 1000.0 / framesPerSecond);
	}
}

export function isPlaying() {
	return intervalId !== null;
}

export function moveFrames(frames: number) {
	timeInSeconds += frames / framesPerSecond;
}
