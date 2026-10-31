import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { galleryLayout, photos as listed } from "@/data/gallery";
import type { Photo } from "@/types";

// Photos for the Gallery page. The originals are in src/content/gallery/; scripts/gallery.mjs
// writes the web-sized copies and public/gallery/manifest.json, which this file reads.
// Files starting with "_" are samples, shown only during `npm run dev`.

const SRC = join(process.cwd(), "src", "content", "gallery");
const MANIFEST = join(process.cwd(), "public", "gallery", "manifest.json");
const IMAGE = /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i;
const DEV = process.env.NODE_ENV === "development";
const FALLBACK_RATIO = 3 / 2;

interface Size { file: string; width: number | null; height: number | null }
interface ManifestEntry { id: string; width: number | null; height: number | null; thumb: Size; full: Size }

export interface GalleryPhoto extends Photo {
  /** Used in the address of the full view: /gallery/#first-snow */
  id: string;
  alt: string;
  sample: boolean;
  /** Width ÷ height. */
  ratio: number;
  thumb: { src: string; width: number | null; height: number | null };
  full: { src: string; width: number | null; height: number | null };
}

const warned = new Set<string>();
function warn(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`Gallery: ${message}`);
}

function readManifest(): { photos: Record<string, ManifestEntry>; skipped: Record<string, string> } {
  try {
    const m = JSON.parse(readFileSync(MANIFEST, "utf8"));
    return { photos: m.photos ?? {}, skipped: m.skipped ?? {} };
  } catch {
    return { photos: {}, skipped: {} };
  }
}

/** Photos to show, in page order: those listed in src/data/gallery.ts, then the rest of the folder. */
export function getPhotos(): GalleryPhoto[] {
  const onDisk = existsSync(SRC) ? readdirSync(SRC).filter((f) => IMAGE.test(f)) : [];
  const present = new Set(onDisk);
  const manifest = readManifest();
  const listedFiles = new Set(listed.map((p) => p.file));

  const entries: Photo[] = [
    ...listed.filter((p) => {
      if (present.has(p.file)) return true;
      warn(`src/data/gallery.ts lists "${p.file}", but there is no such file in src/content/gallery/.`);
      return false;
    }),
    ...onDisk.filter((f) => !listedFiles.has(f)).sort().map((file) => ({ file })),
  ].filter((p) => DEV || !p.file.startsWith("_"));

  return entries.flatMap((p) => {
    const m = manifest.photos[p.file];
    if (!m) {
      const reason = manifest.skipped[p.file];
      warn(reason
        ? `"${p.file}" couldn't be read (${reason})`
        : `"${p.file}" hasn't been prepared yet. Run \`npm run gallery\` (or restart \`npm run dev\`), then refresh.`);
      return [];
    }
    const ratio = m.width && m.height ? m.width / m.height : FALLBACK_RATIO;
    return [{
      ...p,
      id: m.id,
      alt: p.alt ?? p.title ?? "",
      sample: p.file.startsWith("_"),
      ratio,
      thumb: { src: `/gallery/${m.thumb.file}`, width: m.thumb.width, height: m.thumb.height },
      full: { src: `/gallery/${m.full.file}`, width: m.full.width, height: m.full.height },
    }];
  });
}

export interface PhotoGroup {
  label: string;
  photos: GalleryPhoto[];
}

/**
 * With "by-year", one group per year (newest first, keeping the listed order within a year)
 * and undated photos last. With "all", or when no photo has a date, a single group.
 */
export function groupPhotos(photos: GalleryPhoto[]): PhotoGroup[] {
  const year = (p: GalleryPhoto) => /^\d{4}/.exec(p.date?.trim() ?? "")?.[0];
  if (galleryLayout === "all" || !photos.some(year)) return [{ label: "Photographs", photos }];
  const byYear = new Map<string, GalleryPhoto[]>();
  const undated: GalleryPhoto[] = [];
  for (const p of photos) {
    const y = year(p);
    if (y) byYear.set(y, [...(byYear.get(y) ?? []), p]);
    else undated.push(p);
  }
  const groups = [...byYear].sort(([a], [b]) => b.localeCompare(a)).map(([label, list]) => ({ label, photos: list }));
  return undated.length ? [...groups, { label: "Undated", photos: undated }] : groups;
}
