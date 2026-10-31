import { rmSync } from "node:fs";

// With no published posts yet, the blog builds one placeholder page (see
// src/app/blog/[slug]/page.tsx) because a static export needs at least one. Remove it here.
rmSync("out/blog/_placeholder", { recursive: true, force: true });
rmSync("out/blog/_placeholder.txt", { force: true });
