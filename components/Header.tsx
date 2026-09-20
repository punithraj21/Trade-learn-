"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";

export default function Header({ totalChapters }: { totalChapters: number }) {
  const { completedIds } = useProgress();
  const done = completedIds.size;
  const percent = totalChapters > 0 ? Math.round((done / totalChapters) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur dark:border-ink-800/70 dark:bg-ink-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900 dark:text-ink-50">
          <span aria-hidden className="text-lg">📈</span>
          <span>Trade&nbsp;Learn</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/glossary"
            className="hidden text-ink-700 hover:text-indigo-600 dark:text-ink-300 dark:hover:text-indigo-400 sm:inline"
          >
            Glossary
          </Link>
          <div
            className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-ink-200 dark:bg-ink-900 dark:ring-ink-800"
            title={`${done} of ${totalChapters} chapters complete`}
          >
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800 sm:w-24">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-xs font-medium text-ink-700 dark:text-ink-300">
              {done}/{totalChapters}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
