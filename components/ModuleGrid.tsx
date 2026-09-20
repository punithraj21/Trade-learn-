"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import type { Module } from "@/lib/course";

const MODULE_ICONS: Record<string, string> = {
  foundations: "🧱",
  "price-action": "🕯️",
  "market-structure": "📐",
  indicators: "📊",
  fundamentals: "🧾",
  strategies: "🎯",
  "risk-psychology": "🧠",
  mastery: "🏁",
};

export default function ModuleGrid({ modules }: { modules: Module[] }) {
  const { completedIds } = useProgress();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {modules.map((mod) => {
        const total = mod.chapters.length;
        const done = mod.chapters.filter((c) => completedIds.has(c.id)).length;
        const isComplete = done === total && total > 0;

        return (
          <Link
            key={mod.id}
            href={`/modules/${mod.id}`}
            className="group flex flex-col justify-between rounded-2xl border border-ink-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-ink-800 dark:bg-ink-900 dark:hover:border-indigo-700"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl" aria-hidden>
                  {MODULE_ICONS[mod.id] ?? "📘"}
                </span>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                  Module {mod.order}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink-900 group-hover:text-indigo-600 dark:text-ink-50 dark:group-hover:text-indigo-400">
                {mod.title}
              </h3>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{mod.goal}</p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-ink-400">
                <span>
                  {total} chapter{total === 1 ? "" : "s"}
                </span>
                <span className={isComplete ? "font-medium text-emerald-600 dark:text-emerald-400" : ""}>
                  {isComplete ? "Complete ✓" : `${done}/${total} done`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
