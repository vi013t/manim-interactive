<script lang="ts">
	import { slide } from "svelte/transition";
	import { getNotifications, removeNotification } from "../api/project.svelte";
	import CloseIcon from "./icons/CloseIcon.svelte";
	import ErrorIcon from "./icons/ErrorIcon.svelte";

	function hideNotification(id: number) {
		return function () {
			removeNotification(id);
		};
	}
</script>

<div class="notifications">
	{#each getNotifications() as notification (notification.id)}
		<div transition:slide style:outline-color={notification.severity === "error" ? "#f38ba8" : "transparent"} class="notification">
			<h1 style:color={notification.severity === "error" ? "#f38ba8" : "inherit"}>
				{#if notification.severity === "error"}
					<ErrorIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" />
				{/if}
				{notification.header}
				<button class="close" onclick={hideNotification(notification.id)}><CloseIcon stroke="#f38ba8" style="width: 1rem; height: 1rem;" /></button>
			</h1>
			<p>{@html notification.message}</p>
		</div>
	{/each}
</div>

<style>
	.notification {
		width: 100%;
		min-height: 3rem;
		display: flex;
		flex-direction: column;
		background-color: #11111b;
		color: #cdd6f4;
		border-radius: 0.5rem;
		padding: 1rem;
		outline-width: 2px;
		outline-offset: -2px;
		outline-style: solid;

		h1 {
			font-size: 1rem;
			margin-bottom: 0.5rem;
			display: flex;
			align-items: center;
			gap: 0.5rem;

			.close {
				margin-left: auto;
			}
		}

		p {
			color: #bac2de;
			font-size: 0.85rem;

			:global(a) {
				color: #89b4fa;
				text-decoration: none;
			}
		}
	}

	.notifications {
		position: absolute;
		right: 2rem;
		bottom: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 20rem;
	}
</style>
