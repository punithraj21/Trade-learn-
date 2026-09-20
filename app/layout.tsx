import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getManifest, getTotalChapterCount } from "@/lib/course";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export function generateMetadata(): Metadata {
  const { course } = getManifest();
  return {
    title: {
      default: course.title,
      template: `%s · ${course.title}`,
    },
    description: course.subtitle,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const totalChapters = getTotalChapterCount();

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header totalChapters={totalChapters} />
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">{children}</main>
        <footer className="border-t border-ink-200/70 py-8 text-center text-xs text-ink-300 dark:border-ink-800/70">
          <p className="mx-auto max-w-2xl px-4">
            Educational content only — not financial advice. Trading and investing carry a
            real risk of losing money. Always do your own research and never risk money you
            cannot afford to lose.
          </p>
        </footer>
      </body>
    </html>
  );
}
