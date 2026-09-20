import Link from "next/link";
import type { Metadata } from "next";
import { getGlossary, getGlossaryTermCount } from "@/lib/glossary";
import GlossarySearch from "@/components/GlossarySearch";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Plain-English definitions of every key term used in the course.",
};

export default function GlossaryPage() {
  const sections = getGlossary();
  const count = getGlossaryTermCount();

  return (
    <div>
      <Link href="/" className="text-sm text-ink-400 hover:text-indigo-600 dark:hover:text-indigo-400">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-ink-900 dark:text-ink-50">
        Glossary of trading terms
      </h1>
      <p className="mt-1 text-ink-500 dark:text-ink-400">
        {count} plain-English definitions, from every chapter in the course.
      </p>

      <div className="mt-6">
        <GlossarySearch sections={sections} />
      </div>
    </div>
  );
}
