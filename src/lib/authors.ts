export interface AuthorView {
  name: string;
  equal: boolean;
  isMe: boolean;
}

/** Splits "Name*" into a name and an equal-contribution flag, and marks your own name. */
export function viewAuthors(authors: string[], me: string): AuthorView[] {
  const mine = normalize(me);
  return authors.map((raw) => {
    const equal = raw.trim().endsWith("*");
    const name = raw.trim().replace(/\*+$/, "").trim();
    return { name, equal, isMe: normalize(name) === mine };
  });
}

export function hasEqualContribution(authorLists: string[][]): boolean {
  return authorLists.some((list) => list.some((a) => a.trim().endsWith("*")));
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}
