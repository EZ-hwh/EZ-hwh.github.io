"use client";

import { useEffect, useState } from "react";

const groupEl = (id: string) => {
  const el = document.getElementById(id);
  return el instanceof HTMLDetailsElement ? el : null;
};

/**
 * The list of research directions under "Publications". Clicking one opens it and
 * scrolls there; the one in view is marked. "Expand all" opens or closes every group.
 */
export function TopicIndex({ items }: { items: { id: string; name: string }[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id)));
        const first = items.find((t) => inView.has(t.id));
        if (first) setCurrent(first.id);
      },
      { rootMargin: "-25% 0px -55% 0px" },
    );
    const groups = items.map((t) => groupEl(t.id)).filter((g): g is HTMLDetailsElement => g !== null);
    const sync = () => setAllOpen(groups.length > 0 && groups.every((g) => g.open));
    groups.forEach((g) => {
      io.observe(g);
      g.addEventListener("toggle", sync);
    });
    sync();
    return () => {
      io.disconnect();
      groups.forEach((g) => g.removeEventListener("toggle", sync));
    };
  }, [items]);

  const setAll = (open: boolean) => items.forEach((t) => { const g = groupEl(t.id); if (g) g.open = open; });

  return (
    <>
      <ul className="toc" aria-label="Research directions">
        {items.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              aria-current={current === t.id ? "true" : undefined}
              onClick={() => { const g = groupEl(t.id); if (g) g.open = true; }}
            >
              {t.name}
            </a>
          </li>
        ))}
      </ul>
      <button type="button" className="toc-toggle" onClick={() => setAll(!allOpen)}>
        {allOpen ? "Collapse all" : "Expand all"}
      </button>
    </>
  );
}
