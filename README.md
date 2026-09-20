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
  callouts, code blocks, tables), an "on this page" outline, a mark-complete
  toggle, and prev/next navigation that flows across module boundaries.
- **Glossary** (`/glossary`) — all 114 terms, alphabetically grouped with live
  client-side search.
- **Progress tracking** — stored in the browser's `localStorage` only (no
  backend/account needed); synced live across every open tab.

## Tech stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS 3** + `@tailwindcss/typography` for the chapter prose
- **gray-matter** to parse each chapter's YAML frontmatter
- **react-markdown** + **remark-gfm** to render chapter bodies (tables, strikethrough, etc.)
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

`lib/course.ts` reads `manifest.json` + the chapter Markdown files (via `gray-matter`)
at request/build time; `lib/glossary.ts` parses `reference/glossary.md`. Neither
hits the network or a database — adding a chapter is: drop a new `NN-slug.md` file
following `STYLE_GUIDE.md`, add its entry to `manifest.json`, done.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (statically generates all 60 chapters + 8 modules)
npm run start    # serve the production build
```

## Deploying

This is a plain Next.js app with zero required environment variables — it deploys
as-is to Vercel (recommended: import the repo at vercel.com/new, framework preset
"Next.js", no config needed) or any other Next.js-compatible host.

## Content provenance

The `docs/` course content was originally drafted in the `punithraj21/forever`
repo (branch `claude/stock-trading-docs-eedepw`) and copied here verbatim as the
publish target named in its own commit history. This repo is the app built to
read it.
