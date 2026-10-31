/**
 * One section of the page: the title in the left margin, content in the text column,
 * and an optional aside on the right (used for the portrait).
 * `margin` adds content under the title that stays in view while scrolling.
 */
export function Section({
  id,
  title,
  margin,
  aside,
  children,
}: {
  id: string;
  title: string;
  margin?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={aside ? "section has-aside" : "section"} id={id}>
      {margin ? (
        <div className="margin">
          <div className="margin-inner">
            <h2>{title}</h2>
            {margin}
          </div>
        </div>
      ) : (
        <h2>{title}</h2>
      )}
      <div className="body">{children}</div>
      {aside}
    </section>
  );
}
