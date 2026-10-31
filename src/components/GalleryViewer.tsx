"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export interface ViewerPhoto {
  id: string;
  src: string;
  width: number | null;
  height: number | null;
  alt: string;
  title?: string;
  /** Place · date · camera, already joined. */
  meta: string;
  caption?: ReactNode;
}

/**
 * The full view. Opens when a photo in a PhotoGrid is clicked (any link with `data-photo`),
 * and from an address like /gallery/#first-snow. Arrow keys or swiping move between photos;
 * Esc, the Close button or a click on the dark surround closes it.
 */
export function GalleryViewer({ photos }: { photos: ViewerPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const n = photos.length;

  const open = useCallback((i: number) => {
    setIndex(i);
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback((by: number) => setIndex((i) => (i === null ? i : (i + by + n) % n)), [n]);

  // Clicks on the grid.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-photo]");
      if (!link) return;
      e.preventDefault();
      open(Number(link.dataset.photo));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  // An address with #<photo id> opens that photo.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const i = photos.findIndex((p) => p.id === id);
      if (i >= 0) open(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [photos, open]);

  // Keep the address in step with the photo shown, and load the neighbours ahead of time.
  useEffect(() => {
    if (index === null) return;
    history.replaceState(null, "", `#${photos[index].id}`);
    for (const k of [index + 1, index - 1]) {
      const p = photos[(k + n) % n];
      if (p) new Image().src = p.src;
    }
  }, [index, photos, n]);

  const onClose = () => {
    const shown = index;
    setIndex(null);
    history.replaceState(null, "", location.pathname + location.search);
    // back to the photo in the grid, which may have scrolled out of view
    if (shown !== null) document.getElementById(`photo-${photos[shown].id}`)?.scrollIntoView({ block: "nearest" });
  };

  const p = index === null ? null : photos[index];

  return (
    <dialog
      ref={dialogRef}
      className="viewer"
      aria-label="Photo viewer"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      }}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t === e.currentTarget || t.classList.contains("viewer-stage")) close();
      }}
      onPointerDown={(e) => { touch.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start || e.pointerType === "mouse") return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
      }}
    >
      {p && (
        <>
          <div className="viewer-bar">
            <span className="viewer-count" aria-live="polite">
              {index! + 1} / {n}
            </span>
            <button type="button" className="viewer-close" onClick={close} autoFocus>
              Close
            </button>
          </div>
          <figure className="viewer-stage">
            <img key={p.id} src={p.src} width={p.width ?? undefined} height={p.height ?? undefined} alt={p.alt} />
          </figure>
          <div className="viewer-foot">
            <button type="button" className="viewer-step" onClick={() => step(-1)} aria-label="Previous photo" disabled={n < 2}>
              ←
            </button>
            <div className="viewer-caption">
              {p.title && <p className="viewer-title">{p.title}</p>}
              {p.meta && <p className="viewer-meta">{p.meta}</p>}
              {p.caption && <p className="viewer-text">{p.caption}</p>}
            </div>
            <button type="button" className="viewer-step" onClick={() => step(1)} aria-label="Next photo" disabled={n < 2}>
              →
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
