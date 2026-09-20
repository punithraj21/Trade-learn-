import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "./slug";

const DOCS_DIR = path.join(process.cwd(), "docs");

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

export interface Chapter extends FlatChapterMeta {
  content: string;
  outline: ChapterOutlineItem[];
}

let manifestCache: Manifest | null = null;

/** Reads and parses docs/manifest.json (cached per server process). */
export function getManifest(): Manifest {
  if (manifestCache) return manifestCache;
  const raw = fs.readFileSync(path.join(DOCS_DIR, "manifest.json"), "utf8");
  manifestCache = JSON.parse(raw) as Manifest;
  return manifestCache;
}

export function getModules(): Module[] {
  return [...getManifest().modules].sort((a, b) => a.order - b.order);
}

export function getModule(moduleId: string): Module | undefined {
  return getManifest().modules.find((m) => m.id === moduleId);
}

export interface FlatChapterMeta extends ChapterMeta {
  moduleId: string;
  moduleTitle: string;
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

  const filePath = path.join(DOCS_DIR, meta.file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);

  return {
    ...meta,
    content: content.trim(),
    outline: extractOutline(content),
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
  return getManifest().course.totals.chapters;
}
