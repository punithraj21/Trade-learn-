import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const GLOSSARY_PATH = path.join(process.cwd(), "docs", "reference", "glossary.md");

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface GlossarySection {
  letter: string;
  terms: GlossaryTerm[];
}

let cache: GlossarySection[] | null = null;

/**
 * Parses docs/reference/glossary.md, which is structured as:
 *   ## A
 *   - **Term** — definition.
 *   - **Term** — definition.
 *   ## B
 *   ...
 */
export function getGlossary(): GlossarySection[] {
  if (cache) return cache;

  const raw = fs.readFileSync(GLOSSARY_PATH, "utf8");
  const { content } = matter(raw);

  const sections: GlossarySection[] = [];
  let current: GlossarySection | null = null;

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

  cache = sections;
  return sections;
}

export function getGlossaryTermCount(): number {
  return getGlossary().reduce((sum, section) => sum + section.terms.length, 0);
}
