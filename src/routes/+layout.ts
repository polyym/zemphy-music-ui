// Prerender every route as static HTML at build time. The public site composes
// CMS data fetched in `+page.ts` load functions; the only dynamic exception is
// `/studio/*`, which opts out via its own `+page.ts`.
export const prerender = true;
