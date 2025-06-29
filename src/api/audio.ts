import { property, type PropertyType, type PropertyValue } from "./manim/property";

export const audioProperties = [
	{ name: "Name", type: property().string().notEmpty(), categories: ["Special"], description: "The name of the audio." },
	{ name: "Start Time", type: property().number().nonnegative(), categories: ["Special"], description: "The starting time of the audio." },
	{ name: "Volume", type: property().number().percent().default(1), categories: ["Special"], description: "The volume of the audio." },
	{ name: "Source", type: property().string().path(), categories: ["Special"], description: "The source of the audio." },
	{ name: "Dynamic", type: property().boolean(), categories: ["Special"], description: "Whether to load the audio from a file path instead of storing the raw data." },
] as const satisfies Readonly<{ name: string; type: PropertyType; categories: "Special"[]; description: string }>[];

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
