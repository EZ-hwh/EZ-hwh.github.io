# Wenhao Huang — homepage

Source for my personal academic website. It is a statically exported [Next.js](https://nextjs.org) site; `.github/workflows/deploy.yml` builds it and publishes it to GitHub Pages on every push to `master` (or `main`).

## Editing content

All content lives in `src/data/`. You normally never need to touch anything else.

| What | File |
| --- | --- |
| Name, About text, links, photo | `src/data/profile.ts` |
| News | `src/data/news.ts` |
| Research directions and publications | `src/data/research.ts` |
| Education, experience, projects, honors, teaching & service | `src/data/cv.ts` |
| CV, photo and other files | `public/` (e.g. `public/Harry_CV.pdf` is linked as `/Harry_CV.pdf`) |
| Colours and type | `src/app/globals.css` (variables at the top) |
| Order of sections on the page | `src/app/page.tsx` |
| Blog posts | `src/content/blog/*.md` (see below) |
| Gallery photos | `src/content/gallery/` (photos) and `src/data/gallery.ts` (titles, places, dates, order) |

Text fields support `**bold**`, `*italic*` and `[link text](https://…)`.

### Add a paper

Copy one `{ … }` block in `publications` in `src/data/research.ts` and fill it in:

```ts
{
  id: "huang2027example",          // unique name for the paper
  title: "Paper title",
  authors: ["Wenhao Huang*", "Co-author*", "Advisor"],  // * = equal contribution
  venue: "NeurIPS",
  year: 2027,
  venueNote: "spotlight",          // optional
  type: "conference",              // conference | journal | workshop | preprint
  topic: "llm-agents",             // an id from `topics` above
  selected: true,                  // optional: also show it on the homepage
  links: { arxiv: "https://…", code: "https://…" },  // paper, pdf, arxiv, code, project, slides, video
},
```

Your own name is set in bold automatically, and the equal-contribution note appears when needed.

### Order and layout of publications

The homepage shows only the papers marked `selected: true`, under "Selected publications", in the order they appear in `research.ts`. Add or remove that line on a paper to change the selection. The Publications page (`/publications/`, linked in the header) lists every paper.

On the Publications page, papers are listed newest first, under a heading for each year. Within a year they appear in the order of `publications` in `src/data/research.ts`, so put a new paper at the top of its year.

To group papers by research direction instead, set `publicationsLayout = "by-topic"` at the top of `research.ts`. Directions then appear in the order of `topics` and start collapsed (add `expanded: true` to show one open). Every paper's `topic` must be an id from `topics`; otherwise the build stops and says which paper to fix.

### Photo and CV

- Save a photo as `public/portrait.jpg` (a 4:5 crop works best). It is shown in its original colours with a brushed edge.
- The CV link points to `public/Harry_CV.pdf`. To use a new file, put it in `public/` and change the `CV` link in `profile.ts`.
- Institution logos for Education go in `public/logos/`: `mila.png`, `udem.png` and `fudan.png` (any image format works; change the paths in `cv.ts` to match). Square images with a transparent or white background look best. Any entry in `cv.ts` can take a `logo`, including Experience.
- Links to files in `public/` only appear when the file exists, so a missing photo or CV never shows up as a broken link.

## Writing a blog post

Posts are Markdown files in `src/content/blog/`. The file name is the address: `src/content/blog/my-first-post.md` appears at `/blog/my-first-post/`.

1. Copy `src/content/blog/_template.md` to a new file in the same folder, e.g. `my-first-post.md` (lowercase words joined by hyphens).
2. Fill in the front matter at the top: `title`, `date` (YYYY-MM-DD), `description` (one sentence, shown in the list and in link previews) and optional `tags`.
3. Replace the body with your writing. The template shows everything that's supported: headings, lists, quotes, links, `$math$` and `$$display math$$`, code blocks, figures with captions, tables and footnotes.
4. Preview with `npm run dev` at http://localhost:3000/blog/. Drafts and the template show up there, marked "Draft".
5. To publish, delete the `draft: true` line and push.

Images for a post go in `public/blog/<post-name>/` and are written as `/blog/<post-name>/figure.png`. Files starting with `_` (like the template) are never published. Each post gets its own cyanotype print at the top, always the same for that post.

## Adding photos to the Gallery

1. Put the photos in `src/content/gallery/` (JPEG, PNG, WebP or AVIF; give them short names such as `first-snow.jpg`). iPhone HEIC files need to be exported as JPEG first.
2. Optionally list them in `src/data/gallery.ts` to add a title, place, date (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`), camera and a caption, and to set the order (newest first). Photos you don't list still appear, after the listed ones.
3. Push. The site makes web-sized copies by itself (a small one for the grid, a large one for the full view), keeps the colours, applies the camera's rotation, and leaves out camera data such as GPS location.

Photos are grouped under a heading per year; set `galleryLayout = "all"` in `gallery.ts` for one continuous grid. Clicking a photo opens it full screen (arrow keys or swipe to move, Esc to close), and the address changes to `/gallery/#first-snow` so a single photo can be linked.

The six cyanotype prints in `src/content/gallery/` (files starting with `_`) are samples: they show only in the local preview, never on the published site. Delete them, and their lines in `gallery.ts`, once you have your own. The Gallery link in the header appears as soon as there is at least one real photo.

Any photo size works, but exporting at about 3000 px on the long side keeps the repository small.

## Publishing

One-time setup:

1. Create a GitHub repository. Naming it `<your-username>.github.io` gives the address `https://<your-username>.github.io`; any other name gives `https://<your-username>.github.io/<repo-name>`. Both work without changes.
2. Push this folder to the `master` (or `main`) branch.
3. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.

After that, every push rebuilds and publishes the site in a minute or two. Progress shows under the **Actions** tab; if a build fails, the log there says why.

## Previewing locally (optional)

Requires [Node.js](https://nodejs.org) 20.9 or newer.

```bash
npm install
npm run dev       # live preview at http://localhost:3000, updates as you edit
npm run gallery   # after adding photos while the preview is running; then refresh
npm run build     # static export into out/
npm run preview   # serve out/ at http://localhost:4173
```

## Structure

```
.github/workflows/deploy.yml   build and publish to GitHub Pages
public/                        files served as-is (Harry_CV.pdf, portrait.jpg, blog images)
scripts/gallery.mjs            makes the web-sized gallery photos (runs before dev and build)
scripts/postbuild.mjs          tidies the build output
src/
  data/                        ← content: edit these
  content/blog/                ← blog posts (Markdown), plus _template.md
  content/gallery/             ← gallery photos, plus _sample prints
  app/                         pages (home, publications, blog, gallery), styles, fonts, favicon
  components/                  one component per part of the page
  lib/                         helpers (the generative print, Markdown, posts)
  types/                       shapes of the data
```

The print at the top is a generative cyanotype drawn in the browser (`src/lib/cyanotype.ts`). Each visit develops a new one; add `?print=1234` to the address to show a specific print.

Newsreader is by Production Type, used under the SIL Open Font License (`src/app/fonts/OFL.txt`).
