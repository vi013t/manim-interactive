<script lang="ts">
	import { generateAnimationPreview, generateObjectPreview } from "../../../api/codegen.svelte";
	import { getPropertyTypeColor, getPropertyTypeIcon } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import {
		addError,
		deleteProjectItem,
		getItemFromId,
		getProjectVariables,
		getSingleSelection,
		getVariableDependencies,
		isVariableUsed,
		removeError,
		type ProjectAnimation,
		type ProjectObject,
		type ProjectVariable,
	} from "../../../api/project.svelte";
	import { translate } from "../../../api/translate.svelte";
	import LockIcon from "../../icons/LockIcon.svelte";
	import PlusIcon from "../../icons/PlusIcon.svelte";
	import SkullIcon from "../../icons/SkullIcon.svelte";
	import TrashIcon from "../../icons/TrashIcon.svelte";
	import UnlockIcon from "../../icons/UnlockIcon.svelte";
	import AddVariableMenu from "../../menus/AddVariableMenu.svelte";
	import Tooltip from "../../util/Tooltip.svelte";
	import ConfirmDeleteVariableWindow from "../../windows/ConfirmDeleteVariableWindow.svelte";
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

	/**
	 * Returns a function that takes in a value and sets the given variable to that value. All dependent objects
	 * and animations will have their preview reloaded, and the project will be saved and recompiled.
	 *
	 * @param variable The variable to set the value of
	 *
	 * @return A function that sets the variable to the given value and reloads the necessary data.
	 */
	function setVariableValue(variable: ProjectVariable): (value: unknown) => void {
		return function (value: unknown) {
			variable.value = value;
			if (getPreferences().autosave) {
				if (getSingleSelection()) {
					const item = getItemFromId(getSingleSelection()!)! as ProjectObject | ProjectAnimation;
					if (getVariableDependencies(item)!.includes(variable.id)) {
						if (item.type === "object") generateObjectPreview(item);
						else if (item.type === "animation") generateAnimationPreview(item);
					}
				}

				if (isVariableUsed(variable)) runAction("Save And Recompile Project");
				else runAction("Save Project");
			}
		};
	}

	/**
	 * Called when the user types into the editable variable name element. If the user presses enter, the
	 * element is unfocused.
	 *
	 * @param event The keyboard event fired when the user types.
	 */
	function onTypeVariableName(event: KeyboardEvent) {
		if (event.key === "Enter") {
			(event.target as HTMLElement).blur();
		}
	}

	/**
	 * Returns a function that deletes the given variable, cleaning up all items that rely on it. If
	 * there are items that rely on it, a confirm window will be shown.
	 *
	 * @param variable The variable to delete.
	 *
	 * @return A function that deletes the given variable cleanly.
	 */
	function deleteVariable(variable: ProjectVariable): () => void {
		return function () {
			if (isVariableUsed(variable)) {
				deleteVariableIds = [variable.id];
				confirmDeleteVariableWindow.show();
				return;
			}

			deleteProjectItem(variable.id);
			if (getPreferences().autosave) runAction("Save And Recompile Project");
		};
	}

	let deleteVariableIds: number[] = $state([]);
	let confirmDeleteVariableWindow: ConfirmDeleteVariableWindow;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section oncontextmenu={addVariable} id="variables-panel">
	<div class="header">
		<h1>{translate("Variables")}</h1>
		<button>
			<PlusIcon stroke="var(--overlay-2)" style="width: 1rem; height: 1rem;" />
		</button>
	</div>

	{#if getProjectVariables().length === 0}
		<div class="novariable">
			<h1>No Variables Yet</h1>
			<p>The project has no variables yet. When it does, they will appear here.</p>
		</div>
	{/if}

	<div class="variables">
		{#each getProjectVariables() as variable (variable.id)}
			{@const Icon = getPropertyTypeIcon(variable.type.base)}
			<span class="variable">
				<span>
					<Icon stroke={getPropertyTypeColor(variable.type.base)} style="width: 1rem; height: 1rem;" />
					<span
						onblur={() => runAction("Save Project")}
						style:color={isVariableUsed(variable) ? "var(--text)" : "var(--overlay-0)"}
						contenteditable
						onkeydown={onTypeVariableName}
						bind:textContent={variable.name}
					></span>
				</span>

				<span>
					<PropertyValueInput
						setProperty={setVariableValue(variable)}
						canBeVariable={false}
						width="9rem"
						name="Initial Value"
						type={variable.type}
						bind:value={variable.value}
						locked={variable.locked}
						onError={() => addError({ objectId: variable.id, propertyName: "" })}
						onErrorFixed={() => removeError({ objectId: variable.id, propertyName: "" })}
						required
					/>
				</span>

				<span>
					<PropertyValueInput
						setProperty={setVariableValue(variable)}
						canBeVariable={false}
						name="Current Value"
						width="9rem"
						type={variable.type}
						bind:value={variable.value}
						onError={() => {}}
						onErrorFixed={() => {}}
						required
						locked
					/>
				</span>

				<button title="Lock Variable" onclick={() => (variable.locked = !variable.locked)}>
					{#if variable.locked}
						<LockIcon stroke="var(--text)" style="width: 1rem; height: 1rem;" />
					{:else}
						<UnlockIcon stroke="var(--text)" style="width: 1rem; height: 1rem;" />
					{/if}
				</button>
				<button title="Delete Variable" onclick={deleteVariable(variable)}>
					<TrashIcon stroke="var(--red)" style="width: 1rem; height: 1rem;" />
				</button>
				{#if !isVariableUsed(variable)}
					<Tooltip text="This variable is unused and can be deleted with no change." style="margin-left: 0.5rem;">
						<SkullIcon stroke="var(--overlay-0)" style="width: 1rem; height: 1rem;" />
					</Tooltip>
				{/if}
			</span>
		{/each}
	</div>
</section>
<AddVariableMenu bind:this={addVariableMenu} {top} {left} />
<ConfirmDeleteVariableWindow bind:this={confirmDeleteVariableWindow} ids={deleteVariableIds} />

<style>
	.variables {
		display: flex;
		flex-direction: column;

		.variable {
			align-items: center;
			padding-left: 1rem;
			padding-right: 1rem;
			border-radius: 0.5rem;
			height: 3rem;

			&:hover {
				background-color: rgba(180, 150, 255, 10%);
			}

			> span {
				gap: 0.5rem;
				color: var(--text);

				&:nth-child(3) {
					margin-left: 2rem;
				}
			}

			button {
				margin-left: 0.5rem;

				&:first-of-type {
					margin-left: 1rem;
				}
			}
		}

		span[contenteditable] {
			padding: 0.25rem;
			padding-left: 0.5rem;
			padding-right: 0.5rem;
			border-radius: 0.5rem;
			width: 8rem;
			margin-right: 2rem;

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

	.novariable {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: calc(100% - 4.5rem);
		justify-content: center;
		align-items: center;
		gap: 0.5rem;

		h1 {
			color: var(--text);
		}

		p {
			color: var(--overlay-2);
		}
	}
</style>
