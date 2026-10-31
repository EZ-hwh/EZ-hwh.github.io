import type { Metadata, Viewport } from "next";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: profile.name,
  description: profile.description,
  openGraph: {
    title: profile.name,
    description: profile.description,
    type: "website",
    url: profile.siteUrl,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F6F4" },
    { media: "(prefers-color-scheme: dark)", color: "#0D2340" },
  ],
};

// Without JavaScript the print can't be drawn: show a plain blue panel with the name instead.
const noScriptCss = `.print{background:#1B4A82}.print-name{opacity:1}.print-caption{display:none}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{noScriptCss}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
