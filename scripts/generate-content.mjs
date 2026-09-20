#!/usr/bin/env node
// Pre-parses everything under docs/ into a single JSON module that gets
// bundled by the JS compiler at build time (lib/generated/content.json).
//
// Why this exists: lib/course.ts and lib/glossary.ts used to call
// fs.readFileSync(path.join(process.cwd(), "docs", ...)) at request time.
// That works fine under `next start`, but breaks under the Cloudflare
// Workers runtime (via @opennextjs/cloudflare) — the Worker sandbox does
// not carry docs/ into its bundle, so every request 500s with
// "ENOENT: /bundle/docs/manifest.json". Importing a generated JSON file
// instead means the content is embedded into the JS bundle at build time,
// which works identically under Node, the edge runtime, and Workers.
//
// Runs automatically before `next dev`/`next build` via the predev/prebuild
// npm scripts. Re-run manually (`npm run generate:content`) after editing
// anything under docs/ if you're not going through dev/build.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");
const OUT_DIR = path.join(ROOT, "lib", "generated");
const OUT_FILE = path.join(OUT_DIR, "content.json");

function readManifest() {
  const raw = fs.readFileSync(path.join(DOCS_DIR, "manifest.json"), "utf8");
  return JSON.parse(raw);
}

/** Reads every chapter's markdown body (frontmatter stripped), keyed by slug. */
function readChapterBodies(manifest) {
  const bodies = {};
  for (const mod of manifest.modules) {
    for (const ch of mod.chapters) {
      const raw = fs.readFileSync(path.join(DOCS_DIR, ch.file), "utf8");
      const { content } = matter(raw);
      bodies[ch.slug] = content.trim();
    }
  }
  return bodies;
}

/**
 * Parses docs/reference/glossary.md, structured as:
 *   ## A
 *   - **Term** — definition.
 *   ## B
 *   ...
 */
function parseGlossary() {
  const raw = fs.readFileSync(path.join(DOCS_DIR, "reference", "glossary.md"), "utf8");
  const { content } = matter(raw);

  const sections = [];
  let current = null;
  for (const line of content.split("\n")) {
    const letterMatch = line.match(/^##\s+([A-Z0-9])\s*$/);
    if (letterMatch) {
      current = { letter: letterMatch[1], terms: [] };
      sections.push(current);
      continue;
    }
    const termMatch = line.match(/^-\s+\*\*(.+?)\*\*\s*[—-]\s*(.+)$/);
    if (termMatch && current) {
      current.terms.push({ term: termMatch[1].trim(), definition: termMatch[2].trim() });
    }
  }
  return sections;
}

const manifest = readManifest();
const chapters = readChapterBodies(manifest);
const glossary = parseGlossary();

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify({ manifest, chapters, glossary }, null, 2) + "\n");

const termCount = glossary.reduce((sum, s) => sum + s.terms.length, 0);
console.log(
  `Generated ${path.relative(ROOT, OUT_FILE)} — ${manifest.modules.length} modules, ` +
    `${Object.keys(chapters).length} chapters, ${termCount} glossary terms.`
);
