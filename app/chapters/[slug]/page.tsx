import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdjacentChapters, getAllChapterMetas, getChapterBySlug } from "@/lib/course";
import ChapterMarkdown from "@/components/ChapterMarkdown";
import ChapterActions from "@/components/ChapterActions";

export function generateStaticParams() {
  return getAllChapterMetas().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  return {
    title: chapter?.title ?? "Chapter not found",
    description: chapter?.summary,
  };
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
};

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(chapter.id);

  return (
    <div className="lg:grid lg:grid-cols-[1fr_14rem] lg:gap-10">
      <article className="min-w-0">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/modules/${chapter.moduleId}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {chapter.moduleTitle}
          </Link>
          <span>/</span>
          <span className="text-ink-500 dark:text-ink-300">Chapter {chapter.id}</span>
        </nav>

        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                DIFFICULTY_STYLES[chapter.difficulty] ??
                "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400"
              }`}
            >
              {chapter.difficulty}
            </span>
            <span className="text-xs text-ink-400">{chapter.estimated_minutes} min read</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 dark:text-ink-50">
            {chapter.title}
          </h1>
          {chapter.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chapter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <ChapterMarkdown content={chapter.content} />

        <div className="mt-10">
          <ChapterActions chapterId={chapter.id} prev={prev} next={next} />
        </div>
      </article>

      {chapter.outline.length > 0 && (
        <aside className="mt-10 hidden lg:mt-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-ink-200 p-4 text-sm dark:border-ink-800">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
              On this page
            </p>
            <ul className="space-y-1.5">
              {chapter.outline.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-ink-500 hover:text-indigo-600 dark:text-ink-400 dark:hover:text-indigo-400"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
