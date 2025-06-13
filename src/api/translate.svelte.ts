import enGb from "../assets/languages/en-gb.json";
import enUs from "../assets/languages/en-us.json";
import es from "../assets/languages/es.json";

const languages = [
	{ code: "en-us", name: "English (US)", translations: enUs },
	{ code: "en-gb", name: "English (UK)", translations: enGb },
	{ code: "es", name: "Espa&ntilde;ol", translations: es },
] as const satisfies { code: string; translations: { [key: string]: string }; name: string }[];

export type LanguageName = typeof languages extends (infer L)[] ? (L extends { name: unknown } ? L["name"] : never) : never;
export type TranslationKey = keyof (typeof languages extends (infer L)[] ? (L extends { translations: unknown } ? L["translations"] : never) : never);

let language: LanguageName = $state(
	(() => {
		const code = localStorage.getItem("language");
		return languages.find(language => language.code === code)?.name ?? "English (US)";
	})()
);

export function getLanguage(): LanguageName {
	return language;
}

export function setLanguage(name: LanguageName) {
	language = name;
	localStorage.setItem("language", languages.find(supportedLanguage => supportedLanguage.name === name)!.code);
}

export function translate(translationKey: string): string {
	const translations = languages.find(supportedLanguage => supportedLanguage.name === language)!.translations;
	if (translationKey in translations) return (translations as any)[translationKey];
	return translationKey;
}

export function getLanguageNames(): LanguageName[] {
	return languages.map(language => language.name);
}
