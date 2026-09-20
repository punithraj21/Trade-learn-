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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
