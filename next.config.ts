import type { NextConfig } from "next";

// Static export for GitHub Pages.
// BASE_PATH is set by the deploy workflow: empty for a <username>.github.io repository,
// "/<repo-name>" for any other repository name. You never need to set it by hand.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Hide the Next.js developer-tools badge ("N" button with Route / Preferences) shown during
  // `npm run dev`. It never appears on the published site; build errors still show when they happen.
  devIndicators: false,
};

export default nextConfig;
