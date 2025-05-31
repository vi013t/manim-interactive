<script lang="ts">
	import PlusIcon from "../../icons/PlusIcon.svelte";
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section>
	<div class="header">
		<h1>Variables</h1>
		<button>
			<PlusIcon stroke="#9399b2" style="width: 1rem; height: 1rem;" />
		</button>
	</div>
</section>

<style>
	section {
		background-color: #181825;
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
			color: #9399b2;
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
