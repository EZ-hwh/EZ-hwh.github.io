// Files in public/ are written as "/cv.pdf" in src/data. When the site is served from
// a sub-path (a repository not named <username>.github.io), prefix that path.

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(href: string): string {
  return href.startsWith("/") && !href.startsWith("//") ? `${BASE}${href}` : href;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
