import type { Metadata } from "next";
import { BlogPrint } from "@/components/BlogPrint";
import { GalleryViewer, type ViewerPhoto } from "@/components/GalleryViewer";
import { PhotoGrid } from "@/components/PhotoGrid";
import { RichText } from "@/components/RichText";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { galleryIntro } from "@/data/gallery";
import { profile } from "@/data/profile";
import { asset } from "@/lib/asset";
import { formatDate } from "@/lib/dates";
import { getPhotos, groupPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: `Gallery | ${profile.name}`,
  description: `Photographs by ${profile.name}.`,
};

// The gallery: photos in justified rows under a heading per year, opening in a full view.
// Content is in src/data/gallery.ts and src/content/gallery/.
export default function Gallery() {
  const groups = groupPhotos(getPhotos());
  const ordered = groups.flatMap((g) => g.photos);
  const captions = ordered.some((p) => p.title || p.place || p.sample);
  const starts = groups.map((_, i) => groups.slice(0, i).reduce((sum, g) => sum + g.photos.length, 0));

  const viewer: ViewerPhoto[] = ordered.map((p) => ({
    id: p.id,
    src: asset(p.full.src),
    width: p.full.width,
    height: p.full.height,
    alt: p.alt,
    title: p.title,
    meta: [p.place, p.date && formatDate(p.date), p.camera].filter(Boolean).join(" · "),
    caption: p.caption ? <RichText text={p.caption} /> : undefined,
  }));

  return (
    <>
      <a className="skip" href="#photos">Skip to content</a>
      <div className="page">
        <SiteNav current="gallery" />
        <BlogPrint text="Gallery" />
        <main id="photos" className="gallery">
          {ordered.length === 0 ? (
            <section className="section">
              <h2>Photographs</h2>
              <div className="body">
                <p className="muted">Nothing here yet.</p>
              </div>
            </section>
          ) : (
            <>
              {galleryIntro && (
                <div className="section gallery-head">
                  <p className="gallery-count">
                    {ordered.length} photograph{ordered.length === 1 ? "" : "s"}
                  </p>
                  <div className="body">
                    <p className="gallery-intro"><RichText text={galleryIntro} /></p>
                  </div>
                </div>
              )}
              {groups.map((g, i) => (
                <section className="section" key={g.label} aria-label={g.label === "Photographs" ? undefined : `Photographs from ${g.label}`}>
                  <h2>{g.label}</h2>
                  <div className="body">
                    <PhotoGrid photos={g.photos} start={starts[i]} captions={captions} />
                  </div>
                </section>
              ))}
              <GalleryViewer photos={viewer} />
            </>
          )}
        </main>
        <SiteFooter note={`Photographs by ${profile.name}. Set in Newsreader.`} />
      </div>
    </>
  );
}
