"use client";

import { useMemo, useState } from "react";
import type { GlossarySection } from "@/lib/glossary";

export default function GlossarySearch({ sections }: { sections: GlossarySection[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((section) => ({
        ...section,
        terms: section.terms.filter(
          (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
        ),
      }))
      .filter((section) => section.terms.length > 0);
  }, [query, sections]);

  const totalShown = filtered.reduce((sum, s) => sum + s.terms.length, 0);

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-4 bg-ink-50/90 px-4 py-3 backdrop-blur dark:bg-ink-950/90 sm:top-[4.5rem]">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none ring-indigo-300 focus:ring-2 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100"
        />
        {query && (
          <p className="mt-1.5 text-xs text-ink-400">
            {totalShown} match{totalShown === 1 ? "" : "es"}
          </p>
        )}
      </div>

      <div className="mt-4 space-y-8">
        {filtered.length === 0 && (
          <p className="text-sm text-ink-400">No terms match &ldquo;{query}&rdquo;.</p>
        )}
        {filtered.map((section) => (
          <section key={section.letter} id={`letter-${section.letter}`}>
            <h2 className="mb-2 text-sm font-bold text-indigo-500">{section.letter}</h2>
            <dl className="space-y-3">
              {section.terms.map((t) => (
                <div key={t.term} className="border-b border-ink-100 pb-3 dark:border-ink-800">
                  <dt className="font-medium text-ink-900 dark:text-ink-50">{t.term}</dt>
                  <dd className="mt-0.5 text-sm text-ink-600 dark:text-ink-300">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
