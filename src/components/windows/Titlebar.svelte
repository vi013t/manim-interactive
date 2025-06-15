<script>
	import { translate } from "../../api/translate.svelte";
	import CloseIcon from "../icons/CloseIcon.svelte";

	let { close, title } = $props();
</script>

<nav class="titlebar">
	<span class="title">{translate(title)}</span>
	<div class="window-buttons">
		<button onclick={close}>
			<CloseIcon stroke="var(--text)" style="height: 1rem; width: 1rem;" />
		</button>
	</div>
</nav>

<style>
	nav {
		display: flex;
		width: 100%;
		background-color: var(--crust);
		flex-direction: row-reverse;
		position: relative;

		button {
			padding: 0.5rem;
		}
	}

	.title {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		color: var(--text);
	}
</style>
