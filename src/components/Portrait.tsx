"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { brushedMask } from "@/lib/cyanotype";

/** The photo in its original colours, framed with a brushed edge. Hides itself if the file is missing. */
export function Portrait({ src, alt }: { src: string; alt: string }) {
  const figRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  useEffect(() => {
    const fig = figRef.current;
    if (!fig || missing) return;
    const apply = () => {
      const r = fig.getBoundingClientRect();
      if (r.width < 10) return;
      const url = `url(${brushedMask(r.width, r.height)})`;
      fig.style.maskImage = url;
      fig.style.setProperty("-webkit-mask-image", url);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(fig);
    return () => ro.disconnect();
  }, [missing]);

  if (missing) return null;
  return (
    <figure ref={figRef} className="portrait">
      <img ref={imgRef} src={asset(src)} alt={alt} width={480} height={600} onError={() => setMissing(true)} />
    </figure>
  );
}
