import { news } from "@/data/news";
import { formatMonth } from "@/lib/dates";
import { RichText } from "./RichText";
import { Section } from "./Section";

export function NewsSection() {
  if (news.length === 0) return null;
  return (
    <Section id="news" title="News">
      <dl className="dated">
        {news.map((item, i) => (
          <div className="dated-row" key={i}>
            <dt><time dateTime={item.date}>{formatMonth(item.date)}</time></dt>
            <dd><RichText text={item.text} /></dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
