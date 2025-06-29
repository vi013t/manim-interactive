import { property, type PropertyType, type PropertyValue } from "./manim/property";

export const audioProperties = [
	{ name: "Name", type: property().string().notEmpty(), categories: ["Special"], description: "The name of the audio.", required: true },
	{ name: "Start Time", type: property().number().nonnegative(), categories: ["Special"], description: "The starting time of the audio.", required: true },
	{ name: "Volume", type: property().number().percent().default(1), categories: ["Special"], description: "The volume of the audio." },
	{ name: "Embedded Source", type: property().file().types("mp3").requiresNot("Linked Source"), categories: ["Special"], description: "The source of the audio." },
	{ name: "Linked Source", type: property().string().path().requiresNot("Embedded Source"), categories: ["Special"], description: "The source of the audio." },
] as const satisfies Readonly<{ name: string; type: PropertyType; categories: "Special"[]; description: string; required?: true }>[];

export type AudioPropertyName = typeof audioProperties extends (infer P)[] ? (P extends { name: infer N } ? N : never) : never;
export type AudioPropertyValue<Name extends AudioPropertyName> = typeof audioProperties extends (infer P)[]
	? P extends { name: Name; type: infer T }
		? T extends PropertyType
			? PropertyValue<T>
			: never
		: never
	: never;

export type AudioProperties = { [Name in AudioPropertyName]?: AudioPropertyValue<Name> };
export type AudioProperty = typeof audioProperties extends (infer P)[] ? P : never;
