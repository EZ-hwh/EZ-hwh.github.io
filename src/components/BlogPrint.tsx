"use client";

import { useEffect, useRef, useState } from "react";
import { developPrint } from "@/lib/cyanotype";

/**
 * A slim cyanotype strip for the blog. With `text`, the text is stencilled on the print
 * (used for the "Blog" heading); with `seed`, the print is the same on every visit.
 */
export function BlogPrint({ text, seed, animate = true }: { text?: string; seed?: number; animate?: boolean }) {
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const figure = figureRef.current, canvas = canvasRef.current, nameEl = textRef.current;
    if (!figure || !canvas || !nameEl) return;
    const s = seed ?? 1 + Math.floor(Math.random() * 9999);
    const still = !animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stop = () => {};
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      stop = developPrint({ figure, canvas, nameEl }, s, !still);
      setReady(true);
    });
    let lastW = 0, timer = 0;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (!lastW) { lastW = w; return; }
      if (Math.abs(w - lastW) < 2) return;
      lastW = w;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { stop(); stop = developPrint({ figure, canvas, nameEl }, s, false); }, 150);
    });
    ro.observe(figure);
    return () => { cancelled = true; ro.disconnect(); window.clearTimeout(timer); stop(); };
  }, [seed, animate]);

  return (
    <figure ref={figureRef} className={`print print-slim${ready ? " is-ready" : ""}`}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {text ? (
        <h1 ref={textRef} className="print-name"><span>{text}</span></h1>
      ) : (
        <span ref={textRef} className="print-name" aria-hidden="true" />
      )}
    </figure>
  );
}
