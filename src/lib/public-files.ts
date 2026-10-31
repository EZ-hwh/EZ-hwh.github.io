import { existsSync } from "node:fs";
import { join } from "node:path";

// Checked when the site is built: a link to "/cv.pdf" is only shown if public/cv.pdf exists,
// so a missing file never turns into a broken link. Other links are always kept.
export function isAvailable(href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("//")) return true;
  const file = decodeURIComponent(href.split(/[?#]/)[0]);
  return existsSync(join(process.cwd(), "public", file));
}
