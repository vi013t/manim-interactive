let developerMode = $state(false);

export function setDeveloperMode(mode: boolean) {
	developerMode = mode;
}

export function isDeveloperMode() {
	return developerMode;
}
