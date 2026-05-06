# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Future content-only deploys do not require version bumps; bump for code changes that affect behaviour, deploy mechanics, or the content schema.

## [Unreleased]

_Nothing yet._

## [1.1.1] - 2026-05-06

Hotfix for the home-page hydration crash that surfaced once v1.1.0 deployed. The site loaded, Sanity images rendered into the prerendered HTML, then the client-side bundle threw on hydration and the SvelteKit error boundary took over the page with a "500 Something went wrong" overlay (the 500 is the boundary's own status text, not the HTTP response — the document itself was 200).

Root cause: [`src/lib/sanity/client.ts`](src/lib/sanity/client.ts) imported `env` from `$env/dynamic/public`, which is read at runtime via the `_app/env.js` endpoint. On this Netlify deploy that endpoint returns `export const env={}` because the project's `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` are set in GitHub Actions Variables (build-time) but not in Netlify's runtime environment configuration. v1.0.1 didn't trip on this because `+page.svelte` didn't directly import the Sanity image builder; only About / Testimonials did, and their chunks weren't loaded when those sections weren't published. v1.1.0 added an `imageUrl` import to `+page.svelte` for the new `socialImage` URL building, which dragged `client.ts` into the home-page critical hydration chunk and exposed the latent issue.

### Fixed

- [`src/lib/sanity/client.ts`](src/lib/sanity/client.ts): switched the env-var imports from `$env/dynamic/public` to `$env/static/public`. The values are inlined into both server and client bundles at build time and never round-trip through `_app/env.js`, so the empty Netlify runtime env can no longer break hydration. The explicit `if (!PROJECT_ID || !DATASET) throw` is gone — `vite build` already fails loudly when a `$env/static/public` symbol is undeclared, so the manual guard is redundant. A new comment block in the file documents the trap so the next maintainer doesn't accidentally swap the primitives back.

## [1.1.0] - 2026-05-06

Bug-fix release with several backwards-compatible additions. Headline fixes: the embedded Studio at `/studio` no longer crashes the backing Netlify function on cold start, and four private-doc references (`../SETUP.md`, `../zemphy-content.md`, `../polyym-sveltekit-guide.md`, `../zemphy-design.html`) are gone from tracked files; they had appeared as broken links to anyone with only a clone of the repo.

Minor rather than patch under strict semver: the new optional `socialImage` content-schema field qualifies per the version-bump rule above. The other additions — `og:image` / `twitter:image` meta-tag emission, a skip-to-content keyboard shortcut, an HSTS response header, and new public exports from `src/lib/constants.ts` are also additive. Nothing breaks.

### Fixed

- [`README.md`](README.md): dropped the `(see ../SETUP.md)` parenthetical from Quick start; removed the post-Stack line linking `../polyym-sveltekit-guide.md`; removed the `../zemphy-content.md` reference inside the "no hardcoded copy" bullet.
- [`README.md`](README.md): replaced the entire `## Where to look` section (four broken `../` links to private docs) with a tighter `## Further reading` pointing only at things public readers can actually open: live site, in-repo CHANGELOG, framework docs (SvelteKit / Sanity / Netlify).
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): the comment explaining the `repository_dispatch` chain no longer references `../SETUP.md`. Replaced with a self-contained explanation of what stays private (the webhook URL, the GitHub PAT, the Netlify site ID and auth token).
- [`CHANGELOG.md`](CHANGELOG.md): the v1.0.0 Documentation block's bullets that previously pointed at `../SETUP.md` and `../zemphy-content.md` are collapsed into one neutral sentence. The description of what those docs cover is preserved; only the path-specific references are gone.
- [`.env.example`](.env.example): the inline `../SETUP.md` reference in the comment about CI variables — missed by the first wave's grep — is now a self-contained line about GitHub Actions repository variables. The previous wording is the only `../`-prefixed reference that survived the first wave.
- [`src/routes/+page.svelte`](src/routes/+page.svelte): the inline JSON-LD `MusicGroup` block now escapes every less-than character to its JSON unicode form before the result lands inside the `<script>` element. `JSON.stringify` does not escape less-than signs, so a CMS field containing a literal close-script-tag substring would otherwise terminate the script element prematurely and execute whatever came after as HTML; the polyym §13 `{@html}` rule treats this as a security defect even though the trust boundary is "Sanity Studio editor".
- [`src/lib/components/nav.svelte`](src/lib/components/nav.svelte): added `aria-label="Primary"` to the top `<nav>` so screen readers can distinguish it from the side-nav (`aria-label="Page sections"`); two unlabelled `<nav>` landmarks otherwise both announce as "navigation". Added `aria-hidden="true"` to the Instagram and YouTube SVGs so they don't double up the parent link's `aria-label` — bringing them in line with every other SVG in the codebase.
- [`src/lib/components/marquee.svelte`](src/lib/components/marquee.svelte): the duplicated keyword set (rendered twice back-to-back for the seamless infinite-scroll loop) now carries `aria-hidden="true"` on the second copy, so screen readers announce the keyword list once rather than twice.
- [`src/lib/components/testimonials.svelte`](src/lib/components/testimonials.svelte): three accessibility fixes. Pagination dots dropped the `role="tablist"` / `role="tab"` ARIA pattern (incomplete without `tabpanel` regions, so misleading) for plain pagination buttons with `aria-current="true"` on the active one. Each dot button is now a 24x24 hit area wrapping an 8x8 visual span (WCAG 2.5.8 minimum target size); the dot stays exactly the same size visually. The `scrollToPage` jump now uses `behavior: 'auto'` when the user prefers reduced motion, paired with a matching `@media (prefers-reduced-motion: reduce)` block that overrides the track's `scroll-behavior: smooth`.
- [`src/lib/components/side-nav.svelte`](src/lib/components/side-nav.svelte): bumped the dot anchor's horizontal padding from `0.4rem` to `0.6rem` so the hit area clears WCAG 2.5.8's 24x24 minimum around the 7px visual dot. The visual layout is unchanged — the column was already padded vertically, only the horizontal padding was below the threshold.
- [`src/lib/sanity/studio-mount.svelte`](src/lib/sanity/studio-mount.svelte): the embedded Studio at `/studio` was crashing the backing Netlify Function with `error decoding lambda response: unexpected end of JSON input` because `react`, `react-dom/client`, `sanity`, and the `sanity.config` module graph were imported at the top of the component. Even with `ssr = false; prerender = false` on the route, SvelteKit still loads the page module to know what to render — and `sanity` reaches for browser globals (`window`, `document`) at module init, which throws during the Lambda's cold start before any response is returned. The four imports moved into a dynamic `Promise.all` inside `onMount`, gated behind `if (!browser) return;`, so they only ever load in the browser. The server bundle for `studio-mount.js` shrank from 20 kB to 296 bytes; the SSR'd output is now just the empty `<div class="studio-root">` shell that the client bundle then mounts the React Studio into. An `AbortController` covers the unmount-during-import race so we don't leak a `createRoot` if the component tears down before the dynamic imports settle, and the IIFE wraps everything in `try { … } catch (error: unknown) { if (import.meta.env.DEV) console.error(…) }` so a network blip or CSP block on first load surfaces in dev rather than as an unhandled promise rejection in production.
- [`vite.config.ts`](vite.config.ts): the dev-mode counterpart to the Studio fix above. The new dynamic `import('../../../sanity.config')` resolves to a file at the project root; that path falls outside SvelteKit's default `server.fs.allow` list (src, .svelte-kit, node_modules), so `npm run dev /studio` returned a 403 with "outside of Vite serving allow list". Static imports were unaffected because Vite resolves them at startup and bundles them into the dep graph. Added `server.fs.allow = [path.join(import.meta.dirname, 'sanity.config.ts')]` to whitelist that one file. Production builds bundle the chunk ahead of time so the path is only hit by the dev server.

