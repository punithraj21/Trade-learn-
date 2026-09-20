"use client";

import { useProgress } from "@/lib/useProgress";

export default function OverallProgress({ totalChapters }: { totalChapters: number }) {
  const { completedIds } = useProgress();
  const done = completedIds.size;
  const percent = totalChapters > 0 ? Math.round((done / totalChapters) * 100) : 0;
  const isDone = done >= totalChapters && totalChapters > 0;

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink-800 dark:text-ink-200">Your progress</span>
        <span className="text-ink-500 dark:text-ink-300">
          {done} / {totalChapters} chapters
        </span>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-400 dark:text-ink-400">
        {isDone
          ? "You've completed the whole course. 🎉"
          : done === 0
            ? "Progress is saved on this device as you complete chapters."
            : `${percent}% of the way through.`}
      </p>
    </div>
  );
}
