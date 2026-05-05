<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { createElement } from 'react';
	import { createRoot, type Root } from 'react-dom/client';
	import { Studio } from 'sanity';
	import config from '../../../sanity.config';

	// Sanity Studio is a React app. We mount it client-side on the /studio route
	// only; the route opts out of SSR and prerender via its +layout.ts so this
	// branch never runs during the static build.
	let container: HTMLDivElement;
	let root: Root | undefined;

	onMount(() => {
		if (!browser) return;
		root = createRoot(container);
		root.render(createElement(Studio, { config }));
		return () => {
			root?.unmount();
		};
	});
</script>

<div bind:this={container} class="studio-root"></div>

<style>
	.studio-root {
		min-height: 100dvh;
	}
	/* Studio paints its own background; remove the page atmosphere washes here
	   so the editor isn't bleeding cream gradients through its UI. */
	.studio-root :global(*) {
		font-family: inherit;
	}
	:global(body:has(.studio-root)) {
		background: #101112;
	}
	:global(body:has(.studio-root)) :global(.atmosphere),
	:global(body:has(.studio-root)) :global(.grain) {
		display: none;
	}
</style>