### Changed

- [`README.md`](README.md): added an upfront paragraph clarifying that this is the actual source of zemphy.music, not a generic template, with explicit guidance for anyone trying to use it as a starting point (swap `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` for your own Sanity project's values, set up your own Netlify and GitHub Actions secrets).
- [`README.md`](README.md): expanded the License section to spell out what `UNLICENSED` means in practice — publicly viewable for transparency, but no licence is granted to fork, modify, or redistribute the code or assets without explicit permission. Notes that the public Sanity project ID baked into `.env.example` is read-only for the public dataset and won't grant any write access to a clone.
- [`netlify.toml`](netlify.toml): added `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` to the public-site headers block (not the `/studio/*` block; the policy applies site-wide via host already, and listing it on the public block keeps the per-path table read in the order public-then-Studio). Two-year max-age, subdomain coverage, and the HSTS preload-list opt-in. Once shipped, removing HSTS from a domain still on the preload list requires a submission to hstspreload.org's removal form, so the comment block calls that out for future maintainers.
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): the deploy job now runs `npm run lint`, `npm run format:check`, and `npm run check` inline before the build, mirroring `tests.yml`. The workflow no longer assumes branch protection on `main` requires the `Tests` workflow to pass — a misconfiguration there could otherwise let the deploy job push a broken artefact even when `tests.yml` would have caught the issue. Tests already ran in the deploy workflow; this just adds the rest of the gate set for symmetry.
- [`src/routes/studio/+page.svelte`](src/routes/studio/+page.svelte) and [`src/routes/studio/[...slug]/+page.svelte`](src/routes/studio/[...slug]/+page.svelte): browser tab title is now `Studio · Zemphy` rather than the bare `Studio`. The Studio routes deliberately bypass CMS load (`prerender = false; ssr = false`), so the brand wordmark cannot come from `siteSettings.logoName`; the hardcoded `Zemphy` matches the brand string already hardcoded in `sanity.config.ts` (`title: 'Zemphy'`).
- [`src/lib/components/repertoire.svelte`](src/lib/components/repertoire.svelte): added explicit parentheses to the `data ?? (visibleSongs.length > 0)` guard so it matches the equivalent guards in `services.svelte` and `testimonials.svelte`. No behaviour change.
- [`src/lib/components/{nav,booking,footer,repertoire}.svelte`](src/lib/components): every external `target="_blank"` anchor now carries `rel="noopener noreferrer"` instead of `rel="noopener"` alone. Modern browsers default to `noopener` so the change is belt-and-braces; the `noreferrer` half strips the `Referer` header from outbound clicks (Instagram, YouTube, song version links, the polyym GitHub credit), which is a small privacy nicety with no functional cost.

