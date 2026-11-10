import { publications } from "@/data/research";
import { asset } from "@/lib/asset";
import { hasEqualContribution } from "@/lib/authors";
import { PaperItem } from "./PaperItem";
import { Section } from "./Section";

/**
 * The homepage's publications: the papers marked `selected: true` in src/data/research.ts,
 * in the order they are listed there, with a link to the full list at /publications/.
 * If no paper is marked, every paper is shown.
 */
export function SelectedPapers() {
  if (publications.length === 0) return null;
  const selected = publications.filter((p) => p.selected);
  const all = selected.length === 0 || selected.length === publications.length;
  const papers = all ? publications : selected;
  const equal = hasEqualContribution(papers.map((p) => p.authors));

  return (
    <Section id="publications" title={all ? "Publications" : "Selected publications"}>
      {equal && <p className="pub-legend">* indicates equal contribution</p>}
      <ol className="pubs">
        {papers.map((p) => (
          <PaperItem key={p.id} paper={p} />
        ))}
      </ol>
      {!all && (
        <p className="pub-more">
          <a href={asset("/publications/")}>
            All {publications.length} publications<span className="arrow" aria-hidden="true">→</span>
          </a>
        </p>
      )}
    </Section>
  );
}
