// Prerender every route as static HTML at build time. The public site composes
// CMS data fetched in the server-only `+page.server.ts` load; the only dynamic
// exception is `/studio/*`, which opts out via its own `+layout.ts`.
export const prerender = true;
