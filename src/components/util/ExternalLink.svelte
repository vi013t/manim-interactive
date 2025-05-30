<script lang="ts">
	import { openUrl } from "@tauri-apps/plugin-opener";
	import ExternalLinkIcon from "../icons/ExternalLinkIcon.svelte";

	type SingleLink = { href: string; children: () => any; [key: string]: unknown };
	type MultipleLink = { hrefs: string[]; children: () => any; [key: string]: unknown };

	let { href, hrefs, children, ...rest }: SingleLink | MultipleLink = $props();

	function clickMultple(event: MouseEvent) {
		event.preventDefault();
		if (hrefs) {
			(hrefs as string[]).forEach(href => {
				openUrl(href);
			});
		}
	}
</script>

<a onclick={clickMultple} href={(href as string | undefined) ?? "#"} {...rest} target="_blank" rel="noopener noreferrer">
	{@render children?.()}
	<ExternalLinkIcon stroke="#89b4fa" style="width: 1rem; height: 1rem;" />
</a>

<style>
	a {
		text-decoration: none;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		color: #89b4fa;
	}
</style>
