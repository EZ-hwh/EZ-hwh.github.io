// Prepares the photos for the Gallery page.
//
// Reads the photos in src/content/gallery/ and writes web-sized copies to public/gallery/
// (generated, not committed):
//   <name>.thumb.webp   for the grid, at most 720 px tall
//   <name>.webp         for the full view, at most 2400 px on the long side
// plus public/gallery/manifest.json with their sizes. Rotation from the camera is applied,
// colours are kept, and camera data (including GPS location) is left out of the copies.
//
// Runs by itself before `npm run dev` and `npm run build`. If you add photos while the dev
// server is running, run `npm run gallery` and refresh the page.
// Photos whose file name starts with "_" are samples: prepared for `npm run dev` only.

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";

const SRC = "src/content/gallery";
const OUT = "public/gallery";
const MANIFEST = join(OUT, "manifest.json");
const IMAGE = /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i;
const VERSION = 1; // bump to regenerate every copy after changing the settings below
const THUMB = { width: 1600, height: 720, quality: 78 };
const FULL = { width: 2400, height: 2400, quality: 82 };
const forBuild = process.argv.includes("--build");

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("Gallery: the image library (sharp) isn't installed, so photos are copied at full size. Run `npm install` to fix this.");
}

const files = existsSync(SRC)
  ? readdirSync(SRC).filter((f) => IMAGE.test(f) && !(forBuild && f.startsWith("_"))).sort()
  : [];

const old = readManifest();
const manifest = { version: VERSION, photos: {}, skipped: {} };
const used = new Set();
let made = 0, kept = 0, skipped = 0;

mkdirSync(OUT, { recursive: true });

for (const file of files) {
  const src = join(SRC, file);
  const { size, mtimeMs } = statSync(src);
  const id = uniqueId(parse(file).name);
  const prev = old.photos?.[file];

  if (
    old.version === VERSION && prev && prev.id === id && prev.source.size === size &&
    prev.source.mtimeMs === mtimeMs && existsSync(join(OUT, prev.thumb.file)) && existsSync(join(OUT, prev.full.file))
  ) {
    manifest.photos[file] = prev;
    kept++;
    continue;
  }

  try {
    manifest.photos[file] = { id, source: { size, mtimeMs }, ...(sharp ? await resize(src, id) : copy(src, file, id)) };
    made++;
    if (size > 20 * 1024 * 1024) {
      console.warn(`Gallery: ${file} is ${Math.round(size / 1048576)} MB. It works, but exporting at about 3000 px keeps the repository small.`);
    }
  } catch (err) {
    used.delete(id);
    const hint = /\.hei[cf]$/i.test(file) ? " HEIC photos can't be read here; export it as JPEG." : "";
    manifest.skipped[file] = `${err.message.split("\n")[0]}.${hint}`;
    skipped++;
    console.warn(`Gallery: skipped ${file} (${err.message.split("\n")[0]}).${hint}`);
  }
}

// Remove copies of photos that were deleted or renamed.
const keep = new Set(["manifest.json"]);
for (const p of Object.values(manifest.photos)) keep.add(p.thumb.file).add(p.full.file);
for (const f of readdirSync(OUT)) if (!keep.has(f)) rmSync(join(OUT, f), { force: true });

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
if (files.length) {
  const shown = made + kept;
  console.log(`Gallery: ${shown} photo${shown === 1 ? "" : "s"} ready (${made} prepared, ${kept} unchanged${skipped ? `, ${skipped} skipped` : ""}).`);
}

async function resize(src, id) {
  const meta = await sharp(src).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const pipeline = (box, quality) => {
    let p = sharp(src, { failOn: "none" })
      .rotate()
      .resize({ width: box.width, height: box.height, fit: "inside", withoutEnlargement: true });
    // Keep wide-gamut colour (e.g. Display P3 from phones); everything else becomes sRGB.
    if (meta.icc && meta.space === "srgb") p = p.keepIccProfile();
    return p.webp({ quality, effort: 5 });
  };
  const thumb = await pipeline(THUMB, THUMB.quality).toFile(join(OUT, `${id}.thumb.webp`));
  const full = await pipeline(FULL, FULL.quality).toFile(join(OUT, `${id}.webp`));
  return {
    width: rotated ? meta.height : meta.width,
    height: rotated ? meta.width : meta.height,
    thumb: { file: `${id}.thumb.webp`, width: thumb.width, height: thumb.height },
    full: { file: `${id}.webp`, width: full.width, height: full.height },
  };
}

function copy(src, file, id) {
  const name = `${id}${parse(file).ext.toLowerCase()}`;
  copyFileSync(src, join(OUT, name));
  return { width: null, height: null, thumb: { file: name, width: null, height: null }, full: { file: name, width: null, height: null } };
}

// "First Snow (2).JPG" → "first-snow-2"; a second photo with the same name gets "-2".
function uniqueId(stem) {
  const base = stem.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "photo";
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

function readManifest() {
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}
