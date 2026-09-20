"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import type { ChapterMeta } from "@/lib/course";

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
};

export default function ChapterListItem({ chapter, index }: { chapter: ChapterMeta; index: number }) {
  const { isComplete } = useProgress();
  const done = isComplete(chapter.id);

  return (
    <Link
      href={`/chapters/${chapter.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-ink-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-ink-800 dark:bg-ink-900 dark:hover:border-indigo-700"
    >
      <span
        aria-hidden
        className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${
          done
            ? "bg-emerald-500 text-white"
            : "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400"
        }`}
      >
        {done ? "✓" : index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-ink-900 group-hover:text-indigo-600 dark:text-ink-50 dark:group-hover:text-indigo-400">
            {chapter.title}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
              DIFFICULTY_STYLES[chapter.difficulty] ??
              "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400"
            }`}
          >
            {chapter.difficulty}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{chapter.summary}</p>
      </div>
      <span className="flex-none whitespace-nowrap pt-1 text-xs text-ink-400">
        {chapter.estimated_minutes} min
      </span>
    </Link>
  );
}
