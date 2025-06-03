import { invoke } from "@tauri-apps/api/core";

let fonts: string[] = $state([]);

export async function load_fonts() {
	fonts = await invoke<string[]>("get_fonts");
}

export async function get_fonts(): Promise<string[]> {
	if (fonts.length === 0) await load_fonts();
	return fonts;
}
