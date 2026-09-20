/**
 * Turns a heading (e.g. "🎯 What you'll learn") into a URL-safe id
 * (e.g. "what-youll-learn"). Used both when rendering markdown headings and
 * when building the "on this page" outline, so the two stay in sync without
 * pulling in a rehype slug plugin.
 */
export function slugify(heading: string): string {
  return heading
    .normalize("NFKD")
    // Strip emoji and other symbol/pictograph code points.
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
