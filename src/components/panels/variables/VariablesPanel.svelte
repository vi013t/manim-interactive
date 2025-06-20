<script lang="ts">
	import { generateAnimationPreview, generateObjectPreview } from "../../../api/codegen.svelte";
	import { getPropertyTypeColor, getPropertyTypeIcon } from "../../../api/manim/property";
	import { getPreferences, runAction } from "../../../api/preferences.svelte";
	import {
		deleteProjectItem,
		getItemFromId,
		getProjectVariables,
		getSingleSelection,
		getVariableDependencies,
		isVariableUsed,
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

	function setVariableValue(variable: ProjectVariable) {
		return function (value: unknown) {
			console.log("sttingf");
			variable.value = value;
			if (getPreferences().autosave) {
				if (getSingleSelection()) {
					const item = getItemFromId(getSingleSelection()!)! as ProjectObject | ProjectAnimation;
					if (getVariableDependencies(item)!.includes(variable.id)) {
						if (item.type === "object") generateObjectPreview(item);
						else if (item.type === "animation") generateAnimationPreview(item);
					}
				}
				runAction("Save And Recompile Project");
			}
		};
	}

	function input(event: KeyboardEvent) {
		if (event.key === "Enter") {
			(event.target as HTMLElement).blur();
		}
	}

	function deleteVariable(variable: ProjectVariable) {
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

	<div class="variables">
		{#each getProjectVariables() as variable (variable.id)}
			{@const Icon = getPropertyTypeIcon(variable.type.base)}
			<span>
				<span>
					<Icon stroke={getPropertyTypeColor(variable.type.base)} style="width: 1rem; height: 1rem;" />
					<span style:color={isVariableUsed(variable) ? "var(--text)" : "var(--overlay-0)"} contenteditable onkeydown={input} bind:textContent={variable.name}>{name}</span>
				</span>

				<span>
					<PropertyValueInput
						setProperty={setVariableValue(variable)}
						canBeVariable={false}
						width="9rem"
						name="Initial Value"
						type={variable.type}
						value={variable.value}
						locked={variable.locked}
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
						value={variable.value}
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
					<SkullIcon title="This variable is unused" stroke="var(--overlay-0)" style="margin-left: 1rem; width: 1rem; height: 1rem;" />
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

		> span {
			align-items: center;

			> span {
				gap: 0.5rem;
				color: var(--text);

				&:nth-child(3) {
					margin-left: 2rem;
				}
			}

			button {
				margin-left: 1rem;
			}
		}

		span[contenteditable] {
			padding: 0.5rem;
			border-radius: 0.5rem;
			width: 10rem;

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
