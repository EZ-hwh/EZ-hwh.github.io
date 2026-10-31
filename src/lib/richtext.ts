// Tiny markup for text in src/data: **bold**, *italic*, [text](url).
// Square brackets not followed by (url) stay as plain text.

export type RichToken =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "italic"; text: string }
  | { kind: "link"; text: string; href: string };

const PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function parseRichText(input: string): RichToken[] {
  const tokens: RichToken[] = [];
  let last = 0;
  for (const m of input.matchAll(PATTERN)) {
    const at = m.index ?? 0;
    if (at > last) tokens.push({ kind: "text", text: input.slice(last, at) });
    if (m[1] !== undefined) tokens.push({ kind: "link", text: m[1], href: m[2] });
    else if (m[3] !== undefined) tokens.push({ kind: "bold", text: m[3] });
    else tokens.push({ kind: "italic", text: m[4] });
    last = at + m[0].length;
  }
  if (last < input.length) tokens.push({ kind: "text", text: input.slice(last) });
  return tokens;
}
