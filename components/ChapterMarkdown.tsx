import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
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

type ImgProps = { src?: string | Blob; alt?: string };

// Hoisted to a stable, named reference so `ChapterParagraph` can identify
// "this child is one of ours" by function identity (`child.type === ChapterImage`)
// — react-markdown passes the component override itself as the element's
// `type`, not the string "img", since children are unrendered element
// descriptors until React actually reconciles them.
function ChapterImage({ src, alt }: ImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      loading="lazy"
      className="w-full max-w-xl rounded-xl shadow-sm ring-1 ring-black/5"
    />
  );
}

// A standalone `![alt](src)` line is, per CommonMark, a paragraph containing
// only an image — react-markdown renders that as <p><ChapterImage/></p>. We
// want a <figure><img/><figcaption/></figure> for chapter diagrams, but
// <figure> is a block element and a <p> may only contain phrasing content:
// <p><figure>...</figure></p> is invalid HTML, so the browser's parser
// silently re-nests it on first paint, which then mismatches React's
// hydration and blows the whole tree away client-side (confirmed via a
// hydration-mismatch error on every chapter with an image, before this fix).
// Fix: detect the paragraph-is-only-an-image case here and render the figure
// directly, with no <p> wrapper, instead of ever letting <figure> land inside
// a <p>.
function ChapterParagraph({ children }: { children?: ReactNode }) {
  const kids = Children.toArray(children).filter((k) => !(typeof k === "string" && k.trim() === ""));
  const soleImage =
    kids.length === 1 && isValidElement(kids[0]) && kids[0].type === ChapterImage
      ? (kids[0] as ReactElement<ImgProps>)
      : null;

  if (soleImage) {
    return (
      <figure className="not-prose my-6 flex flex-col items-center gap-2">
        {soleImage}
        {soleImage.props.alt && (
          <figcaption className="text-center text-xs text-ink-400 dark:text-ink-500">
            {soleImage.props.alt}
          </figcaption>
        )}
      </figure>
    );
  }
  return <p>{children}</p>;
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
          img: ChapterImage,
          p: ChapterParagraph,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