### Added

- [`src/lib/sanity/schemas/site-settings.ts`](src/lib/sanity/schemas/site-settings.ts) and [`src/lib/sanity/types.ts`](src/lib/sanity/types.ts): new optional `socialImage` field on `siteSettings`, surfaced in the `SiteSettings` interface as `socialImage?: SanityImage`. The Studio description prompts editors for a 1.91:1 image (1200x630 ideal). Optional; without one, link-preview cards fall back to the basic summary type.
- [`src/routes/+page.svelte`](src/routes/+page.svelte): when `siteSettings.socialImage` is set, the page emits `<meta property="og:image">` and `<meta name="twitter:image">` from the Sanity CDN URL (cropped to `OG_IMAGE_WIDTH_PX` x `OG_IMAGE_HEIGHT_PX`), and the `twitter:card` type stays `summary_large_image`. Without an image the card type degrades to `summary` so platforms that reject `summary_large_image` without an image still produce a valid preview.
- [`src/lib/constants.ts`](src/lib/constants.ts) and [`src/lib/constants.test.ts`](src/lib/constants.test.ts): new `OG_IMAGE_WIDTH_PX` (1200) and `OG_IMAGE_HEIGHT_PX` (630) constants for the Open Graph / Twitter card image dimensions, plus a colocated test asserting the resulting ratio sits inside the `1.9 < ratio < 1.92` band that platforms accept for `summary_large_image` without falling back to a basic summary card. Hoisting these out of `+page.svelte` aligns with the polyym §8 "every magic number lives in `constants.ts` and is unit-tested" rule.
- [`src/routes/+page.svelte`](src/routes/+page.svelte) and [`src/app.css`](src/app.css): a skip-to-content link rendered at the top of the document, visually hidden until keyboard focus moves to it, then sliding into view in the top-left. Targets `#main` on the page's `<main>` element, which now carries `id="main" tabindex="-1"` so the anchor can move focus there programmatically; the universal focus-visible outline is suppressed on `<main>` since the focus jump is user-initiated.

## [1.0.1] - 2026-05-05

### Fixed

- Production deploys via `netlify-cli@latest` were failing with `PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET must be set` because netlify-cli v26 invokes `@netlify/build` and re-runs `netlify.toml`'s `[build] command` even when `--dir=build` is set, without inheriting the env vars passed to the GHA build step. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) now passes `--no-build` to skip the redundant rebuild (the artefact GHA already produced is what gets uploaded), and propagates `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` into the deploy step's env as a fallback for any future netlify-cli that ignores `--no-build`.

## [1.0.0] - 2026-05-05

First production release. The codebase passes the polyym §18 definition-of-done checklist (lint, format, type-check, tests, build, security headers, accessibility, SEO).

### Added

#### Site

- Single-page marketing layout composed of ten Svelte components: `Nav`, `SideNav`, `Hero`, `Marquee`, `About`, `Services`, `Repertoire`, `Testimonials`, `Booking`, `Footer`.
- Reusable primitives: `MarkedText` (asterisk-italic + soft-break + paragraph parser), `reveal` action (scroll fade-in via IntersectionObserver), `sparkles` action (timed SVG spawner that avoids text via `elementFromPoint`).
- Sections render conditionally on data presence so an empty CMS produces an empty page rather than a crash.
- Songbook prev/next pagination, twelve songs per page (with a `Page X of Y` indicator centred via a three-column grid). Testimonials horizontal scroll-snap carousel, two cards per page with click-to-jump dots below and round prev/next arrows in dedicated 4rem gutters on either side. Both layouts collapse to single-column stacks below 900px.
- Hover-to-reveal split-versions UX on songbook rows (chill / high-energy YouTube links), gated by `:has(.version)` so rows without links stay non-interactive.

