<script lang="ts">
	import { cache, hidePoint, setPoint } from "../../../api/client.svelte";
	
	let {
		value = $bindable(),
		errorMessage = $bindable(),
		width,
		locked,
	}: { locked: boolean; width: string; value: [number, number, number]; errorMessage: string | null } = $props();

	let is3D = $state(false);

	let x: string = $state(`${value[0]}`);
	let y: string = $state(`${value[1]}`);
	let z: string = $state(`${value[2]}`);

	// svelte-ignore state_referenced_locally
	let previousValue = $state([x, y, z]);

	let xError = $state(false);
	let yError = $state(false);
	let zError = $state(false);

	function getErrorMessage() {
		let errorMessage = null;

		if (!/^-?\d+(\.\d+)?$/.test(x)) {
			errorMessage = "X must be a number";
			xError = true;
		} else {
			xError = false;
		}
		if (!/^-?\d+(\.\d+)?$/.test(y)) {
			errorMessage = "Y must be a number";
			yError = true;
		} else {
			yError = false;
		}
		if (!/^-?\d+(\.\d+)?$/.test(z)) {
			errorMessage = "Z must be a number";
			zError = true;
		} else {
			zError = false;
		}

		if (!errorMessage) setPoint(Number(x), Number(y));

		return errorMessage;
	}

	let valueChanged = $derived(previousValue[0] !== x || previousValue[1] !== y || previousValue[2] !== z);

	function validate() {
		errorMessage = getErrorMessage();
	}

	function blur() {
		validate();
		if (errorMessage) return;
		cache("grid", false);

		hidePoint();

		if (valueChanged) {
			value = [Number(x), Number(y), Number(z)];
		}
	}

	function focus() {
		cache("grid", true);
		validate();
		if (!errorMessage) setPoint(Number(x), Number(y));
		previousValue = [x, y, z];
	}
</script>

<span class="coordinate" style:width>
	<span>
		X: <input disabled={locked} oninput={validate} style:outline={xError ? "2px solid var(--red)" : "none"} onfocus={focus} onblur={blur} bind:value={x} type="text" />
	</span>
	<span>
		Y: <input disabled={locked} oninput={validate} style:outline={yError ? "2px solid var(--red)" : "none"} onfocus={focus} onblur={blur} bind:value={y} type="text" />
	</span>

	{#if is3D}
		<span class="three-d">
			Z: <input disabled={locked} oninput={validate} style:outline={zError ? "2px solid var(--red)" : "none"} onfocus={focus} onblur={blur} bind:value={z} type="text" />
		</span>
		<button onclick={() => (is3D = false)}>2D</button>
	{:else}
		<button onclick={() => (is3D = true)}>3D</button>
	{/if}
</span>

<style>
	input,
	button {
		color: var(--text);
		background: var(--crust);
		padding: 0.3em;
		border-radius: 0.5em;
		outline-offset: -2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 4.5rem;
	}

	button {
		background-image: linear-gradient(to bottom, var(--lavender), var(--blue));
		color: var(--crust);
	}

	.coordinate:has(> .three-d) input {
		width: 4rem;
	}

	.coordinate:not(:has(> .three-d)) input {
		width: 7rem;
	}

	button {
		justify-content: center;
	}

	span {
		align-items: center;
	}

	.coordinate {
		gap: 0.5rem;

		span {
			gap: 0.25rem;
		}
	}
</style>
