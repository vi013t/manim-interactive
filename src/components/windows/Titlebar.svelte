<script>
	import { translate } from "../../api/translate.svelte";
	import CloseIcon from "../icons/CloseIcon.svelte";

	let { close, title } = $props();
</script>

<nav>
	<span class="title">{translate(title)}</span>
	<div class="window-buttons">
		<button onclick={close}>
			<CloseIcon stroke="#cdd6f4" style="height: 1rem; width: 1rem;" />
		</button>
	</div>
</nav>

<style>
	nav {
		display: flex;
		width: 100%;
		background-color: #11111b;
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
		color: #cdd6f4;
	}
</style>
