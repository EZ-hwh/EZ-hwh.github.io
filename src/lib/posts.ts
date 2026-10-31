import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

// Blog posts are Markdown files in src/content/blog/. The file name is the URL:
// src/content/blog/my-first-post.md → /blog/my-first-post/
//
// - Files starting with "_" (like _template.md) are templates: never published.
// - Posts with `draft: true` are hidden on the published site.
// - During `npm run dev`, drafts and templates are shown (marked "Draft") so you can preview them.

const DIR = join(process.cwd(), "src", "content", "blog");
const SHOW_DRAFTS = process.env.NODE_ENV === "development";

export interface Post {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  /** Minutes, estimated from the word count. */
  readingTime: number;
  /** The Markdown body, without the front matter. */
  content: string;
}

function toISODate(value: unknown, file: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return value.trim();
  throw new Error(`${file}: "date" must be written as YYYY-MM-DD, for example 2026-10-30.`);
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, "");
  const { data, content } = matter(readFileSync(join(DIR, fileName), "utf8"));
  if (!data.title || typeof data.title !== "string") {
    throw new Error(`src/content/blog/${fileName}: add a "title" to the front matter.`);
  }
  const words = content.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    date: toISODate(data.date, `src/content/blog/${fileName}`),
    description: typeof data.description === "string" ? data.description : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true || slug.startsWith("_"),
    readingTime: Math.max(1, Math.round(words / 220)),
    content,
  };
}

/** Posts to show, newest first. */
export function getPosts(): Post[] {
  if (!existsSync(DIR)) return [];
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPost)
    .filter((p) => SHOW_DRAFTS || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** "2026-10-30" → "October 30, 2026" (long) or "Oct 30" (short). */
export function formatPostDate(iso: string, style: "long" | "short" = "long"): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    ...(style === "long" ? { year: "numeric" } : {}),
  });
}
