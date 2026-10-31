import type { CSSProperties } from "react";
import { asset } from "@/lib/asset";
import type { GalleryPhoto } from "@/lib/gallery";

/**
 * Photos in justified rows: every photo in a row has the same height and keeps its own
 * shape, and the order reads left to right. Each photo links to its full-size copy; with
 * JavaScript, GalleryViewer opens it in place instead. `start` numbers the photos across groups.
 */
export function PhotoGrid({ photos, start, captions }: { photos: GalleryPhoto[]; start: number; captions: boolean }) {
  return (
    <ul className={captions ? "photo-grid has-captions" : "photo-grid"}>
      {photos.map((p, i) => {
        const index = start + i;
        const thumb = asset(p.thumb.src);
        const full = asset(p.full.src);
        const srcSet = p.thumb.width && p.full.width && p.full.width > p.thumb.width
          ? `${thumb} ${p.thumb.width}w, ${full} ${p.full.width}w`
          : undefined;
        return (
          <li key={p.id} className="photo" id={`photo-${p.id}`} style={{ "--r": p.ratio.toFixed(4) } as CSSProperties}>
            <a href={full} data-photo={index} aria-label={p.title ? `Open “${p.title}”` : `Open photo ${index + 1}`}>
              <img
                src={thumb}
                srcSet={srcSet}
                // shown about 15–21rem tall in a row, full width on phones
                sizes={`(max-width: 40rem) 60vw, ${Math.round(p.ratio * 330)}px`}
                width={p.thumb.width ?? undefined}
                height={p.thumb.height ?? undefined}
                alt={p.alt}
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
              />
            </a>
            {captions && (
              <p className="photo-caption">
                {p.title && <span className="photo-title">{p.title}</span>}
                {p.title && p.place && <span className="sep" aria-hidden="true">·</span>}
                {p.place && <span className="photo-place">{p.place}</span>}
                {p.sample && <span className="draft-tag">Sample</span>}
                {!p.title && !p.place && !p.sample && " "}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
