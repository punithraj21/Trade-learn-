import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getModule, getModules } from "@/lib/course";
import ChapterListItem from "@/components/ChapterListItem";

export function generateStaticParams() {
  return getModules().map((mod) => ({ moduleId: mod.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  return { title: mod?.title ?? "Module not found" };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  const modules = getModules();
  const currentIndex = modules.findIndex((m) => m.id === mod.id);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-ink-400 hover:text-indigo-600 dark:hover:text-indigo-400">
        ← All modules
      </Link>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
          Module {mod.order} of {modules.length}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink-900 dark:text-ink-50">{mod.title}</h1>
        <p className="mt-2 max-w-2xl text-ink-600 dark:text-ink-300">{mod.goal}</p>
      </div>

      <div className="space-y-3">
        {mod.chapters
          .sort((a, b) => a.order - b.order)
          .map((chapter, index) => (
            <ChapterListItem key={chapter.id} chapter={chapter} index={index} />
          ))}
      </div>

      <div className="flex items-center justify-between border-t border-ink-200 pt-4 text-sm dark:border-ink-800">
        {prevModule ? (
          <Link
            href={`/modules/${prevModule.id}`}
            className="text-ink-500 hover:text-indigo-600 dark:text-ink-400 dark:hover:text-indigo-400"
          >
            ← {prevModule.title}
          </Link>
        ) : (
          <span />
        )}
        {nextModule && (
          <Link
            href={`/modules/${nextModule.id}`}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {nextModule.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
