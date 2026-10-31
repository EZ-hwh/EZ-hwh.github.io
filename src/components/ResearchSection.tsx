import { publications, publicationsLayout, scholarUrl, topics } from "@/data/research";
import { hasEqualContribution } from "@/lib/authors";
import { groupByTopic, groupByYear } from "@/lib/research";
import { PaperItem } from "./PaperItem";
import { SmartLink } from "./RichText";
import { Section } from "./Section";
import { TopicIndex } from "./TopicIndex";

// The layout is chosen in src/data/research.ts (`publicationsLayout`).
export function ResearchSection() {
  const groups = groupByTopic(topics, publications); // also checks every paper's topic and id
  if (groups.length === 0) return null;
  const equal = hasEqualContribution(publications.map((p) => p.authors));
  const byYear = publicationsLayout === "by-year";

  return (
    <Section
      id="publications"
      title="Publications"
      margin={!byYear && groups.length > 1 ? <TopicIndex items={groups.map(({ topic }) => ({ id: topic.id, name: topic.name }))} /> : undefined}
    >
      {/* shown whenever any author is marked with "*" in src/data/research.ts */}
      {equal && <p className="pub-legend">* indicates equal contribution</p>}

      {byYear
        ? groupByYear(publications).map(({ year, papers }) => (
            <div className="pub-year" key={year}>
              <h3>{year}</h3>
              <ol className="pubs">
                {papers.map((p) => (
                  <PaperItem key={p.id} paper={p} />
                ))}
              </ol>
            </div>
          ))
        : groups.map(({ topic, papers }) => (
            // Each direction folds open and closed. <details> works without JavaScript too.
            <details className="pub-group" id={topic.id} key={topic.id} open={topic.expanded || groups.length === 1}>
              <summary>
                <span className="chevron" aria-hidden="true" />
                <h3>{topic.name}</h3>
                <span className="pub-group-count">
                  {papers.length} {papers.length === 1 ? "paper" : "papers"}
                </span>
                {topic.blurb && <span className="pub-group-desc">{topic.blurb}</span>}
              </summary>
              <ol className="pubs">
                {papers.map((p) => (
                  <PaperItem key={p.id} paper={p} />
                ))}
              </ol>
            </details>
          ))}

      {scholarUrl && (
        <p className="note">
          Full list on <SmartLink href={scholarUrl}>Google Scholar</SmartLink>.
        </p>
      )}
    </Section>
  );
}
