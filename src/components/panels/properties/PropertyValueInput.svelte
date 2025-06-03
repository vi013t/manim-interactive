<script lang="ts" generics="T extends PropertyType">
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import { getObjectCategory, objects } from "../../../api/manim/objects";
	import { getPossibleProperties } from "../../../api/manim/properties";
	import type { PropertyType, PropertyValue } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { addError, getItemFromId, getProjectObjects, isNameTaken, removeError, selected, type ProjectAnimation, type ProjectObject } from "../../../api/project.svelte";
	import ErrorIcon from "../../icons/ErrorIcon.svelte";
	import HandleIcon from "../../icons/HandleIcon.svelte";
	import LatexIcon from "../../icons/LatexIcon.svelte";
	import QuestionMarkIcon from "../../icons/QuestionMarkIcon.svelte";
	import RightArrow from "../../icons/RightArrow.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import AddAnimationMenu from "../../menus/AddAnimationMenu.svelte";
	import AddObjectMenu from "../../menus/AddObjectMenu.svelte";
	import Select from "../../util/Select.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import LatexPreview from "./LatexPreview.svelte";
	import PropertyValueInput from "./PropertyValueInput.svelte";

	function deleteRegularProperty(name: string) {
		return function () {
			delete item!.properties[name];
			if (getPreferences().autosave) runAction("Save Project");
		};
	}

	function setRegularProperty(input: HTMLInputElement) {
		if (errorMessage || !hasValueChanged()) return;

		if (name === "startTime") {
			(item as unknown as ProjectAnimation).startTime = Number(input.value);
		} else if (name === "animation") {
		} else if (name === "objectType") {
			(item as ProjectObject).objectType = input.value;
		} else if (name === "name") {
			item.name = input.value.trim();
		} else if (type.base === "string" && "options" in type) {
			item.properties[name] = selectedOption;
		} else if (type.base === "string") {
			item.properties[name] = input.value;
		} else if (type.base === "object") {
			item.properties[name] = selectedOption;
		} else if (type.base === "number") {
			item.properties[name] = Number(input.value);
		} else if (type.base === "boolean") {
			item.properties[name] = booleanValue;
		}
		previousValue = input?.value;
		if (getPreferences().autosave) runAction("Save Project");
	}

	type Props = {
		setProperty?: (input: HTMLInputElement) => void;
		type: T;
		deleteProperty?: (name: string) => () => void;
		name: string;
		value: PropertyValue<T>;
		required: boolean;
	};

	let { type, name, value, deleteProperty = deleteRegularProperty, setProperty = setRegularProperty, required }: Props = $props();

	let objectValueInput = $state(value);

	// svelte-ignore non_reactive_update
	let addAnimationMenu: AddAnimationMenu;
	// svelte-ignore non_reactive_update
	let addObjectMenu: AddObjectMenu = null!;
	// svelte-ignore non_reactive_update
	let selectedOption: any = $state(value as any);

	let addButton: HTMLElement | null = $state(null);

	function addAnimation(event: MouseEvent) {
		addAnimationMenu.show();
	}

	function addObject(event: MouseEvent) {
		addObjectMenu.show();
	}

	let errorMessage: string | null = $state(null);

	// svelte-ignore non_reactive_update
	let input: HTMLInputElement;
	let inputValue = $state(`${value === null ? "" : value}`);

	let inputFocus = $state(false);

	function validate(): void {
		errorMessage = getErrorMessage();
		if (errorMessage) addError({ objectId: selected()!, propertyName: name });
		else removeError({ objectId: selected()!, propertyName: name });
	}

	function stringInput(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();

			validate();

			if (!errorMessage) {
				(event.target as HTMLElement).blur();
			}
		}
	}

	function getErrorMessage(): string | null {
		if (type.base === "number") {
			if (!/^-?\d+(\.\d+)?$/.test(input.value)) return "Value must be a number";
			let number = Number(input.value);
			if (type.isIntegeric && number !== Math.floor(number)) return "Value must be an integer";
			if (number < type.minimumValue) return `Value cannot be less than ${type.minimumValue}`;
			if (number > type.maximumValue) return `Value cannot be greater than ${type.maximumValue}`;
			return null;
		}

		if (required && (type.base === "object" || (type.base === "string" && "options" in type))) {
			if (selectedOption === null || selectedOption === undefined) return "Selection cannot be empty";
			return null;
		}

		if (type.base === "string" && !("options" in type)) {
			if (!type.canBeEmpty && input.value === "") return "Value cannot be empty";
			if (name === "name" && isNameTaken(input.value.trim(), selected()!)) return "Name is already taken";
			return null;
		}

		return null;
	}

	let inputHover = $state(false);
	let item = $derived(getItemFromId(selected()!)!);

	let previousValue = value;

	function hasValueChanged() {
		return input ? input.value !== previousValue : true;
	}

	function setColorProperty(color: string) {
		item.properties[name] = color;
		if (getPreferences().autosave) runAction("Save Project");
	}

	onMount(() => {
		console.log("value", $state.snapshot(value));
		validate();
	});

	function selectObject(type: string) {
		addObjectMenu.hide();
		objectValueInput = type;
		const possibleProperties = getPossibleProperties(type);
		const propertiesToDelete: string[] = [];
		Object.entries(item.properties).forEach(([propertyName, propertyValue]) => {
			let propertyBase = possibleProperties.find(property => property.name === propertyName);
			if (!propertyBase) propertiesToDelete.push(propertyName);
		});
		propertiesToDelete.forEach(property => {
			delete item.properties[property];
		});

		item.objectType = type;

		possibleProperties.forEach(property => {
			if (property.required) {
				item.properties[property.name] = (property.type as any).defaultValue ?? null;
			}
		});

		if (getPreferences().autosave) runAction("Save Project");
	}

	let Icon = $derived(objects.find(object => object.name === item.objectType)!.icon);
	let iconColor = $derived(getObjectCategory(objects.find(object => object.name === item.objectType)!.categories[0]).color);

	let top = $state("100px");
	let left = $state("100px");

	let menuVisible = $derived(addObjectMenu?.isVisible());

	let booleanValue: boolean = $state(value as boolean);

	let listElements: HTMLElement[] = $state([]);
	let grabElement: HTMLElement | null = $state(null);
	let grabY = $state(0);
	let grabbingIndex = $state(0);

	let listCollapsed = $state(false);

	let altHeld = $state(false);

	onMount(() => {
		document.addEventListener("mouseup", event => {
			if (grabElement) {
				grabElement = null;
				console.log(event.clientY - grabY);
				if (event.clientY - grabY > 50) {
					console.log(`swapping ${grabbingIndex} with ${grabbingIndex + 1}`);
					console.log($state.snapshot(item.properties[name]));
					let list: any[] = item.properties[name] as any[];
					let temp = list[grabbingIndex];
					list[grabbingIndex] = list[grabbingIndex + 1];
					list[grabbingIndex + 1] = temp;
					runAction("Save Project");
				}
			}
		});

		document.addEventListener("mousemove", event => {
			if (grabElement) {
			}
		});

		document.addEventListener("keydown", event => {
			altHeld = event.altKey;
		});

		document.addEventListener("keyup", event => {
			altHeld = event.altKey;
		});
	});
