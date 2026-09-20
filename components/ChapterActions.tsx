"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import type { FlatChapterMeta } from "@/lib/course";

export default function ChapterActions({
  chapterId,
  prev,
  next,
}: {
  chapterId: number;
  prev: FlatChapterMeta | null;
  next: FlatChapterMeta | null;
}) {
  const { isComplete, toggle } = useProgress();
  const done = isComplete(chapterId);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => toggle(chapterId)}
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition sm:w-auto ${
          done
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-800"
            : "bg-indigo-600 text-white hover:bg-indigo-500"
        }`}
      >
        {done ? "✓ Marked complete — click to undo" : "Mark chapter complete"}
      </button>

      <div className="flex flex-col gap-3 border-t border-ink-200 pt-4 dark:border-ink-800 sm:flex-row sm:items-stretch sm:justify-between">
        {prev ? (
          <Link
            href={`/chapters/${prev.slug}`}
            className="flex-1 rounded-xl border border-ink-200 px-4 py-3 text-sm transition hover:border-indigo-300 dark:border-ink-800"
          >
            <span className="block text-xs text-ink-400">← Previous</span>
            <span className="font-medium text-ink-800 dark:text-ink-100">{prev.title}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/chapters/${next.slug}`}
            className="flex-1 rounded-xl border border-ink-200 px-4 py-3 text-right text-sm transition hover:border-indigo-300 dark:border-ink-800"
          >
            <span className="block text-xs text-ink-400">Next →</span>
            <span className="font-medium text-ink-800 dark:text-ink-100">{next.title}</span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
