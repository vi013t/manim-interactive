<script lang="ts">
	import { getPreferences, runAction } from "../../api/preferences.svelte";
	import {
		deleteProjectItem,
		getProjectAnimations,
		getProjectObjects,
		getProjectVariableFromId,
		type ProjectAnimation,
		type ProjectObject,
		type ProjectVariable,
	} from "../../api/project.svelte";
	import Window from "./Window.svelte";

	let { ids }: { ids: number[] } = $props();

	let deleteWindow: Window;

	export function show() {
		deleteWindow.openWindow();
	}

	function deleteVariableDependencies(item: ProjectObject | ProjectAnimation, variable: ProjectVariable) {
		console.log(item.properties);
		Object.entries(item.properties).forEach(([propertyName, propertyValue]) => {
			if ((propertyValue as any).variableId === variable.id) {
				(item.properties as any)[propertyName] = variable.value;
				if (getPreferences().autosave) runAction("Save And Recompile Project");
			}
		});
	}

	function deleteVariable(variable: ProjectVariable) {
		getProjectObjects().forEach(object => deleteVariableDependencies(object, variable));
		getProjectAnimations().forEach(animation => deleteVariableDependencies(animation, variable));
		deleteProjectItem(variable.id);
	}

	function confirmDeleteVariable() {
		ids.forEach(id => {
			deleteVariable(getProjectVariableFromId(id)!);
		});
		deleteWindow.close();
	}
</script>

<Window bind:this={deleteWindow} title="Delete Variable?">
	<p>
		Some objects or animations are still using this variable. If you delete it, the value of those properties will be set to the initial value of this variable. Continue to delete
		variable?
	</p>
	<span>
		<button onclick={() => deleteWindow.close()}>Cancel</button>
		<button onclick={confirmDeleteVariable}>Delete</button>
	</span>
</Window>

<style>
	p,
	button {
		color: var(--text);
	}

	p {
		margin-left: 2rem;
		margin-right: 2rem;
		margin-top: 2rem;
	}

	span {
		width: 100%;
		justify-content: center;
		margin-top: 1rem;
		margin-bottom: 2rem;
		gap: 2rem;
	}

	button {
		background-color: var(--crust);
		padding-left: 2rem;
		padding-right: 2rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;

		&:last-child {
			background-color: var(--red);
			color: var(--crust);
		}
	}
</style>
