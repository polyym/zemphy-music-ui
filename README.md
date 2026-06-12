# zemphy-music-ui

The SvelteKit app behind [zemphy.music](https://zemphy.music): a one-page marketing site for an Irish singer-songwriter. Statically prerendered, content lives in Sanity, Studio is embedded at `/studio`, deployed to Netlify from GitHub Actions.

This repo is the actual source of the live site rather than a generic template. Running it locally with the `.env.example` defaults will read the live Sanity dataset; if you want to use the codebase as a starting point for your own project you will need to swap `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` for your own Sanity project's values, and set up your own Netlify and GitHub Actions secrets.

## Quick start

```bash
git clone <repo>
cd zemphy-music-ui
cp .env.example .env
npm install
npm run dev
```

Dev server runs at <http://localhost:5173>. Studio is at <http://localhost:5173/studio>.

## Stack

| Layer         | Choice                                                                                  |
| ------------- | --------------------------------------------------------------------------------------- |
| Framework     | SvelteKit 2, Svelte 5 in runes mode                                                     |
| Language      | TypeScript (`strict: true`)                                                             |
| CMS           | Sanity (project `5b75k1rw`, dataset `production`); Studio embedded as a `/studio` route |
| Adapter       | `@sveltejs/adapter-netlify` (`edge: false`, `split: false`)                             |
| Hosting       | Netlify (static assets + one Function serving the `/studio/*` SPA shell)                |
| CI and deploy | GitHub Actions builds; Netlify CLI uploads. No Netlify auto-build.                      |
| Tests         | Vitest                                                                                  |
| Lint / format | ESLint flat config, Prettier, Husky pre-commit                                          |

## Project structure

```
src/
├── app.{html,css,d.ts}     # shell; tokens, self-hosted fonts, atmosphere, shared primitives
├── lib/
│   ├── actions/            # reveal (scroll fade-in), sparkles (random spawner)
│   ├── components/         # Nav, SideNav, Hero, Marquee, About, Services,
│   │                       #   Repertoire, Testimonials, Booking, Footer, MarkedText
│   ├── sanity/
│   │   ├── client.ts            # build-time GROQ client
│   │   ├── image.ts             # CDN URL builder
│   │   ├── studio-mount.svelte  # browser-only React mount of the embedded Studio
│   │   ├── types.ts
│   │   └── schemas/             # 7 singletons + 3 collections
│   ├── constants.ts        # SITE_URL, POLYYM_GITHUB_URL, page sizes, OG image dimensions, sparkle timings
│   ├── constants.test.ts
│   ├── marked-text.ts      # `*foo*` -> <em>, `\n` -> <br>, blank line -> paragraph
│   ├── marked-text.test.ts
│   ├── paginate.ts         # pure pagination helpers: chunk, pageCount, clampPage, pageSlice
│   └── paginate.test.ts
├── hooks.server.ts         # headers for function-served routes: /studio CSP + noindex
└── routes/
    ├── +layout.{svelte,ts}             # prerender = true
    ├── +page.svelte, +page.server.ts   # single GROQ query (server-only load), composes all sections
    ├── +error.svelte
    ├── studio/
    │   ├── +layout.ts                  # prerender = false, ssr = false
    │   ├── +page.svelte                # mounts Sanity Studio
    │   └── [...slug]/+page.svelte      # catchall for Studio's internal routes
    └── sitemap.xml/+server.ts

netlify.toml                            # static-content headers: strict CSP + HSTS (studio headers live in hooks.server.ts)
sanity.config.ts                        # Studio config, structure tool, singleton lock-down
.github/workflows/{tests,deploy}.yml
```

## Load-bearing conventions

A few things that are deliberately the way they are; changing them needs a wider read first.

- **No hardcoded copy or links in the repo.** Every visible string and URL comes from Sanity. Section components render conditionally on data presence, so an empty CMS produces an empty page rather than a crash.
- **Italic accents via `*asterisks*`.** Heading and About body fields are plain text in Sanity. The [`marked-text`](src/lib/marked-text.ts) parser turns `*foo*` into `<em>foo</em>`, `\n` into `<br>`, and a blank line into a paragraph break. No portable text editor in Studio.
- **GHA-driven deploys.** Netlify auto-build is intentionally unused; GitHub Actions builds the artefact and pushes it via Netlify CLI. A Sanity webhook fires `repository_dispatch` on publish so content changes go through the same lint, type-check, and test gates as a code change.
- **Songs and testimonials paginate.** Songs use prev/next buttons (12 per page); testimonials use a horizontal scroll-snap carousel (2 per page) with side prev/next arrows in dedicated 4rem gutters and click-to-jump dots below. Both layouts fall back to single-column stacks below 900px viewport.
- **Singletons are locked.** The Studio structure tool pins the seven singletons at the top, and document actions strip create / delete / duplicate / unpublish so editors can't accidentally orphan them.
- **Two-tier CSP plus HSTS, shipped through two mechanisms.** The public site's CSP is strict (no `unsafe-eval`, no third-party origins beyond Sanity's image CDN) and lives in [`netlify.toml`](netlify.toml) — but Netlify custom headers only reach static responses, and `/studio/*` is served by the adapter's render function, so the Studio's relaxed CSP, `X-Frame-Options`, and `X-Robots-Tag: noindex` ship from app code in [`hooks.server.ts`](src/hooks.server.ts). Both layers are required. `Strict-Transport-Security` is sent on every response with `includeSubDomains` and `preload`, so the domain is committed to HTTPS — backing out later requires the [hstspreload.org removal form](https://hstspreload.org/removal/).
- **Self-hosted fonts.** Fraunces and Manrope (variable woff2) live under `static/fonts/`, with the `unicode-range` subset matrix preserved from Google Fonts so browsers fetch only what they need.

## Scripts

| Command                | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Vite dev server with HMR (port 5173)             |
| `npm run check`        | `svelte-check` plus TypeScript                   |
| `npm run lint`         | ESLint over the repo                             |
| `npm run lint:fix`     | ESLint with `--fix`                              |
| `npm run format`       | Prettier write                                   |
| `npm run format:check` | Prettier verify (CI uses this)                   |
| `npm test`             | Vitest one-shot                                  |
| `npm run test:watch`   | Vitest in watch mode                             |
| `npm run build`        | Production build via `@sveltejs/adapter-netlify` |
| `npm run preview`      | Serve the built artefact locally                 |

CI runs `lint`, `format:check`, `test`, `check`, `build` on every push and PR.

## Further reading

- **Live site**: <https://zemphy.music>
- **Release history**: [CHANGELOG.md](CHANGELOG.md)
- **Framework docs**: [SvelteKit](https://svelte.dev/docs/kit), [Sanity](https://www.sanity.io/docs), [Netlify](https://docs.netlify.com)

## License

`UNLICENSED`: the source is publicly viewable for transparency, but no licence is granted to fork, modify, or redistribute the code or any of its assets without explicit permission. The Sanity project ID baked into `.env.example` is read-only for the public dataset and won't grant any write access to a clone.
