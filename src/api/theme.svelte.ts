import catppuccinFrappe from "../assets/themes/catppuccin_frappe.css?raw";
import catppuccinLatte from "../assets/themes/catppuccin_latte.css?raw";
import catppuccinMacchiato from "../assets/themes/catppuccin_macchiato.css?raw";
import midnight from "../assets/themes/midnight.css?raw";

export function setTheme(name: string) {
	localStorage.setItem("theme", name);
	const theme = themes.find(theme => theme.name === name)!;

	Array.from(document.querySelectorAll("*[data-theme]")).forEach(element => element.remove());

	let style = document.createElement("style");
	style.setAttribute("data-theme", theme.name);
	style.innerHTML = theme.data;

	document.head.appendChild(style);
}

export function getTheme() {
	return document.querySelector("*[data-theme]")?.getAttribute("data-theme") ?? "Catppuccin Mocha";
}

export type Theme = {
	name: string;
	data: string;
	isDefault: boolean;
	isDark?: boolean;
};

function getDefaultThemes(): Theme[] {
	return [
		{
			name: "Catppuccin Frappe",
			data: catppuccinFrappe,
			isDark: true,
		},
		{
			name: "Catppuccin Latte",
			data: catppuccinLatte,
		},
		{
			name: "Catppuccin Macchiato",
			data: catppuccinMacchiato,
			isDark: true,
		},
		{
			name: "Catppuccin Mocha",
			data: "",
			isDark: true,
		},
		{
			name: "Midnight",
			data: midnight,
			isDark: true,
		},
	].map(theme => ({
		...theme,
		data: theme.data.replaceAll(/;\n/g, " !important;\n"),
		isDefault: true,
	}));
}

let themes: Theme[] = $state(getDefaultThemes());

export function getThemes(): Theme[] {
	return themes;
}

export function loadTheme() {
	const theme = localStorage.getItem("theme");
	if (theme) setTheme(theme);
}
