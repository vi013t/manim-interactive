import enGb from "../assets/languages/en-gb.json";
import enUs from "../assets/languages/en-us.json";
import es from "../assets/languages/es.json";

const languages = [
	{ name: "English (US)", translations: enUs },
	{ name: "English (UK)", translations: enGb },
	{ name: "Espa&ntilde;ol", translations: es },
] as const satisfies { translations: { [key: string]: string }; name: string }[];

export type LanguageName = typeof languages extends (infer L)[] ? (L extends { name: unknown } ? L["name"] : never) : never;
export type TranslationKey = keyof (typeof languages extends (infer L)[] ? (L extends { translations: unknown } ? L["translations"] : never) : never);

let language: LanguageName = $state("English (US)");

export function getLanguage(): LanguageName {
	return language;
}

export function setLanguage(name: LanguageName) {
	language = name;
}

export function translate(translationKey: string): string {
	const translations = languages.find(supportedLanguage => supportedLanguage.name === language)!.translations;
	if (translationKey in translations) return (translations as any)[translationKey];
	return translationKey;
}

export function getLanguageNames(): LanguageName[] {
	return languages.map(language => language.name);
}
