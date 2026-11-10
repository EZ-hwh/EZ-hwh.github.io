# CLAUDE.md

Guidance for AI coding assistants in this repository.

## What this is

Wenhao Huang's academic homepage: a Next.js App Router site, statically exported (`output: "export"`) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `master` or `main` (the repository's branch is `master`). The workflow sets `BASE_PATH` from `actions/configure-pages`, so the site works at a domain root or under `/<repo-name>`.

## Commands

```bash
npm run dev       # dev server (runs scripts/gallery.mjs first)
npm run gallery   # prepare newly added gallery photos
npm run build     # static export into out/ (also type-checks)
npm run preview   # serve out/ on port 4173
```

## Where things live

- `src/data/profile.ts`: name, description, About text, links, portrait path.
- `src/data/news.ts`: news items, newest first, dates as `YYYY-MM`.
- Publications: the homepage shows papers with `selected: true` (`src/components/SelectedPapers.tsx`; all papers if none is marked) and links to `src/app/publications/page.tsx`, which lists every paper.
- `src/data/research.ts`: `publicationsLayout` (`"by-year"`, newest first, or `"by-topic"`), `topics` (research directions, in display order) and `publications` (kept newest first). Each paper's `topic` must be a topic id; `src/lib/research.ts` throws at build time otherwise. `*` after an author marks equal contribution.
- `src/data/cv.ts`: `education`, `experience`, `projects`, `honors` (timelines) and `teachingAndService` (lines). An empty list hides its section. Section order is in `src/app/page.tsx`.
- Text in data files supports `**bold**`, `*italic*` and `[text](url)` only (`src/lib/richtext.ts`).
- `public/`: `Harry_CV.pdf`, `portrait.jpg`. Paths in data are written as `/Harry_CV.pdf`; `src/lib/asset.ts` adds the base path, and `src/lib/public-files.ts` hides links to files that don't exist at build time.
- `src/app/globals.css`: colour tokens (light, and dark via `prefers-color-scheme`) and all styles.
- `src/lib/cyanotype.ts`: the generative print. Browser-only; used by the client components `CyanotypePrint`, `BlogPrint` and `Portrait`. `seedFrom()` is safe to call on the server.
- Blog: posts are `src/content/blog/<slug>.md` with front matter `title`, `date` (YYYY-MM-DD), `description`, `tags`, `draft`. `src/lib/posts.ts` reads them (files starting with `_` and `draft: true` posts appear only under `npm run dev`); `src/lib/markdown.ts` renders Markdown at build time with marked (GFM, KaTeX math, footnotes, heading ids). Pages: `src/app/blog/page.tsx` (index, grouped by year) and `src/app/blog/[slug]/page.tsx`. With no published posts the `[slug]` route builds a `_placeholder` page that `scripts/postbuild.mjs` deletes.
- Gallery: originals in `src/content/gallery/`; titles, places, dates and order in `src/data/gallery.ts` (`galleryLayout` `"by-year"` or `"all"`, `galleryIntro`, `photos`). `scripts/gallery.mjs` (`predev`, `prebuild --build`, `npm run gallery`) uses sharp to write `<id>.thumb.webp` (≤720 px tall) and `<id>.webp` (≤2400 px) plus `manifest.json` to `public/gallery/`, which is generated and gitignored; it applies EXIF rotation, keeps ICC profiles, strips metadata, and skips unchanged files. `src/lib/gallery.ts` reads the manifest (listed photos first, then unlisted files by name); files starting with `_` are samples shown only under `npm run dev`. `src/app/gallery/page.tsx` renders justified rows (`PhotoGrid`, CSS flex with `--r` = width/height) and the full view (`GalleryViewer`, a `<dialog>` client component; `#<id>` in the address opens a photo). The header shows Gallery only when there is at least one photo.
- `src/components/SiteNav.tsx` builds the header for every page; section links point at the homepage (`/#news` etc.).

## Conventions

- Server components by default. Client components only where the page needs interaction: the prints, the portrait mask, the publications index, the gallery's full view.
- Prussian blue is the only accent colour. Colours come from the CSS variables; don't add new hues.
- One typeface (Newsreader). No all-caps labels.
- External links open in a new tab with `rel="noopener noreferrer"`.
- When adding a paper, check authors, venue and year against the publisher page or arXiv.
