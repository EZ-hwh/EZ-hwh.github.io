import type { Profile } from "@/types";

// Your name, About text and links.
// Text supports **bold**, *italic* and [link text](https://…).

export const profile: Profile = {
  name: "Wenhao Huang",
  description:
    "Wenhao Huang is a Ph.D. student at Mila and Université de Montréal working on LLM agents: agent memory, agent operating systems and efficient large language models.",
  siteUrl: "https://ez-hwh.github.io",

  // Put a photo in public/ and give its path here. If the file isn't there, no photo is shown.
  // Shown in its original colours with a brushed edge; a 4:5 crop works best.
  portrait: "/portrait.jpg",

  lede:
    "I’m a second year Ph.D. student in Computer Science at [Mila](https://mila.quebec/en) and [Université de Montréal](https://www.umontreal.ca/en/), advised by [Prof. Bang Liu](https://www-labs.iro.umontreal.ca/~liubang/). My research interests are agent memory, agent operating systems and efficient large language models.",

  bio: [
    "Before Mila, I received my M.Sc. and B.Sc. (Honor Class) in Computer Science from Fudan University, where I worked with [Prof. Yanghua Xiao](http://kw.fudan.edu.cn/people/xiaoyanghua/) on knowledge graphs, complex information extraction and web agents. ",
    "If you’d like to talk about research or a collaboration, feel free to [email me](mailto:huang.wenhao@mila.quebec).",
  ],

  // Links to files in public/ (like the CV) only appear once the file is there.
  links: [
    { label: "Email", href: "mailto:huang.wenhao@mila.quebec" },
    { label: "GitHub", href: "https://github.com/EZ-hwh" },
    { label: "CV", href: "/Harry_CV.pdf" },
  ],
};
