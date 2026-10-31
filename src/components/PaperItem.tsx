import { profile } from "@/data/profile";
import { viewAuthors } from "@/lib/authors";
import type { Publication, PublicationLinks } from "@/types";
import { SmartLink } from "./RichText";

const LINK_LABELS: Record<keyof PublicationLinks, string> = {
  paper: "Paper",
  pdf: "PDF",
  arxiv: "arXiv",
  code: "Code",
  project: "Project page",
  slides: "Slides",
  video: "Video",
};

export function PaperItem({ paper }: { paper: Publication }) {
  const authors = viewAuthors(paper.authors, profile.name);
  const links = (Object.keys(LINK_LABELS) as (keyof PublicationLinks)[])
    .filter((k) => paper.links[k])
    .map((k) => ({ label: LINK_LABELS[k], href: paper.links[k]! }));

  return (
    <li className="pub">
      <p className="pub-title">{paper.title}</p>
      <p className="pub-authors">
        {authors.map((a, i) => (
          <span key={i}>
            {i > 0 && ", "}
            {a.isMe ? <span className="me">{a.name}</span> : a.name}
            {a.equal && "*"}
          </span>
        ))}
      </p>
      <p className="pub-venue">
        {paper.venue} {paper.year}
        {paper.venueNote && `, ${paper.venueNote}`}
      </p>
      {links.length > 0 && (
        <div className="pub-links">
          {links.map((l) => (
            <SmartLink key={l.label} href={l.href}>{l.label}</SmartLink>
          ))}
        </div>
      )}
    </li>
  );
}
