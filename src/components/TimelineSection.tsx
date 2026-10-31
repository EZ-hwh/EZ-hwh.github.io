import { asset } from "@/lib/asset";
import { isAvailable } from "@/lib/public-files";
import type { TimelineEntry } from "@/types";
import { RichText } from "./RichText";
import { Section } from "./Section";

const logosOf = (e: TimelineEntry) =>
  (Array.isArray(e.logo) ? e.logo : e.logo ? [e.logo] : []).filter(isAvailable);

/**
 * The heading followed by its institution logos, side by side. The last word of the
 * heading and the logos never break apart, so a logo can't end up alone on a new line.
 */
function HeadingWithLogos({ text, logos }: { text: string; logos: string[] }) {
  if (logos.length === 0) return <RichText text={text} />;
  const icons = (
    <span className="entry-logos" aria-hidden="true">
      {logos.map((src) => (
        <img key={src} src={asset(src)} alt="" loading="lazy" />
      ))}
    </span>
  );
  const cut = text.lastIndexOf(" ");
  const last = text.slice(cut + 1);
  // only split plain words; keep text with markup in its last word whole
  if (cut < 0 || /[*\[\]()]/.test(last)) return <><RichText text={text} />{icons}</>;
  return (
    <>
      <RichText text={text.slice(0, cut + 1)} />
      <span className="nowrap">{last}{icons}</span>
    </>
  );
}

/** A section of dated entries: education, experience, projects, honors. Hidden when empty. */
export function TimelineSection({ id, title, entries }: { id: string; title: string; entries: TimelineEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <Section id={id} title={title}>
      <dl className="dated dated-range">
        {entries.map((e, i) => {
          const logos = logosOf(e);
          return (
            <div className="dated-row" key={i}>
              <dt>{e.period}</dt>
              <dd>
                <span className="entry-heading">
                  <HeadingWithLogos text={e.heading} logos={logos} />
                </span>
                {e.detail && <span className="sub"><RichText text={e.detail} /></span>}
              </dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}

/** Plain lines, one per paragraph. Hidden when empty. */
export function LinesSection({ id, title, lines }: { id: string; title: string; lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <Section id={id} title={title}>
      {lines.map((line, i) => (
        <p key={i}><RichText text={line} /></p>
      ))}
    </Section>
  );
}
