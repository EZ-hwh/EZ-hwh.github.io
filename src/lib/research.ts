import type { Publication, Topic } from "@/types";

export interface TopicGroup {
  topic: Topic;
  papers: Publication[];
}

/**
 * Groups papers under their directions, in the order of `topics`.
 * Stops the build with a clear message if a paper names a direction that doesn't exist,
 * or if two papers share an id.
 */
export function groupByTopic(topics: Topic[], publications: Publication[]): TopicGroup[] {
  const known = new Set(topics.map((t) => t.id));
  const seen = new Set<string>();
  for (const p of publications) {
    if (!known.has(p.topic)) {
      throw new Error(
        `Paper "${p.title}" has topic "${p.topic}", which is not one of the ids in topics ` +
          `(${[...known].join(", ")}). Check src/data/research.ts.`,
      );
    }
    if (seen.has(p.id)) {
      throw new Error(`Two papers share the id "${p.id}". Each paper needs its own id in src/data/research.ts.`);
    }
    seen.add(p.id);
  }
  return topics
    .map((topic) => ({ topic, papers: publications.filter((p) => p.topic === topic.id) }))
    .filter((g) => g.papers.length > 0);
}

export interface YearGroup {
  year: number;
  papers: Publication[];
}

/** Papers grouped by year, newest year first. Within a year, the order in research.ts is kept. */
export function groupByYear(publications: Publication[]): YearGroup[] {
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
  return years.map((year) => ({ year, papers: publications.filter((p) => p.year === year) }));
}
