# Trade Learn

A free, online reading app for **Learn Stock Trading — From Zero to Confident**: a
beginner-to-intermediate course on reading the market, analysing companies,
entering/exiting trades, and managing risk. 8 modules, 60 chapters, a 114-term
glossary — all content lives in [`docs/`](./docs) as Markdown + a JSON manifest, and
this app is the reader built on top of it.

> ⚠️ Educational content only — not financial advice. Trading and investing carry a
> real risk of losing money.

## Features

- **Course home** — hero, disclaimer, live progress bar, and a module map.
- **Module pages** (`/modules/[moduleId]`) — chapter list per module with
  difficulty/duration tags and per-chapter completion state.
- **Chapter reader** (`/chapters/[slug]`) — full Markdown rendering (headings,
  callouts, tables), 316 real SVG diagrams across all 60 chapters (price
  charts, candlesticks, indicator panels, risk/reward brackets, comparisons —
  see `scripts/generate-diagrams.mjs`), an "on this page" outline, a
  mark-complete toggle, and prev/next navigation that flows across module
  boundaries.
- **Glossary** (`/glossary`) — all 114 terms, alphabetically grouped with live
  client-side search.
- **Progress tracking** — stored in the browser's `localStorage` only (no
  backend/account needed); synced live across every open tab.

## Tech stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS 3** + `@tailwindcss/typography` for the chapter prose
- **gray-matter** to parse each chapter's YAML frontmatter (build time only)
- **react-markdown** + **remark-gfm** to render chapter bodies (tables, strikethrough, etc.)
- **@opennextjs/cloudflare** + **wrangler** to deploy as a Cloudflare Worker
- No database, no API routes, no environment variables — every chapter is a static
  page generated at build time from `docs/`.

## Content structure

```
docs/
├── manifest.json      ← course/module/chapter metadata (drives all navigation)
├── README.md          ← content authoring guide (course map, folder layout)
├── STYLE_GUIDE.md      ← the chapter contract: required frontmatter + section headings
├── reference/
│   └── glossary.md    ← "## <Letter>" sections of "- **Term** — definition" lines
└── chapters/
    ├── 01-foundations/
    ├── 02-price-action/
    ├── 03-market-structure/
    ├── 04-indicators/
    ├── 05-fundamentals/
    ├── 06-strategies/
    ├── 07-risk-psychology/
    └── 08-mastery/
```

`scripts/generate-content.mjs` parses `manifest.json` + every chapter's Markdown
(via `gray-matter`) + `reference/glossary.md` into `lib/generated/content.json`,
which `lib/course.ts`/`lib/glossary.ts` import directly. This runs automatically
before `dev`/`build` (`predev`/`prebuild` npm hooks) — **it does not read `docs/`
at request time**, only at build time. That matters: the Cloudflare Workers
runtime doesn't carry `docs/` into its request-time sandbox, so a plain
`fs.readFileSync(path.join(process.cwd(), "docs", ...))` 500s in production
there even though it works fine under `next start`. Importing the generated JSON
bakes the content into the JS bundle instead, so it works identically under
Node, the edge runtime, and Workers. Adding a chapter is still just: drop a new
`NN-slug.md` file following `STYLE_GUIDE.md`, add its entry to `manifest.json`,
done — the generator picks it up on the next `dev`/`build`.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (statically generates all 60 chapters + 8 modules)
npm run start    # serve the production build
```

## Deploying

### Cloudflare Workers (configured)

```bash
npm run deploy    # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

Requires a Cloudflare account with `wrangler` authenticated (`npx wrangler login`,
or `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in CI). No bindings, no
environment variables, no custom domain configured in `wrangler.jsonc` — it
deploys to the default `trade-learn.<your-subdomain>.workers.dev`. Add a
`routes` entry to `wrangler.jsonc` for a custom domain (see `punithraj21/forever`'s
`wrangler.jsonc` for the pattern).

To run it locally against the actual Workers runtime first (no deploy, no
credentials needed):

```bash
npx opennextjs-cloudflare build
npx wrangler dev --local
```

### Vercel (also works, zero config)

This is a plain Next.js app with zero required environment variables — it also
deploys as-is to Vercel (import the repo at vercel.com/new, framework preset
"Next.js") or any other Next.js-compatible host.

## Content provenance

The `docs/` course content was originally drafted in the `punithraj21/forever`
repo (branch `claude/stock-trading-docs-eedepw`) and copied here verbatim as the
publish target named in its own commit history. This repo is the app built to
read it.
