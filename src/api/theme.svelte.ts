import cattpuccinLatte from "../assets/themes/catppuccin_latte.css?raw";

export function setTheme(theme: Theme) {
	Array.from(document.querySelectorAll("*[data-theme]")).forEach(element => element.remove());

	let style = document.createElement("style");
	style.setAttribute("data-theme", theme.name);
	style.innerHTML = theme.data;

	document.head.appendChild(style);
}

export type Theme = {
	name: string;
	data: string;
	isDefault: boolean;
};

function getDefaultThemes(): Theme[] {
	return [
		{
			name: "Catppuccin Latte",
			data: cattpuccinLatte,
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
