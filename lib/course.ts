// Content comes from a build-time-generated JSON module (see
// scripts/generate-content.mjs), not runtime fs reads — this file must work
// identically under `next start`, the edge runtime, and Cloudflare Workers,
// where the docs/ folder is not available in the request-time sandbox.
import generatedContent from "./generated/content.json";
import { slugify } from "./slug";

export interface ChapterMeta {
  id: number;
  order: number;
  slug: string;
  file: string;
  title: string;
  difficulty: "beginner" | "intermediate" | string;
  estimated_minutes: number;
  tags: string[];
  prerequisites: number[];
  summary: string;
}

export interface Module {
  id: string;
  order: number;
  folder: string;
  title: string;
  goal: string;
  chapters: ChapterMeta[];
}

export interface Manifest {
  course: {
    id: string;
    title: string;
    subtitle: string;
    version: string;
    language: string;
    level: string;
    author: string;
    disclaimer: string;
    totals: { modules: number; chapters: number };
  };
  modules: Module[];
}

export interface ChapterOutlineItem {
  text: string;
  id: string;
}

export interface FlatChapterMeta extends ChapterMeta {
  moduleId: string;
  moduleTitle: string;
}

export interface Chapter extends FlatChapterMeta {
  content: string;
  outline: ChapterOutlineItem[];
}

// The JSON module's inferred type is a giant literal derived from the
// current file contents — cast once here rather than fight it at every call site.
const content = generatedContent as unknown as {
  manifest: Manifest;
  chapters: Record<string, string>;
};

export function getManifest(): Manifest {
  return content.manifest;
}

export function getModules(): Module[] {
  return [...content.manifest.modules].sort((a, b) => a.order - b.order);
}

export function getModule(moduleId: string): Module | undefined {
  return content.manifest.modules.find((m) => m.id === moduleId);
}

/** All 60 chapters, flattened and sorted into reading order. */
export function getAllChapterMetas(): FlatChapterMeta[] {
  return getModules()
    .flatMap((mod) =>
      mod.chapters.map((ch) => ({
        ...ch,
        moduleId: mod.id,
        moduleTitle: mod.title,
      }))
    )
    .sort((a, b) => a.id - b.id);
}

/** Extracts "## Heading" lines from a chapter body for the on-page outline. */
function extractOutline(markdown: string): ChapterOutlineItem[] {
  const headingPattern = /^##\s+(.+)$/gm;
  const items: ChapterOutlineItem[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(markdown))) {
    const text = match[1].trim();
    items.push({ text, id: slugify(text) });
  }
  return items;
}

/** Loads a full chapter (metadata + markdown body) by its slug. */
export function getChapterBySlug(slug: string): Chapter | undefined {
  const meta = getAllChapterMetas().find((c) => c.slug === slug);
  if (!meta) return undefined;

  const body = content.chapters[slug];
  if (body === undefined) return undefined;

  return {
    ...meta,
    content: body,
    outline: extractOutline(body),
  };
}

export interface AdjacentChapters {
  prev: FlatChapterMeta | null;
  next: FlatChapterMeta | null;
}

/** Returns the chapters immediately before/after a given chapter id in reading order. */
export function getAdjacentChapters(id: number): AdjacentChapters {
  const all = getAllChapterMetas();
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

export function getTotalChapterCount(): number {
  return content.manifest.course.totals.chapters;
}
