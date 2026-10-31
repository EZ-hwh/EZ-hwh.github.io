import { asset, isExternal } from "@/lib/asset";
import { parseRichText } from "@/lib/richtext";

/** Renders **bold**, *italic* and [text](url) from strings in src/data. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseRichText(text).map((t, i) => {
        switch (t.kind) {
          case "bold":
            return <strong key={i}>{t.text}</strong>;
          case "italic":
            return <em key={i}>{t.text}</em>;
          case "link":
            return <SmartLink key={i} href={t.href}>{t.text}</SmartLink>;
          default:
            return t.text;
        }
      })}
    </>
  );
}

/** A link that handles files in public/ and opens other sites in a new tab. */
export function SmartLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = isExternal(href);
  return (
    <a
      href={asset(href)}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
