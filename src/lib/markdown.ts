import { Marked, type Tokens } from "marked";
import markedFootnote from "marked-footnote";
import { gfmHeadingId } from "marked-gfm-heading-id";
import markedKatex from "marked-katex-extension";
import { asset, isExternal } from "./asset";

// Markdown → HTML for blog posts, done once when the site is built.
// Supports GitHub-flavoured Markdown (tables, ~~strikethrough~~, task lists),
// math with $inline$ and $$display$$ (KaTeX), footnotes ([^1]), and anchor ids on headings.

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const marked = new Marked(
  { gfm: true },
  gfmHeadingId(),
  markedFootnote({ description: "Notes" }),
  markedKatex({ throwOnError: false, nonStandard: true }),
  {
    renderer: {
      // External links open in a new tab; links to files in public/ get the site's base path.
      link(this: { parser: { parseInline: (t: Tokens.Link["tokens"]) => string } }, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = asset(token.href);
        const title = token.title ? ` title="${escapeAttr(token.title)}"` : "";
        const ext = isExternal(token.href) ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeAttr(href)}"${title}${ext}>${text}</a>`;
      },
      // Images: base path for files in public/, lazy loading.
      image(token: Tokens.Image) {
        const title = token.title ? ` title="${escapeAttr(token.title)}"` : "";
        return `<img src="${escapeAttr(asset(token.href))}" alt="${escapeAttr(token.text)}"${title} loading="lazy">`;
      },
    },
  },
);

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false }) as string;
}
