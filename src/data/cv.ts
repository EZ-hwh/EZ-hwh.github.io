import type { TimelineEntry } from "@/types";

// Each list is one section on the page, newest first.
// period: e.g. "Sep 2021 – Jun 2024", "Sep 2025 – present". detail: optional second line in grey.
// Text supports **bold**, *italic* and [link text](https://…).
// logo (optional): institution logo file(s) in public/logos/. Give a list for joint
// affiliations. A logo only appears once its file exists, so you can add them later.
// Set a list to [] to hide its section.

export const education: TimelineEntry[] = [
  {
    period: "Sep 2025 – present",
    heading: "Ph.D. in Computer Science, Mila and Université de Montréal",
    logo: ["/logos/mila.png", "/logos/udem.png"],
    // detail: "Advised by [Prof. Bang Liu](https://www-labs.iro.umontreal.ca/~liubang/). Research interests: agent memory, agent operating systems and efficient LLMs",
  },
  {
    period: "Sep 2021 – Jun 2024",
    heading: "M.Sc. in Computer Science, Fudan University",
    logo: "/logos/fudan.png",
    // detail:
    //   "Advised by [Prof. Yanghua Xiao](http://kw.fudan.edu.cn/people/xiaoyanghua/). Research interests: knowledge graphs, complex information extraction and web agents. Thesis: *Research on High-Efficiency and Performance Information Extraction Driven by Large Language Models*",
  },
  {
    period: "Sep 2017 – Jul 2021",
    heading: "B.Sc. in Computer Science (Honor Class), Fudan University",
    logo: "/logos/fudan.png",
    // detail:
    //   "Advised by [Prof. Yanghua Xiao](http://kw.fudan.edu.cn/people/xiaoyanghua/). Thesis: *Large-scale Pre-training Language Model and Web Extraction under Semi-structure Enhancement*",
  },
];

export const experience: TimelineEntry[] = [
  {
    period: "Jul 2024 – Jun 2025",
    heading: "Research intern, Institute for AI Industry Research (AIR), Tsinghua University",
    logo: "/logos/air.png",
    detail: "Enzyme design and protein language models. Mentor: [Prof. Hao Zhou](https://zhouh.github.io/)",
  },
  {
    period: "Dec 2023 – Jun 2024",
    heading: "Research intern, Microsoft Research Asia",
    logo: "/logos/microsoft.png",
    detail: "Retrieval-augmented generation with large language models. Mentor: [Dr. Kaitao Song](https://stillkeeptry.github.io/)",
  },
  {
    period: "May 2020 – Mar 2021",
    heading: "Intern, ByteDance AI Lab (MLNLC)",
    logo: "/logos/bytedance.png",
    detail: "Business knowledge graph augmentation and language model training. Mentors: [Prof. Lei Li](https://www.cs.cmu.edu/~leili/) and Yuwen Wu",
  },
];

// Not in the current CV, so hidden. Add entries in the same format as above to show them.
export const projects: TimelineEntry[] = [];

export const honors: TimelineEntry[] = [];

// One line each, e.g. "Teaching assistant for …" or "Reviewer for …". [] hides the section.
export const teachingAndService: string[] = [
  "Conference reviewer for ARR, NeurIPS, ICLR, KDD.",
  "TA for \"Algebraic Structures and Mathematical Logic\" (Fudan University, 2022).",
];
