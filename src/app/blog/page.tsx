import type { Metadata } from "next";
import { BlogPrint } from "@/components/BlogPrint";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { profile } from "@/data/profile";
import { asset } from "@/lib/asset";
import { formatPostDate, getPosts, type Post } from "@/lib/posts";

export const metadata: Metadata = {
  title: `Blog | ${profile.name}`,
  description: `Writing by ${profile.name}.`,
};

// The blog index: posts grouped by year, newest first.
export default function BlogIndex() {
  const posts = getPosts();
  const years = new Map<string, Post[]>();
  for (const p of posts) {
    const y = p.date.slice(0, 4);
    years.set(y, [...(years.get(y) ?? []), p]);
  }

  return (
    <>
      <a className="skip" href="#posts">Skip to content</a>
      <div className="page">
        <SiteNav current="blog" />
        <BlogPrint text="Blog" />
        <main id="posts" className="blog-index">
          {posts.length === 0 ? (
            <section className="section">
              <h2>Posts</h2>
              <div className="body">
                <p className="muted">Nothing here yet.</p>
              </div>
            </section>
          ) : (
            [...years].map(([year, list]) => (
              <section className="section" key={year} aria-label={`Posts from ${year}`}>
                <h2>{year}</h2>
                <div className="body">
                  <ol className="post-list">
                    {list.map((p) => (
                      <li key={p.slug} className="post-item">
                        <a className="post-link" href={asset(`/blog/${p.slug}/`)}>{p.title}</a>
                        {p.draft && <span className="draft-tag">Draft</span>}
                        {p.description && <p className="post-desc">{p.description}</p>}
                        <p className="post-meta">
                          <time dateTime={p.date}>{formatPostDate(p.date)}</time>
                          <span className="sep" aria-hidden="true" />
                          {p.readingTime} min read
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            ))
          )}
        </main>
        <SiteFooter note="Set in Newsreader." />
      </div>
    </>
  );
}
