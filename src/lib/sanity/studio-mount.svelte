<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Sanity Studio is a React app. We mount it client-side on the /studio route
	// only; the route opts out of SSR and prerender via its +layout.ts so this
	// branch never runs during the static build.
	//
	// React, react-dom/client, sanity, and sanity.config are dynamic-imported
	// inside onMount rather than being top-level imports here. That keeps them
	// out of the SvelteKit server bundle that backs the /studio Netlify
	// function: those packages reach for browser globals (`window`, `document`)
	// at module init and crash the Lambda before it can return a response,
	// which Netlify renders as `error decoding lambda response: unexpected end
	// of JSON input` to the visitor. Top-level imports here would re-introduce
	// that crash even with `ssr = false`, because SvelteKit still loads the
	// route module to know what to render.
	let container: HTMLDivElement;

	onMount(() => {
		if (!browser) return;

		// AbortController is the cancellation primitive for the async dynamic
		// imports below. A plain boolean would also work but TypeScript's flow
		// analysis can't see the closure-mutable boolean being flipped across
		// the await boundary, and `@typescript-eslint/no-unnecessary-condition`
		// fires on the post-await check.
		const ac = new AbortController();
		let cleanup: (() => void) | undefined;

		void (async () => {
			try {
				const [{ createElement }, { createRoot }, { Studio }, { default: config }] =
					await Promise.all([
						import('react'),
						import('react-dom/client'),
						import('sanity'),
						import('../../../sanity.config')
					]);
				if (ac.signal.aborted) return;
				const root = createRoot(container);
				root.render(createElement(Studio, { config }));
				cleanup = () => {
					root.unmount();
				};
			} catch (error: unknown) {
				// Network blip on first load, CSP block, or a genuine bug in the
				// upstream chain would otherwise surface as an unhandled promise
				// rejection in the browser console with no UI feedback. Log in
				// dev so the cause is visible while iterating; production users
				// just see the empty Studio shell, which is the same failure
				// mode they'd hit if any of the chunks 404'd.
				if (import.meta.env.DEV) console.error('Studio mount failed:', error);
			}
		})();

		return () => {
			ac.abort();
			cleanup?.();
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
