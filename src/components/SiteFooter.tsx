import { profile } from "@/data/profile";

export function SiteFooter({ note = "Set in Newsreader. The print at the top is drawn fresh in your browser each visit." }: { note?: string }) {
  // The date of the last build, so it updates itself every time you push.
  const updated = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return (
    <footer className="colophon">
      <p>{profile.name}, {new Date().getFullYear()}. Last updated {updated}.</p>
      <p>{note}</p>
    </footer>
  );
}
