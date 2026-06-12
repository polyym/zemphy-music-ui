import type { Handle } from '@sveltejs/kit';

// Netlify only applies `netlify.toml` custom headers to responses served from
// its static store (prerendered pages and assets). `/studio/*` opts out of
// prerendering, so its SPA shell is served by the adapter's render function —
// and function responses get NO netlify.toml headers (per the Netlify docs;
// the per-path /studio headers block this repo used to keep in netlify.toml
// silently never shipped). Function-served responses therefore carry their
// headers from here instead. Prerendered pages ignore what this hook sets
// (their headers are discarded when the page is written to a static file at
// build time), so netlify.toml stays the source of truth for the public site
// and this hook only matters for /studio/* and SSR'd fallbacks such as the
// error page for unknown paths.

// Sanity Studio needs a relaxed CSP: unsafe-eval for its codegen, Sanity API
// origins for connect/img, and blob: for its web workers and inline scripts.
// The origin list tracks what current Studio builds reach for; the symptom of
// a missing origin is a console CSP error inside Studio after an upgrade.
const STUDIO_CSP =
	"default-src 'self' blob: data:; " +
	"script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; " +
	"style-src 'self' 'unsafe-inline'; font-src 'self' data:; " +
	"img-src 'self' blob: data: https://cdn.sanity.io https://*.sanity.io; " +
	"connect-src 'self' https://api.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io https://api.sanity.work wss://*.api.sanity.io; " +
	"frame-src 'self' https://*.sanity.io https://core.sanity-cdn.com; " +
	"worker-src 'self' blob:; base-uri 'self'; form-action 'self'";

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (event.url.pathname.startsWith('/studio')) {
		response.headers.set('content-security-policy', STUDIO_CSP);
		response.headers.set('x-frame-options', 'SAMEORIGIN');
		// The route's own <meta name="robots"> is client-rendered (ssr = false),
		// so non-JS crawlers never see it; this header is the reliable noindex
		// signal. robots.txt deliberately does not Disallow /studio — a crawler
		// blocked from fetching the URL could never see this header.
		response.headers.set('x-robots-tag', 'noindex');
	} else {
		// Non-studio function-served responses (e.g. the SSR'd error page for
		// unknown paths) carry the same posture as the static site.
		response.headers.set('x-frame-options', 'DENY');
	}
	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
	return response;
};
