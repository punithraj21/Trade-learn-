// See lib/course.ts for why this reads a build-time-generated JSON module
// (scripts/generate-content.mjs) instead of docs/reference/glossary.md at
// request time.
import generatedContent from "./generated/content.json";

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface GlossarySection {
  letter: string;
  terms: GlossaryTerm[];
}

const glossary = generatedContent.glossary as unknown as GlossarySection[];

export function getGlossary(): GlossarySection[] {
  return glossary;
}

export function getGlossaryTermCount(): number {
  return glossary.reduce((sum, section) => sum + section.terms.length, 0);
}
