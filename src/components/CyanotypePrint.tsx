"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { developPrint } from "@/lib/cyanotype";

const newSeed = () => 1 + Math.floor(Math.random() * 9999);

/**
 * The print at the top of the page. A new one develops on every visit;
 * ?print=1234 in the address shows a specific one.
 */
export function CyanotypePrint({ name }: { name: string }) {
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const stopRef = useRef<() => void>(() => {});
  const seedRef = useRef(0);
  const [seed, setSeed] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  const draw = useCallback((s: number, animate: boolean) => {
    const figure = figureRef.current, canvas = canvasRef.current, nameEl = nameRef.current;
    if (!figure || !canvas || !nameEl) return;
    stopRef.current();
    seedRef.current = s;
    setSeed(s);
    setBusy(animate);
    stopRef.current = developPrint({ figure, canvas, nameEl }, s, animate, () => setBusy(false));
    setReady(true);
  }, []);

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const fromURL = parseInt(new URLSearchParams(window.location.search).get("print") ?? "", 10);
    const first = Number.isFinite(fromURL) && fromURL > 0 ? fromURL : newSeed();
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) draw(first, !reduceMotion());
    });

    // redraw (without animation) when the width changes
    let lastW = 0;
    let timer = 0;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (!lastW) { lastW = w; return; }
      if (Math.abs(w - lastW) < 2) return;
      lastW = w;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => draw(seedRef.current, false), 150);
    });
    if (figureRef.current) ro.observe(figureRef.current);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.clearTimeout(timer);
      stopRef.current();
    };
  }, [draw]);

  const [first, ...rest] = name.split(" ");

  return (
    <>
      <figure ref={figureRef} className={`print${ready ? " is-ready" : ""}`}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <h1 ref={nameRef} className="print-name">
          <span>{first}</span>
          {rest.length > 0 && <> <span>{rest.join(" ")}</span></>}
        </h1>
      </figure>
      <div className="print-caption">
        <p aria-live="polite">
          Print no. <span className="print-number">{seed === null ? "····" : String(seed).padStart(4, "0")}</span>.
          Streamlines of a noise field, developed in Prussian blue for this visit.
        </p>
        <button type="button" disabled={busy} onClick={() => draw(newSeed(), !reduceMotion())}>
          Develop another
        </button>
      </div>
    </>
  );
}
