import { experience } from "@/data/cv";
import { news } from "@/data/news";
import { profile } from "@/data/profile";
import { asset } from "@/lib/asset";
import { getPhotos } from "@/lib/gallery";
import { isAvailable } from "@/lib/public-files";

type Page = "blog" | "gallery";

/**
 * The header on every page. Section links point at the homepage, so they work from the blog too.
 * `current` marks the page being viewed. Gallery appears once there is a photo to show.
 */
export function SiteNav({ current }: { current?: Page }) {
  const home = asset("/");
  const cv = profile.links.find((l) => l.label.toLowerCase() === "cv" && isAvailable(l.href));
  const gallery = current === "gallery" || getPhotos().length > 0;
  const items: { label: string; href: string; key?: Page }[] = [
    { label: "About", href: `${home}#about` },
    ...(news.length ? [{ label: "News", href: `${home}#news` }] : []),
    { label: "Publications", href: `${home}#publications` },
    ...(experience.length ? [{ label: "Experience", href: `${home}#experience` }] : []),
    { label: "Blog", href: asset("/blog/"), key: "blog" as const },
    ...(cv ? [{ label: "CV", href: asset(cv.href) }] : []),
    ...(gallery ? [{ label: "Gallery", href: asset("/gallery/"), key: "gallery" as const }] : []),
  ];

  return (
    <header className="masthead">
      <a className="home" href={home}>{profile.name}</a>
      <nav aria-label="Site">
        {items.map((item) => (
          <a key={item.label} href={item.href} aria-current={item.key && item.key === current ? "page" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
