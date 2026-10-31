import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPrint } from "@/components/BlogPrint";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { profile } from "@/data/profile";
import { asset } from "@/lib/asset";
import { seedFrom } from "@/lib/cyanotype";
import { renderMarkdown } from "@/lib/markdown";
import { formatPostDate, getPost, getPosts } from "@/lib/posts";

// A static export needs at least one page per dynamic route. With no posts yet, a placeholder
// page is generated and then removed by scripts/postbuild.mjs.
const PLACEHOLDER = "_placeholder";
export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | ${profile.name}`,
    description: post.description || undefined,
    openGraph: { title: post.title, description: post.description || undefined, type: "article", publishedTime: post.date },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const html = renderMarkdown(post.content);

  return (
    <>
      <a className="skip" href="#post">Skip to content</a>
      <div className="page">
        <SiteNav current="blog" />
        <BlogPrint seed={seedFrom(post.slug)} animate={false} />
        <main id="post">
          <article className="section post">
            <div className="margin">
              <div className="margin-inner post-aside">
                <p><time dateTime={post.date}>{formatPostDate(post.date)}</time></p>
                <p>{post.readingTime} min read</p>
                {post.tags.length > 0 && (
                  <ul className="post-tags" aria-label="Tags">
                    {post.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
                <p className="post-back"><a href={asset("/blog/")}>All posts</a></p>
              </div>
            </div>
            <div className="body">
              <header className="post-header">
                {post.draft && <span className="draft-tag">Draft, only visible while previewing</span>}
                <h1 className="post-title">{post.title}</h1>
                {post.description && <p className="post-lede">{post.description}</p>}
              </header>
              <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </article>
        </main>
        <SiteFooter note="Set in Newsreader." />
      </div>
    </>
  );
}
