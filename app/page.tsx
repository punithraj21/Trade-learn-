import Link from "next/link";
import { getAllChapterMetas, getManifest, getModules } from "@/lib/course";
import { getGlossaryTermCount } from "@/lib/glossary";
import ModuleGrid from "@/components/ModuleGrid";
import OverallProgress from "@/components/OverallProgress";

export default function HomePage() {
  const { course } = getManifest();
  const modules = getModules();
  const chapters = getAllChapterMetas();
  const firstChapter = chapters[0];
  const glossaryCount = getGlossaryTermCount();

  return (
    <div className="space-y-12">
      <section className="text-center">
        <p className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {course.totals.modules} modules · {course.totals.chapters} chapters · free
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">
          {course.title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-ink-600 dark:text-ink-300">
          {course.subtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {firstChapter && (
            <Link
              href={`/chapters/${firstChapter.slug}`}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Start learning →
            </Link>
          )}
          <a
            href="#modules"
            className="rounded-full border border-ink-200 px-6 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-ink-700 dark:text-ink-200"
          >
            Browse modules
          </a>
          <Link
            href="/glossary"
            className="rounded-full border border-ink-200 px-6 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-ink-700 dark:text-ink-200"
          >
            Glossary ({glossaryCount} terms)
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-md">
        <OverallProgress totalChapters={course.totals.chapters} />
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-500/10 dark:text-amber-200">
        <strong className="font-semibold">Disclaimer:</strong> {course.disclaimer}
      </section>

      <section id="modules" className="scroll-mt-20">
        <h2 className="mb-4 text-lg font-semibold text-ink-900 dark:text-ink-50">
          Course map
        </h2>
        <ModuleGrid modules={modules} />
      </section>
    </div>
  );
}
