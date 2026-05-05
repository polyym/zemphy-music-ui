# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Future content-only deploys do not require version bumps; bump for code changes that affect behaviour, deploy mechanics, or the content schema.

## [Unreleased]

_Nothing yet._

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
- `../SETUP.md` (outside the repo by design, since this codebase is public) — operational runbook for the deploy chain (GitHub repo, Netlify, Sanity CORS, webhook, secrets, troubleshooting).
- `../zemphy-content.md` (outside the repo) — copy-paste reference for filling Studio for the first time, every field labelled with its value.

[unreleased]: https://github.com/polyym/zemphy-music-ui/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/polyym/zemphy-music-ui/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/polyym/zemphy-music-ui/releases/tag/v1.0.0
