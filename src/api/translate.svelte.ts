import enGb from "../assets/languages/en-gb.json";
import enUs from "../assets/languages/en-us.json";
import es from "../assets/languages/es.json";

/**
 * The supported languages in the system.
 *
 * @field code The ISO-639 language code.
 * @field name The human-readable name of the language.
 * @field translations A map between English phrases and their translations into this language.
 */
const languages = [
	{ code: "en-us", name: "English (US)", translations: enUs },
	{ code: "en-gb", name: "English (UK)", translations: enGb },
	{ code: "es", name: "Español", translations: es },
] as const satisfies { code: string; translations: { [key: string]: string }; name: string }[];

/** The name of a supported language. */
export type LanguageName = typeof languages extends (infer L)[] ? (L extends { name: unknown } ? L["name"] : never) : never;

/**
 * The name of the currently selected language.
 */
let language: LanguageName = $state(
	(() => {
		const code = localStorage.getItem("language");
		return languages.find(language => language.code === code)?.name ?? "English (US)";
	})()
);

/**
 * Returns the name of the language currently in use.
 */
export function getLanguage(): LanguageName {
	return language;
}

/**
 * Sets the current language to the given language name. The UI will automatically update, and the new
 * preferred language will be saved as the default in `localStorage`.
 *
 * @param name The name of the language to use for the app.
 */
export function setLanguage(name: LanguageName): void {
	language = name;
	localStorage.setItem("language", languages.find(supportedLanguage => supportedLanguage.name === name)!.code);
}

/**
 * Translates the given text into the language currently in use. If no translation exists for the given phrase,
 * the original text is returned.
 *
 * Translations are stored in `/src/assets/languages`.
 *
 * @param text The text to translate
 *
 * @returns The translated text
 */
export function translate(text: string): string {
	const translations = languages.find(supportedLanguage => supportedLanguage.name === language)!.translations;
	if (text in translations) return (translations as any)[text];
	if (language !== "English (US)" && language !== "English (UK)") console.warn(`Missing translation for phrase "${text}" in language ${language}`);
	return text;
}

/**
 * Returns a list of the names of all supported languages.
 */
export function getLanguageNames(): LanguageName[] {
	return languages.map(language => language.name);
}
