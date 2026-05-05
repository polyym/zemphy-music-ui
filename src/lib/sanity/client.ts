import { createClient, type SanityClient } from '@sanity/client';
import { env } from '$env/dynamic/public';

const PROJECT_ID = env.PUBLIC_SANITY_PROJECT_ID;
const DATASET = env.PUBLIC_SANITY_DATASET;

// Throw at module-load time so a missing env var fails the build loudly
// instead of producing a broken artefact. Polyym's "result object" rule
// applies to public async operations; module-level config validation is a
// different boundary (the build itself, not a request handler).
if (!PROJECT_ID || !DATASET) {
	throw new Error(
		'PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET must be set; see .env.example.'
	);
}

/**
 * Build-time Sanity client. Used from `+page.ts` load functions to fetch
 * content via GROQ during prerendering. `useCdn: false` ensures the build
 * always sees the latest published documents; the resulting HTML is what
 * gets cached at the edge.
 */
export const sanityClient: SanityClient = createClient({
	projectId: PROJECT_ID,
	dataset: DATASET,
	apiVersion: '2025-01-01',
	useCdn: false
});
