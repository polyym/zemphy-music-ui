// Sanity Studio is fully client-side and dynamic; it can't be prerendered or
// server-rendered. This layout-level override applies to /studio and all its
// nested routes, undoing the root layout's `prerender = true` for this branch.
export const prerender = false;
export const ssr = false;
