import { invoke } from "@tauri-apps/api/core";
import { addNotification } from "./project.svelte";

let fonts: string[] = $state([]);

export async function loadFonts() {
	fonts = await invoke<string[]>("get_fonts");
}

export async function getFonts(): Promise<string[]> {
	if (fonts.length === 0) await loadFonts();
	return fonts;
}

export async function checkRequirements() {
	const requirements = [
		{ name: "Python 3", exe: "python3", link: "https://www.python.org/downloads/" },
		{ name: "UV", exe: "uv", link: "https://github.com/astral-sh/uv" },
		{ name: "LaTeX", exe: "tex", link: "https://miktex.org/download" },
	];

	await Promise.all(
		requirements.map(async requirement => {
			if (!(await invoke<boolean>("command_exists", { command: requirement.exe }))) {
				addNotification(
					`Missing Requirement "${requirement.name}"`,
					`The program "${requirement.name} must be installed to use Manim Interactive, but it's not currently installed. Get it <a href="${requirement.link}">here</a>.`,
					{ severity: "error", autohide: false },
				);
			}
		}),
	);
}
