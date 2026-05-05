# zemphy-music-ui

The SvelteKit app behind [zemphy.music](https://zemphy.music): a one-page marketing site for an Irish singer-songwriter. Statically prerendered, content lives in Sanity, Studio is embedded at `/studio`, deployed to Netlify from GitHub Actions.

## Quick start

```bash
git clone <repo>
cd zemphy-music-ui
cp .env.example .env
npm install
npm run dev
```

Dev server runs at <http://localhost:5173>. Studio is at <http://localhost:5173/studio>; first sign-in needs the localhost origin allowed in Sanity's CORS settings (see [`../SETUP.md`](../SETUP.md)).

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

Codebase conventions (filename casing, lint rules, anti-patterns, deploy model) follow [`../polyym-sveltekit-guide.md`](../polyym-sveltekit-guide.md), kept outside the repo as the binding style guide.

## Project structure

```
src/
├── app.{html,css,d.ts}     # shell; tokens, self-hosted fonts, atmosphere, shared primitives
├── lib/
│   ├── actions/            # reveal (scroll fade-in), sparkles (random spawner)
│   ├── components/         # Nav, SideNav, Hero, Marquee, About, Services,
│   │                       #   Repertoire, Testimonials, Booking, Footer, MarkedText
│   ├── sanity/
│   │   ├── client.ts       # build-time GROQ client
│   │   ├── image.ts        # CDN URL builder
│   │   ├── types.ts
│   │   └── schemas/        # 7 singletons + 3 collections
│   ├── constants.ts        # SITE_URL, POLYYM_GITHUB_URL, SONGS_PER_PAGE, TESTIMONIALS_PER_PAGE, sparkle timings
│   ├── constants.test.ts
│   ├── marked-text.ts      # `*foo*` -> <em>, `\n` -> <br>, blank line -> paragraph
│   └── marked-text.test.ts
└── routes/
    ├── +layout.{svelte,ts}             # prerender = true
    ├── +page.{svelte,ts}               # single GROQ query, composes all sections
    ├── +error.svelte
    ├── studio/
    │   ├── +layout.ts                  # prerender = false, ssr = false
    │   ├── +page.svelte                # mounts Sanity Studio
    │   └── [...slug]/+page.svelte      # catchall for Studio's internal routes
    └── sitemap.xml/+server.ts

netlify.toml                            # per-path CSP: strict for /, permissive for /studio/*
sanity.config.ts                        # Studio config, structure tool, singleton lock-down
.github/workflows/{tests,deploy}.yml
```

## Load-bearing conventions

A few things that are deliberately the way they are; changing them needs a wider read first.

- **No hardcoded copy or links in the repo.** Every visible string and URL comes from Sanity. Section components render conditionally on data presence, so an empty CMS produces an empty page rather than a crash. Reference values for the first content fill live at [`../zemphy-content.md`](../zemphy-content.md) (intentionally outside the repo).
- **Italic accents via `*asterisks*`.** Heading and About body fields are plain text in Sanity. The [`marked-text`](src/lib/marked-text.ts) parser turns `*foo*` into `<em>foo</em>`, `\n` into `<br>`, and a blank line into a paragraph break. No portable text editor in Studio.
- **GHA-driven deploys.** Netlify auto-build is intentionally unused; GitHub Actions builds the artefact and pushes it via Netlify CLI. A Sanity webhook fires `repository_dispatch` on publish so content changes go through the same lint, type-check, and test gates as a code change.
- **Songs and testimonials paginate.** Songs use prev/next buttons (12 per page); testimonials use a horizontal scroll-snap carousel (2 per page) with side prev/next arrows in dedicated 4rem gutters and click-to-jump dots below. Both layouts fall back to single-column stacks below 900px viewport.
- **Singletons are locked.** The Studio structure tool pins the seven singletons at the top, and document actions strip create / delete / duplicate / unpublish so editors can't accidentally orphan them.
- **Per-path CSP.** The public site's CSP is strict (no `unsafe-eval`, no third-party origins beyond Sanity's image CDN); `/studio/*` relaxes it to what Sanity Studio actually needs. The two header blocks live in [`netlify.toml`](netlify.toml).
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

## Where to look

- **Standing up the deploy chain** (GitHub repo, Netlify, Sanity CORS, webhook, secrets, troubleshooting): [`../SETUP.md`](../SETUP.md).
- **Filling Studio for the first time** (every field with a copy-pasteable value): [`../zemphy-content.md`](../zemphy-content.md).
- **Codebase conventions** (filename casing, lint config, deploy model, anti-patterns): [`../polyym-sveltekit-guide.md`](../polyym-sveltekit-guide.md).
- **Original design source** (single-file HTML/CSS/JS the components were ported from): [`../zemphy-design.html`](../zemphy-design.html).
- **Release history**: [CHANGELOG.md](CHANGELOG.md).

## License

UNLICENSED. Private code for [zemphy.music](https://zemphy.music).
