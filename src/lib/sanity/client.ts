import { createClient, type SanityClient } from '@sanity/client';
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

// `$env/static/public` inlines the values into both server and client bundles
// at build time. Missing vars fail `vite build` with a clear error, so a
// separate runtime check would be redundant. We deliberately do NOT use
// `$env/dynamic/public` here: that primitive resolves through a runtime
// `_app/env.js` endpoint, and on Netlify deploys where the runtime env
// configuration doesn't carry these vars (they're typically only set on the
// build environment), the endpoint returns `export const env={}` and any
// client-side import chain that lands in the home-page hydration bundle —
// e.g. `+page.svelte` -> `$lib/sanity/image` -> this module — throws during
// hydration and the SvelteKit error boundary takes over the rendered page.

/**
 * Build-time Sanity client. Used from the server-only `+page.server.ts` load
 * to fetch content via GROQ during prerendering. `useCdn: false` ensures the build
 * always sees the latest published documents; the resulting HTML is what
 * gets cached at the edge.
 */
export const sanityClient: SanityClient = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2025-01-01',
	useCdn: false
});