#### CMS

- Sanity Studio embedded at `/studio` (project `5b75k1rw`, dataset `production`); the Studio chunk is code-split off the public bundle and the route opts out of SSR / prerender.
- Ten schemas: seven singletons (`siteSettings`, `heroSection`, `aboutSection`, `servicesSection`, `repertoireSection`, `testimonialsSection`, `bookingSection`) and three collections (`service`, `song`, `testimonial`).
- Singletons pinned in the structure tool with create / delete / duplicate / unpublish actions stripped, so editors cannot orphan them.
- Asterisk-based italic accent syntax for heading and About-body fields: `*foo*` parses to `<em>foo</em>`, `\n` becomes `<br>`, blank lines become paragraph breaks. No portable text editor in Studio.
- Build-time GROQ via `useCdn: false` so each build sees the latest published documents.

#### Style and accessibility

- Self-hosted Fraunces (variable, italic + roman, opsz 9-144, wght 100-900, SOFT 0-100) and Manrope (variable, wght 200-800) in twelve `unicode-range` subsets so browsers fetch only what each page needs.
- Light-theme tokens on `:root` (cream / plum / pastel palette); shared section primitives (`.section`, `.section-label`, `.section-title`, `.btn`) in `app.css`.
- Atmospheric multi-radial-gradient background plus an SVG noise grain overlay; alternating-tilt testimonial cards; spinning portrait badge.
- Universal `:focus-visible` outline for keyboard navigation; `prefers-reduced-motion` overrides for sparkles, blobs, scroll-reveal, song version icons, portrait badge spin, and the footer attribution animation.
- `<html lang="en-GB">` and `og:locale=en_GB` to match the brand's UK / Sweden / Ireland audience.

#### SEO

- Page `<title>`, meta description, Open Graph and Twitter card tags pulled from CMS at build time.
- JSON-LD `MusicGroup` block with `name`, `url`, `sameAs` (Instagram, YouTube), and `email`.
- Sitemap endpoint at `/sitemap.xml`; `robots.txt` allows public crawling and disallows `/studio`.
- Font preload links for the latin subsets in `app.html`.

#### Deployment

- GitHub Actions builds and uploads via Netlify CLI; Netlify auto-build is intentionally not used.
- Sanity webhook fires GitHub `repository_dispatch` on every document publish so content changes go through the same lint, type-check, and test gates as code changes.
- Per-path CSP in `netlify.toml`: strict for the public site (no `unsafe-eval`, only Sanity image CDN beyond `'self'`), relaxed for `/studio/*` to support Sanity Studio's `unsafe-eval`, websocket connections, and OAuth frame requirements.
- Security headers: `X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera / microphone / geolocation / interest-cohort, `Cross-Origin-Opener-Policy: same-origin`.
- npm overrides for `js-yaml ^4.1.0` and `cookie ^0.7.0` silence transitive vulnerabilities in `@sanity/cli`'s `@vercel/frameworks` chain and SvelteKit's cookie dep respectively. The vulnerabilities only existed in dev-time / build-only code paths that never reach the production bundle, but the overrides keep `npm audit` clean (zero vulnerabilities).

#### Footer

- Auto-generated copyright year combined with CMS-driven logo wordmark and tagline.
- "by polyym" attribution linking to the project's GitHub repo, with a hover and keyboard-focus animation that expands the line to "Built by polyym for ZEMPHY \<3"; the entire row is the click target.

#### Tooling

- ESLint flat config combining `typescript-eslint` strict-type-checked, `eslint-plugin-svelte`, `eslint-plugin-unicorn`, and `eslint-config-prettier`.
- Prettier with tabs, single quotes, no trailing commas, semicolons, 100-char width.
- Husky pre-commit hook running `lint-staged` (Prettier + ESLint on staged files).
- Vitest covering `src/lib/*.ts` only: 16 tests across constants invariants and the marked-text parser.
- Node 22 pinned via `engines.node`, `.nvmrc`, `.node-version`, and `.npmrc engine-strict`.

### Documentation

- `README.md` — project overview, stack, structure, load-bearing conventions, scripts.
- Operational runbook (deploy chain, webhook config, secrets, troubleshooting) and Studio content reference (first-fill copy-paste values) are kept private; not in the public repo.

[unreleased]: https://github.com/polyym/zemphy-music-ui/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/polyym/zemphy-music-ui/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/polyym/zemphy-music-ui/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/polyym/zemphy-music-ui/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/polyym/zemphy-music-ui/releases/tag/v1.0.0
