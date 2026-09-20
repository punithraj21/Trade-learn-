import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/slug";

/** Flattens a react-markdown children tree back to plain text, for heading ids. */
function textFrom(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFrom).join("");
  if (children && typeof children === "object" && "props" in children) {
    return textFrom((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export default function ChapterMarkdown({ content }: { content: string }) {
  return (
    <div className="prose-invert-auto prose prose-ink max-w-none prose-headings:scroll-mt-24 prose-h2:text-xl prose-h2:font-semibold prose-h3:text-base prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = textFrom(children);
            return <h2 id={slugify(text)}>{children}</h2>;
          },
          blockquote: ({ children }) => (
            <blockquote className="not-italic rounded-r-lg border-l-4 border-indigo-400 bg-indigo-50 px-4 py-3 text-ink-800 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-ink-100">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = Boolean(className);
            if (isBlock) return <code className={className}>{children}</code>;
            return (
              <code className="rounded bg-ink-100 px-1.5 py-0.5 text-[0.85em] font-medium text-ink-800 dark:bg-ink-800 dark:text-ink-100">
                {children}
              </code>
            );
          },
          // Chapter diagrams (see public/diagrams/) are self-contained SVG
          // cards with their own light background/border baked in — wrap in
          // a caption, not a second competing border.
          img: ({ src, alt }) => (
            <figure className="not-prose my-6 flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={typeof src === "string" ? src : ""}
                alt={alt ?? ""}
                loading="lazy"
                className="w-full max-w-xl rounded-xl shadow-sm ring-1 ring-black/5"
              />
              {alt && (
                <figcaption className="text-center text-xs text-ink-400 dark:text-ink-500">{alt}</figcaption>
              )}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
