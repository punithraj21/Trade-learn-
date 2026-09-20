import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl">🔍</p>
      <h1 className="mt-4 text-xl font-semibold text-ink-900 dark:text-ink-50">
        That page doesn&apos;t exist
      </h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        The chapter or module you&apos;re looking for may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Back to course home
      </Link>
    </div>
  );
}
