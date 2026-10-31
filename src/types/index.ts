// Shapes of the content in src/data. You don't need to edit this file to change content.

export interface Link {
  label: string;
  /** Full URL, "mailto:…", or a file in public/ such as "/cv.pdf". */
  href: string;
}

export interface Profile {
  name: string;
  /** One line, used in the page description for search engines and link previews. */
  description: string;
  /** Your site's address, no trailing slash. */
  siteUrl: string;
  /** A file in public/, e.g. "/portrait.jpg". Leave empty ("") for no photo. */
  portrait: string;
  /** The large first paragraph of About. Supports **bold**, *italic* and [text](url). */
  lede: string;
  /** Further paragraphs, same markup. */
  bio: string[];
  links: Link[];
}

export interface NewsItem {
  /** "YYYY-MM", shown as e.g. "Oct 2026". */
  date: string;
  /** Supports **bold**, *italic* and [text](url). */
  text: string;
}

export interface Topic {
  /** Short code that papers refer to, e.g. "robot-learning". Lowercase, hyphens, no spaces. */
  id: string;
  name: string;
  /** One sentence shown under the heading. */
  blurb: string;
  /** Directions start collapsed; set to true to show this one open when the page loads. */
  expanded?: boolean;
}

export type PublicationType = "conference" | "journal" | "workshop" | "preprint";

export interface PublicationLinks {
  /** The publisher's page, e.g. ACL Anthology or ACM Digital Library. */
  paper?: string;
  pdf?: string;
  arxiv?: string;
  code?: string;
  project?: string;
  slides?: string;
  video?: string;
}

export interface Publication {
  /** Unique name for the paper, e.g. "huang2026title". */
  id: string;
  title: string;
  /** Full author list in paper order. Add "*" after a name for equal contribution. */
  authors: string[];
  /** Venue without the year, e.g. "NeurIPS", "Nature Communications", "arXiv preprint". */
  venue: string;
  year: number;
  /** Extra text after the venue, e.g. "oral presentation". */
  venueNote?: string;
  type: PublicationType;
  /** The id of one entry in `topics`. */
  topic: string;
  links: PublicationLinks;
}

export interface TimelineEntry {
  /** e.g. "2022–2026", "2026–now". */
  period: string;
  heading: string;
  /** Optional second line in grey. */
  detail?: string;
  /**
   * Optional institution logo(s), files in public/, e.g. "/logos/fudan.png".
   * Shown right after the heading; give a list for joint affiliations and they sit
   * side by side. Missing files are simply not shown.
   */
  logo?: string | string[];
}

export interface Photo {
  /** File name in src/content/gallery/, e.g. "first-snow.jpg". */
  file: string;
  title?: string;
  /** Where it was taken, e.g. "Montréal". */
  place?: string;
  /** "YYYY", "YYYY-MM" or "YYYY-MM-DD". Photos are grouped by this year. */
  date?: string;
  /** Camera, lens or film, shown in the full view. */
  camera?: string;
  /** A sentence or two shown in the full view. Supports **bold**, *italic* and [text](url). */
  caption?: string;
  /** What the photo shows, for screen readers. Defaults to the title. */
  alt?: string;
}
