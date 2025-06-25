import CircleIcon from "../../components/icons/CircleIcon.svelte";
import type { Icon } from "../../components/icons/Icon";
import PlusIcon from "../../components/icons/PlusIcon.svelte";
import ReticleIcon from "../../components/icons/ReticleIcon.svelte";
import RotateIcon from "../../components/icons/RotateIcon.svelte";
import ScaleIcon from "../../components/icons/ScaleIcon.svelte";
import TrashIcon from "../../components/icons/TrashIcon.svelte";
import { property, propertyValueToString, type PropertyType, type PropertyValue } from "./property";

const defaultEventProperties = [{ name: "Time", type: property().number().nonnegative() }] as const;

export const events = [
	{
		name: "Hide Object",
		icon: TrashIcon,
		color: "var(--red)",
		properties: [{ name: "Object", type: property().object() }, ...defaultEventProperties],
		codegen(properties: { [key: string]: unknown }) {
			return `self.remove(object_${propertyValueToString(property().object(), properties.Object)})`;
		},
	},
	{
		name: "Move Object",
		icon: ReticleIcon,
		color: "var(--yellow)",
		properties: [
			{ name: "Object", type: property().object() },
			{ name: "Relative", type: property().boolean() },
			{ name: "Position", type: property().coordinate() },
			...defaultEventProperties,
		],
		codegen(properties: { [key: string]: unknown }) {
			const functionName = properties.Relative ? "shift" : "move_to";
			return `${propertyValueToString(property().object(), properties.Object)}.${functionName}(${propertyValueToString(property().coordinate(), properties.Position)})`;
		},
	},
	{
		name: "Rotate Object",
		icon: RotateIcon,
		color: "var(--peach)",
		properties: [{ name: "Object", type: property().object() }, { name: "Rotation", type: property().number().angle() }, ...defaultEventProperties],
		codegen(properties: { [key: string]: unknown }) {
			return `${propertyValueToString(property().object(), properties.Object)}.rotate(${propertyValueToString(property().coordinate(), properties.Scale)})`;
		},
	},
	{
		name: "Scale Object",
		icon: ScaleIcon,
		color: "var(--blue)",
		properties: [{ name: "Object", type: property().object() }, { name: "Scale", type: property().number().positive() }, ...defaultEventProperties],
		codegen(properties: { [key: string]: unknown }) {
			return `${propertyValueToString(property().object(), properties.Object)}.scale(${propertyValueToString(property().coordinate(), properties.Scale)})`;
		},
	},
	{
		name: "Show Object",
		icon: PlusIcon,
		color: "var(--green)",
		properties: [{ name: "Object", type: property().object() }, ...defaultEventProperties],
		codegen(properties: { [key: string]: unknown }) {
			return `self.add(${propertyValueToString(property().object(), properties.Object)})`;
		},
	},
	{
		name: "Empty Event",
		color: "var(--overlay-0)",
		icon: CircleIcon,
		properties: [...defaultEventProperties],
	},
] as const satisfies Readonly<{
	name: string;
	icon: Icon;
	color: string;
	properties: Readonly<{ name: string; type: PropertyType }>[];
	codegen?(properties: { [key: string]: unknown }): string;
}>[];

export type ManimEvent = Readonly<{
	name: EventName;
	icon: Icon;
	color: string;
	properties: Readonly<{ name: string; type: PropertyType }>[];
	codegen?(properties: { [key: string]: unknown }): string;
}>;

export type EventName = typeof events extends (infer E)[] ? (E extends { name: string } ? E["name"] : never) : never;
export type EventPropertyValue<Name extends EventPropertyName> = typeof events extends (infer E)[]
	? E extends { readonly properties: readonly (infer P)[] }
		? P extends { name: Name; type: infer T }
			? T extends PropertyType
				? PropertyValue<T>
				: never
			: never
		: never
	: never;
export type EventPropertyName =
	| "Name"
	| (typeof events extends (infer E)[] ? (E extends { readonly properties: (infer P)[] } ? (P extends { name: string } ? P["name"] : never) : never) : never);
export type EventProperties = { [Key in Exclude<EventPropertyName, "Object Type" | "Name">]?: EventPropertyValue<Key> } & { "Event Type": EventName; Name: string };
