import type { Photo } from "@/types";

// The Gallery page (/gallery/).
//
// 1. Put your photos in src/content/gallery/ (JPEG, PNG, WebP or AVIF). Any size works; the
//    site makes web-sized copies by itself and leaves out camera data such as GPS location.
// 2. List them below to give each a title, place and date. The order here is the order on
//    the page, so keep the newest first. Photos in the folder that aren't listed still
//    appear, after the listed ones.
//
// Only `file` is required; leave out anything you don't want to show.

/** "by-year": a heading for each year, taken from `date`. "all": one continuous grid. */
export const galleryLayout: "by-year" | "all" = "by-year";

/** A line above the photos. Supports **bold**, *italic* and [text](url). Leave "" for none. */
export const galleryIntro = "Notes in light, taken between deadlines.";

export const photos: Photo[] = [
  // {
  //   file: "first-snow.jpg",          // a file in src/content/gallery/
  //   title: "First snow",
  //   place: "Montréal",
  //   date: "2025-11",                 // YYYY, YYYY-MM or YYYY-MM-DD
  //   camera: "Fujifilm X100V",        // optional, shown in the full view
  //   caption: "Optional note shown in the full view.",
  // },

  // Samples: shown only on your computer (npm run dev), never on the published site.
  // Delete these lines and the _sample files in src/content/gallery/ once you've added your own.
  { file: "Istanbul_2.jpg", title: "Istanbul · The Bosporus Strait", date: "2026-07", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "Galata.jpg", title: "Istanbul · Galata Tower", date: "2026-07", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "cappadocia.jpg", title: "Cappadocia", date: "2026-07", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "D400.jpg", title: "D400", date: "2026-07", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "D400_1.jpg", title: "D400 · Kaputaş Beach", date: "2026-07", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "Nara.jpg", title: "Nara · Nara Park", date: "2025-06", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "舞子大桥.jpg", title: "Kobe · Wazuka Bridge", date: "2025-06", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "kobe.jpg", title: "Kobe · Kobe Port", date: "2025-06", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "Miami_beach.jpg", title: "Miami · Miami Beach", date: "2024-12", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "Miami_beach_1.jpg", title: "Miami · Miami Beach", date: "2024-12", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "MTL_0.jpg", title: "Montréal · Le Plateau-Mont-Royal", date: "2026-02", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "MTL_2.jpg", title: "Montréal · Le Plateau-Mont-Royal", date: "2026-02", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "MTL_1.jpg", title: "Montréal · Mount Royal", date: "2025-10", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "Disney.jpg", title: "上海 · 迪士尼", date: "2022-10", camera: "Sony A6000 with Sigma 56mm f/1.4" },
  { file: "湛江.jpg", title: "湛江 · 湛江港", date: "2023-08", camera: "Sony A6000 with Sigma 56mm f/1.4" },
  { file: "Quebec_city.jpg", title: "Québec City · Old Québec", date: "2025-12", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "Quebec_city_1.jpg", title: "Québec City · Old Québec", date: "2025-12", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "吴淞.jpg", title: "上海 · 吴淞炮台", date: "2023-05", camera: "Sony A6000 with Tamron 17-70mm f/2.8-4" },
  { file: "常熟.jpg", title: "常熟 · 常熟古城", date: "2023-03", camera: "Sony A6000 with Tamron 17-70mm f/2.8-4" },
  { file: "泰州.jpg", title: "泰州 · 溱湖国家湿地公园", date: "2023-04", camera: "Sony A6000 with Tamron 17-70mm f/2.8-4" },
  { file: "颐和园.jpeg", title: "北京 · 颐和园", date: "2024-11", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "流花湖.jpeg", title: "广州 · 流花湖", date: "2025-01", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
  { file: "先农坛.jpeg", title: "北京 · 先农坛", date: "2025-05", camera: "Sony A7C2 with Tamron 28-200mm f/2.8-5.6" },
];