</script>

<!-- Animation -->
<span class="property" style:align-items={type.base === "list" && (value.length || !listCollapsed) ? "start" : "center"}>
	{#if name}
		<span class="property-name">
			{name === "name" ? "Name" : name === "objectType" ? "Type" : name}:
		</span>
	{/if}
	{#key getItemFromId(selected()!)}
		{#if type.base === "animation"}
			<button class="add-animation" bind:this={addButton} onclick={addAnimation}>
				{value}
			</button>
			<AddAnimationMenu bind:this={addAnimationMenu} {top} {left} openers={[addButton]} />

			<!-- Object Type -->
		{:else if type.base === "objectType"}
			<button
				class="add-animation"
				{@attach element => {
					top = `calc(${element.getBoundingClientRect().top}px + 1.5rem)`;
					left = `${element.getBoundingClientRect().left}px`;
				}}
				bind:this={addButton}
				onclick={addObject}
			>
				<Icon stroke={iconColor} style="width: 1rem; height: 1rem" />
				{objectValueInput}
				<RightArrow stroke="#b4befe" style="width: 1rem; height: 1rem; margin-left: auto; transform: rotate({menuVisible ? '90deg' : '0deg'}); transition: transform 0.1s;" />
			</button>
			<AddObjectMenu background="#1e1e2e" onSelect={selectObject} bind:this={addObjectMenu} {top} {left} openers={[addButton]} title={false} />

			<!-- Object -->
		{:else if type.base === "object"}
			<Select
				options={getProjectObjects()
					.filter(object => object.id !== selected())
					.map(object => {
						const manimObject = objects.find(manimObject => manimObject.name === object.objectType)!;
						const category = getObjectCategory(manimObject.categories[0]);
						return { name: object.name, icon: manimObject.icon, color: category.color };
					})}
				onSelect={name => {
					selectedOption = getProjectObjects().find(manimObject => manimObject.name === name)!.id;
					validate();
					setProperty(input);
				}}
				value={(() => {
					if (selectedOption) {
						const object = getItemFromId(selectedOption)!;
						const manimObject = objects.find(manimObject => manimObject.name === object.objectType)!;
						const category = getObjectCategory(manimObject.categories[0]);
						return { name: object.name, icon: manimObject.icon, color: category.color };
					} else {
						return "";
					}
				})()}
				style={`outline: 2px solid ${selectedOption ? "transparent" : "#f38ba8"}`}
			/>

			<!-- Color -->
		{:else if type.base === "color"}
			<ColorPicker onSelect={setColorProperty} />

			<!-- Boolean -->
		{:else if type.base === "boolean"}
			<button style:background-color={booleanValue ? "#a6e3a1" : "#f38ba8"} onclick={() => (booleanValue = !booleanValue)} class="boolean-button">
				{booleanValue ? "Yes" : "No"}
			</button>

			<!-- Select -->
		{:else if type.base === "string" && "options" in type}
			<Select
				onSelect={() => {
					validate();
					setProperty(input);
				}}
				options={type.options}
				itemOverride={name === "Font" && altHeld ? (item.properties["Text"] as string) : undefined}
				bind:value={selectedOption}
			/>

			<!-- List -->
		{:else if type.base === "list"}
			<div class="list">
				{#if !(value as any[]).length || listCollapsed}
					<span style:align-items="center">
						<button class="list-items-header" onclick={() => (listCollapsed = false)}>
							[{value.length === 0 ? "No" : value.length} Items] (Click to Expand)
						</button>
						{#if !listCollapsed && value.length !== 0}
							<button
								onclick={() => {
									(item.properties[name] as any).push((type.type as any).defaultValue);
								}}
							>
								Add Another
							</button>
						{:else}
							<button onclick={deleteProperty(name)}><TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" /></button>
						{/if}
					</span>
				{/if}

				{#if !listCollapsed}
					{#each value as element, index (index)}
						<span bind:this={listElements[index]} animate:flip>
							<span>
								<PropertyValueInput
									type={type.type}
									name={null!}
									value={element}
									required={false}
									deleteProperty={function () {
										return function () {
											(item.properties[name] as any[]).splice(index, 1);
										};
									}}
									setProperty={function (input: HTMLInputElement) {
										(item.properties[name] as unknown[])[index] = input.value;
										runAction("Save Project");
									}}
								/>
								<button
									class="handle"
									onmousedown={() => {
										grabbingIndex = index;
										grabY = listElements[index].getBoundingClientRect().top;
										grabElement = listElements[index];
									}}
									style:cursor={grabElement === listElements[index] ? "grabbing" : "grab"}
								>
									<HandleIcon stroke="#585b70" style="width: 1rem; height: 1rem;" />
								</button>
								{#if index === 0}
									<button onclick={() => (listCollapsed = !listCollapsed)}>Collapse</button>
								{/if}
							</span>
						</span>
					{/each}
				{:else}{/if}

				{#if !listCollapsed}
					<span class="list-bottom">
						<button
							onclick={() => {
								(item.properties[name] as any).push((type.type as any).defaultValue);
							}}
						>
							Add Another
						</button>
						<button onclick={deleteProperty(name)} style="color: #f38ba8;">Delete All</button>
					</span>
				{/if}
			</div>

			<!-- string, number -->
		{:else if type.base === "string" || type.base === "number"}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div onmouseenter={() => (inputHover = true)} onmouseleave={() => (inputHover = false)} class="input-container">
				<input
					style:font-family={type.base === "string" && type.isMath ? "monospace" : "inherit"}
					onfocus={() => (inputFocus = true)}
					onblur={() => {
						setProperty(input);
						inputFocus = false;
					}}
					bind:this={input}
					style:outline={errorMessage ? "2px solid #f38ba8" : "none"}
					type="text"
					oninput={validate}
					onkeydown={stringInput}
					autocomplete="off"
					bind:value={inputValue}
				/>

				{#if type.base === "string" && type.isMath}
					<a href="https://www.overleaf.com/learn/latex/Mathematical_expressions" target="_blank">
						<QuestionMarkIcon stroke="#cdd6f4" style="width: 1rem; height: 1rem;" />
					</a>
					<LatexIcon stroke="#cdd6f4" style="width: 3rem; position: absolute; left: 17rem;" />
					<LatexPreview latex={inputValue} show={inputHover || inputFocus} />
				{/if}
			</div>
		{/if}

		{#if errorMessage}
			<span class="error">
				<ErrorIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
				<span>{errorMessage}</span>
			</span>
		{/if}

		{#if !required && type.base !== "list"}
			<button onclick={deleteProperty(name)}><TrashIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" /></button>
		{/if}
	{/key}
</span>

<style>
	input,
	button,
	.add-animation {
		color: #cdd6f4;
		background: #11111b;
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.input-container {
		position: relative;
		display: flex;
		gap: 0.5rem;
		align-items: center;

		a {
			align-items: center;
			display: flex;
		}
	}

	.add-animation {
		width: 20rem;
	}

	input[type="text"] {
		width: 20rem;
	}

	.error {
		gap: 0.5rem;
		margin-left: 0.5rem;
		span {
			color: #f38ba8;
		}
	}

	.boolean-button {
		width: 20rem;
		border-radius: 0.5rem;
		color: #11111b;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		padding: 0.2rem;
	}

	.list {
		display: flex;
		flex-direction: column;
		width: 22rem;
		gap: 0.5rem;
		position: relative;

		button:not(.list-items-header) {
			width: fit-content;
			margin-left: auto;
		}

		.handle {
			background-color: transparent;
			cursor: grab;
		}

		&:has(span:not(:first-child))::before {
			content: "";
			display: block;
			position: absolute;
			height: calc(100% - 4.75rem);
			width: 0.5rem;
			bottom: 3rem;
			left: -1rem;
			border-left: 1px solid #313244;
			border-bottom: 1px solid #313244;
		}
	}

	.property {
		gap: 0.5rem;
	}

	.property-name {
		width: 12rem;
		justify-content: right;
	}

	.list-items-header {
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		background-color: #11111b;
		width: 20rem;
		padding: 0.25rem;
	}

	.list-bottom {
		justify-content: flex-end;
		align-items: center;
		gap: 0.5rem;
		width: 100%;

		> * {
			margin-left: 0px !important;
		}
	}
</style>
