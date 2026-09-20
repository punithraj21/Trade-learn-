# Trade Learn

An online reading app for the "Learn Stock Trading — From Zero to Confident" course
(8 modules, 60 chapters, 114-term glossary). Content-driven Next.js app: every
chapter is a static page generated from Markdown files under `docs/`.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS 3** + `@tailwindcss/typography`
- **TypeScript**
- **gray-matter** (chapter YAML frontmatter) + **react-markdown** / **remark-gfm** (chapter body rendering)
- No database, no API routes, no env vars — fully static content, generated at build time via `generateStaticParams`.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Course home — hero, disclaimer, overall progress bar, module grid |
| `/modules/[moduleId]` | Chapter list for one module (8 total: `foundations`, `price-action`, `market-structure`, `indicators`, `fundamentals`, `strategies`, `risk-psychology`, `mastery`) |
| `/chapters/[slug]` | Chapter reader — full Markdown body, on-page outline, mark-complete toggle, prev/next nav (flows across module boundaries) |
| `/glossary` | All glossary terms, alphabetically grouped, with client-side search |

## File layout

- `docs/` — **all course content**, copied verbatim from `punithraj21/forever`'s `claude/stock-trading-docs-eedepw` branch (that branch's own commits name this repo as the intended publish target). Don't hand-edit content here without also checking whether `forever`'s branch should be updated to match — it's the canonical source the content pipeline wrote to.
  - `docs/manifest.json` — the whole curriculum as data: `course` metadata + `modules[]`, each with `chapters[]` (`id`, `order`, `slug`, `file`, `title`, `difficulty`, `estimated_minutes`, `tags`, `prerequisites`, `summary`). This is the single source of truth for navigation — `lib/course.ts` never hardcodes a chapter list.
  - `docs/chapters/NN-module/NN-slug.md` — one chapter per file, `NN` = global chapter id so files sort in reading order. YAML frontmatter (id, module, module_title, order, title, slug, difficulty, estimated_minutes, tags, prerequisites, summary) + a body using fixed `## <emoji> Heading` sections (see `docs/STYLE_GUIDE.md`): 🎯 What you'll learn, 📘 Key concepts, 🔍 Example, ⚠️ Common mistakes, ✅ Key takeaways, 📝 Quick check, 📖 New words.
  - `docs/reference/glossary.md` — frontmatter + `## <Letter>` sections of `- **Term** — definition` lines.
- `lib/course.ts` — reads `docs/manifest.json` + chapter Markdown (via `gray-matter`) at request time (Node `fs`, no caching layer beyond a per-process manifest memo). Exposes `getManifest`, `getModules`, `getModule`, `getAllChapterMetas` (flattened, sorted by `id`), `getChapterBySlug`, `getAdjacentChapters` (prev/next across the whole 60-chapter sequence, not just within a module).
- `lib/glossary.ts` — parses `docs/reference/glossary.md` into `GlossarySection[]` by regex-matching `## <Letter>` headers and `- **Term** — definition` lines. If the glossary's dash style or heading format ever changes, this parser needs updating in lockstep.
- `lib/slug.ts` — `slugify()` strips emoji + normalizes text into a heading id. **Must stay in sync** between `components/ChapterMarkdown.tsx` (assigns `id={slugify(headingText)}` on every rendered `h2`) and `lib/course.ts`'s `extractOutline()` (builds the "on this page" sidebar links from the same headings) — they don't share a single call site, so a change to one needs the matching change in the other, or outline links will 404-anchor.
- `lib/useProgress.ts` — client-only progress tracking via `localStorage` (key `trade-learn:progress:v1`, a JSON array of completed chapter ids), read through `useSyncExternalStore` so multiple components (Header badge, module chapter checkmarks, chapter mark-complete button) stay in sync within a tab, and a `storage` event listener syncs across tabs. No backend — progress is per-browser, never sent anywhere.
- `components/ChapterMarkdown.tsx` — server component rendering a chapter body via `react-markdown` + `remark-gfm`. Custom renderers: `h2` (assigns the slugified id), `blockquote` (styled as an indigo callout box — used for the "> In one line:" summary every chapter opens with), `code` (distinguishes inline vs fenced by presence of a `className`, since `react-markdown` only sets `className` on fenced code blocks).
- `components/ChapterActions.tsx` — client component: mark-complete toggle + prev/next chapter links.
- `components/{Header,OverallProgress,ModuleGrid,ChapterListItem,GlossarySearch}.tsx` — all client components that read `useProgress()` (or, for `GlossarySearch`, local `useState` filtering); everything else in `app/` is a server component.

## Content authoring

To add or edit a chapter: follow `docs/STYLE_GUIDE.md`'s frontmatter + section-heading contract exactly — `lib/course.ts` and `components/ChapterMarkdown.tsx` assume every chapter uses the same fixed `## <emoji> Heading` set for the on-page outline to make sense, and the manifest's `id`/`order`/`slug`/`file` fields must match the file's own frontmatter or `getAllChapterMetas()`/`getAdjacentChapters()` will disagree with what's on disk.

## Build / deploy

- `npm run dev` — local dev on port 3000
- `npm run build` — production build; all 60 chapter pages + 8 module pages + home + glossary are statically generated (`generateStaticParams`)
- No environment variables required — see `.env.example`
- Deploys as a plain Next.js app to Vercel or any Next.js-compatible host; no config beyond the default framework preset

## Change log

- Scaffolded the app: copied the 60-chapter "Learn Stock Trading" course (`docs/`) from `punithraj21/forever`'s `claude/stock-trading-docs-eedepw` branch (its own commits name this repo as the publish target) and built a Next.js 16 reader around it — home page with progress + module grid, per-module chapter lists, a chapter reader with Markdown rendering + on-page outline + mark-complete + prev/next nav (crossing module boundaries), and a searchable glossary. Progress tracked client-side only via `localStorage`, no backend.

## Update protocol for future sessions

Keep this file current. When you make a non-trivial change:

1. Append a one-line entry to **Change log** (newest at the bottom)
2. Update the affected section above (Routes, File layout, etc.) so it still reflects reality
3. Drop entries that are no longer true rather than piling on history
