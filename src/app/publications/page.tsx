import type { Metadata } from "next";
import { BlogPrint } from "@/components/BlogPrint";
import { PaperItem } from "@/components/PaperItem";
import { SmartLink } from "@/components/RichText";
import { Section } from "@/components/Section";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { TopicIndex } from "@/components/TopicIndex";
import { profile } from "@/data/profile";
import { publications, publicationsLayout, scholarUrl, topics } from "@/data/research";
import { hasEqualContribution } from "@/lib/authors";
import { groupByTopic, groupByYear } from "@/lib/research";

export const metadata: Metadata = {
  title: `Publications | ${profile.name}`,
  description: `Papers by ${profile.name}.`,
};

// Every paper in src/data/research.ts. The layout is chosen there (`publicationsLayout`):
// a section per year, or research directions that fold open.
export default function Publications() {
  const groups = groupByTopic(topics, publications); // also checks every paper's topic and id
  const equal = hasEqualContribution(publications.map((p) => p.authors));
  const byYear = publicationsLayout === "by-year";
  const scholar = scholarUrl && (
    <p className="note">
      Also on <SmartLink href={scholarUrl}>Google Scholar</SmartLink>.
    </p>
  );

  return (
    <>
      <a className="skip" href="#papers">Skip to content</a>
      <div className="page">
        <SiteNav current="publications" />
        <BlogPrint text="Publications" />
        <main id="papers">
          {publications.length === 0 ? (
            <section className="section">
              <h2>Papers</h2>
              <div className="body">
                <p className="muted">Nothing here yet.</p>
              </div>
            </section>
          ) : byYear ? (
            <>
              <div className="section pubs-head">
                <p className="pubs-count">
                  {publications.length} paper{publications.length === 1 ? "" : "s"}
                </p>
                <div className="body">
                  {/* shown whenever any author is marked with "*" in src/data/research.ts */}
                  {equal && <p className="pub-legend">* indicates equal contribution</p>}
                  {scholar}
                </div>
              </div>
              {groupByYear(publications).map(({ year, papers }) => (
                <section className="section" key={year} aria-label={`Papers from ${year}`}>
                  <h2>{year}</h2>
                  <div className="body">
                    <ol className="pubs">
                      {papers.map((p) => (
                        <PaperItem key={p.id} paper={p} />
                      ))}
                    </ol>
                  </div>
                </section>
              ))}
            </>
          ) : (
            <Section
              id="directions"
              title="By direction"
              margin={groups.length > 1 ? <TopicIndex items={groups.map(({ topic }) => ({ id: topic.id, name: topic.name }))} /> : undefined}
            >
              {equal && <p className="pub-legend">* indicates equal contribution</p>}
              {groups.map(({ topic, papers }) => (
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
              {scholar}
            </Section>
          )}
        </main>
        <SiteFooter note="Set in Newsreader." />
      </div>
    </>
  );
}
