<script lang="ts">
	import { getPropertyTypeColor, getPropertyTypeIcon } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import { getProjectVariables, type ProjectVariable } from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import PlusIcon from "../../icons/PlusIcon.svelte";
	import AddVariableMenu from "../../menus/AddVariableMenu.svelte";
	import PropertyValueInput from "../properties/PropertyValueInput.svelte";

	let top = $state("");
	let left = $state("");
	let addVariableMenu: AddVariableMenu;

	function addVariable(event: MouseEvent) {
		event.preventDefault();
		top = `${event.clientY}px`;
		left = `${event.clientX}px`;
		addVariableMenu.show();
	}

	function setVariableValue(variable: ProjectVariable) {
		return function (value: unknown) {
			variable.value = value;
			if (getPreferences().autosave) runAction("Save And Recompile Project");
		};
	}

	function input(event: KeyboardEvent) {
		if (event.key === "Enter") {
			(event.target as HTMLElement).blur();
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section oncontextmenu={addVariable} id="variables-panel">
	<div class="header">
		<h1>{translate("Variables")}</h1>
		<button>
			<PlusIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	<div class="variables">
		{#each getProjectVariables() as variable (variable.id)}
			{@const Icon = getPropertyTypeIcon(variable.type.base)}
			<span>
				<span>
					<Icon stroke={getPropertyTypeColor(variable.type.base)} style="width: 1rem; height: 1rem;" />
					<span contenteditable onkeydown={input} bind:textContent={variable.name}>{name}</span>
				</span>

				<span>
					<PropertyValueInput
						setProperty={setVariableValue(variable)}
						canBeVariable={false}
						width="12rem"
						name="Initial Value"
						type={variable.type}
						value={variable.value}
						required
					/>
				</span>

				<span>
					<PropertyValueInput
						setProperty={setVariableValue(variable)}
						canBeVariable={false}
						name="Current Value"
						width="12rem"
						type={variable.type}
						value={variable.value}
						required
					/>
				</span>
			</span>
		{/each}
	</div>
</section>
<AddVariableMenu bind:this={addVariableMenu} {top} {left} />

<style>
	.variables {
		display: flex;
		flex-direction: column;

		> span {
			align-items: center;
			color: var(--text);

			> span {
				gap: 0.5rem;
			}
		}

		span[contenteditable] {
			padding: 0.5rem;
			border-radius: 0.5rem;

			&:focus {
				background-color: var(--crust);
			}
		}
	}

	section {
		background-color: var(--mantle);
		height: 100%;
		padding: 1rem;
		overflow-y: auto;
		width: 50%;
	}

	.header {
		display: flex;
		width: 100%;
		align-items: center;
		position: relative;

		h1 {
			text-transform: uppercase;
			font-size: 0.75rem;
			color: var(--overlay-2);
			margin-bottom: 1rem;
		}

		button {
			margin-left: auto;
			padding: 0.25rem;
			border-radius: 0.25rem;

			&:hover {
				background: rgba(255, 255, 255, 8%);
			}
		}
	}
</style>
