import type { Publication, Topic } from "@/types";

// ---------------------------------------------------------------------------
// How the Publications section is laid out:
//   "by-year"  – one list, newest first, with a heading for each year
//   "by-topic" – grouped under the research directions below, each folding open
// ---------------------------------------------------------------------------

export const publicationsLayout: "by-year" | "by-topic" = "by-year";

// ---------------------------------------------------------------------------
// Research directions
// Used by the "by-topic" layout, in this order. Each paper names one of these ids as its `topic`.
// Directions start collapsed (visitors click to open them); add `expanded: true`
// to a direction to show it open when the page loads.
// ---------------------------------------------------------------------------

export const topics: Topic[] = [
  {
    id: "llm-agents",
    name: "LLM agents",
    blurb: "Agents built on large language models: making them efficient at inference time, and letting them understand and act on real websites.",
  },
  {
    id: "llm-evaluation",
    name: "LLM evaluation",
    blurb: "Benchmarks for domain knowledge, complex real-world instructions and reasoning over implicit evidence.",
  },
  {
    id: "information-extraction",
    name: "Information extraction",
    blurb: "Extracting entities, relations and knowledge from text and semi-structured web pages, and what large language models need to do it reliably.",
  },
  {
    id: "other",
    name: "Other",
    blurb: "Mostly AI for science: agents for materials science and generative models for protein design.",
  },
];

// ---------------------------------------------------------------------------
// Publications
// Listed newest first. Papers appear in this order within each year (or direction).
// "*" after an author's name marks equal contribution; the footnote appears automatically.
// Your own name (from profile.ts) is set in bold automatically.
// type: "conference" | "journal" | "workshop" | "preprint"
// links (all optional): paper (publisher page), pdf, arxiv, code, project, slides, video
// ---------------------------------------------------------------------------

export const publications: Publication[] = [
  // 2026
  {
    id: "huang2026latent",
    title: "Latent Action Reparameterization for Efficient Agent Inference",
    authors: [
      "Wenhao Huang", "Qingwen Zeng", "Qiyue Chen", "Zijie Guo", "Yu Sun", "Cheng Yang", "Siru Ouyang",
      "Jiri Gesi", "Fang Wu", "Jiayi Zhang", "Huaming Chen", "Bang Liu", "Xiangru Tang", "Chenglin Wu",
    ],
    venue: "NeurIPS",
    year: 2026,
    venueNote: "also at the ICLR 2026 Workshop on Memory for LLM-Based Agentic Systems",
    type: "conference",
    topic: "llm-agents",
    links: {
      arxiv: "https://arxiv.org/abs/2605.18597",
    },
  },
  {
    id: "zhang2026materials",
    title: "Towards Agentic Intelligence for Materials Science",
    authors: [
      "Huan Zhang*", "Yizhan Li*", "Wenhao Huang*", "Ziyu Hou", "Yu Song", "Xuye Liu", "Farshid Effaty",
      "Jinya Jiang", "Sifan Wu", "Qianggang Ding", "Izumi Takahara", "Leonard R. MacGillivray",
      "Teruyasu Mizoguchi", "Tianshu Yu", "Lizi Liao", "Yuyu Luo", "Yu Rong", "Jia Li", "Ying Diao",
      "Heng Ji", "Bang Liu",
    ],
    venue: "arXiv preprint",
    year: 2026,
    type: "preprint",
    topic: "other",
    links: {
      arxiv: "https://arxiv.org/abs/2602.00169",
    },
  },

  // 2025
  {
    id: "gong2025steering",
    title: "Steering Protein Family Design through Profile Bayesian Flow",
    authors: [
      "Jingjing Gong", "Yu Pei", "Siyu Long", "Yuxuan Song",
      "Zhe Zhang", "Wenhao Huang", "Hao Zhou", "Wei-Ying Ma",
    ],
    venue: "ICLR",
    year: 2025,
    type: "conference",
    topic: "other",
    links: {
      arxiv: "https://arxiv.org/abs/2502.07671",
    },
  },

  // 2024
  {
    id: "huang2024autoscraper",
    title: "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation",
    authors: [
      "Wenhao Huang", "Zhouhong Gu", "Chenghao Peng", "Zhixu Li",
      "Jiaqing Liang", "Yanghua Xiao", "Liqian Wen", "Zulong Chen",
    ],
    venue: "EMNLP",
    year: 2024,
    type: "conference",
    topic: "llm-agents",
    links: {
      arxiv: "https://arxiv.org/abs/2404.12753",
      code: "https://github.com/EZ-hwh/AutoScraper",
    },
  },
  {
    id: "huang2024definition",
    title: "Is There a One-Model-Fits-All Approach to Information Extraction? Revisiting Task Definition Biases",
    authors: ["Wenhao Huang", "Qianyu He", "Zhixu Li", "Jiaqing Liang", "Yanghua Xiao"],
    venue: "Findings of EMNLP",
    year: 2024,
    type: "conference",
    topic: "information-extraction",
    links: {
      arxiv: "https://arxiv.org/abs/2403.16396",
      code: "https://github.com/EZ-hwh/definition-bias",
    },
  },
  {
    id: "gu2024detectbench",
    title: "DetectBench: Can Large Language Model Detect and Piece Together Implicit Evidence?",
    authors: [
      "Zhouhong Gu", "Lin Zhang", "Xiaoxuan Zhu", "Jiangjie Chen", "Wenhao Huang", "Yikai Zhang",
      "Shusen Wang", "Zheyu Ye", "Yan Gao", "Hongwei Feng", "Yanghua Xiao",
    ],
    venue: "Findings of EMNLP",
    year: 2024,
    type: "conference",
    topic: "llm-evaluation",
    links: {
      arxiv: "https://arxiv.org/abs/2406.12641",
      code: "https://github.com/MikeGu721/DetectBench",
    },
  },
  {
    id: "ding2024recall",
    title: "Improving Recall of Large Language Models: A Model Collaboration Approach for Relational Triple Extraction",
    authors: ["Zepeng Ding", "Wenhao Huang", "Jiaqing Liang", "Yanghua Xiao", "Deqing Yang"],
    venue: "LREC-COLING",
    year: 2024,
    type: "conference",
    topic: "information-extraction",
    links: {
      arxiv: "https://arxiv.org/abs/2404.09593",
    },
  },
  {
    id: "he2024cello",
    title: "Can Large Language Models Understand Real-World Complex Instructions?",
    authors: [
      "Qianyu He", "Jie Zeng", "Wenhao Huang", "Lina Chen", "Jin Xiao",
      "Qianxi He", "Xunzhe Zhou", "Jiaqing Liang", "Yanghua Xiao",
    ],
    venue: "AAAI",
    year: 2024,
    type: "conference",
    topic: "llm-evaluation",
    links: {
      arxiv: "https://arxiv.org/abs/2309.09150",
      code: "https://github.com/Abbey4799/CELLO",
    },
  },
  {
    id: "gu2024xiezhi",
    title: "Xiezhi: An Ever-Updating Benchmark for Holistic Domain Knowledge Evaluation",
    authors: [
      "Zhouhong Gu", "Xiaoxuan Zhu", "Haoning Ye", "Lin Zhang", "Jianchen Wang", "Yixin Zhu", "Sihang Jiang",
      "Zhuozhi Xiong", "Zihan Li", "Weijie Wu", "Qianyu He", "Rui Xu", "Wenhao Huang", "Jingping Liu",
      "Zili Wang", "Shusen Wang", "Weiguo Zheng", "Hongwei Feng", "Yanghua Xiao",
    ],
    venue: "AAAI",
    year: 2024,
    type: "conference",
    topic: "llm-evaluation",
    links: {
      arxiv: "https://arxiv.org/abs/2306.05783",
      code: "https://github.com/MikeGu721/XiezhiBenchmark",
    },
  },

  // 2023
  {
    id: "huang2023adaptive",
    title: "Adaptive Ordered Information Extraction with Deep Reinforcement Learning",
    authors: ["Wenhao Huang", "Jiaqing Liang", "Zhixu Li", "Yanghua Xiao", "Chuanjun Ji"],
    venue: "Findings of ACL",
    year: 2023,
    type: "conference",
    topic: "information-extraction",
    links: {
      arxiv: "https://arxiv.org/abs/2306.10787",
      code: "https://github.com/EZ-hwh/AutoExtraction",
    },
  },

  // 2021
  {
    id: "xie2021webke",
    title: "WebKE: Knowledge Triple Extraction from Semi-structured Web with Pre-trained Markup Language Models",
    authors: ["Chenhao Xie", "Wenhao Huang", "Jiaqing Liang", "Chengsong Huang", "Yanghua Xiao"],
    venue: "CIKM",
    year: 2021,
    type: "conference",
    topic: "information-extraction",
    links: {
      paper: "https://dl.acm.org/doi/10.1145/3459637.3482491",
      code: "https://github.com/redreamality/webke",
    },
  },
  {
    id: "xie2021revisiting",
    title: "Revisiting the Negative Data of Distantly Supervised Relation Extraction",
    authors: ["Chenhao Xie", "Jiaqing Liang", "Jingping Liu", "Chengsong Huang", "Wenhao Huang", "Yanghua Xiao"],
    venue: "ACL",
    year: 2021,
    type: "conference",
    topic: "information-extraction",
    links: {
      arxiv: "https://arxiv.org/abs/2105.10158",
      code: "https://github.com/redreamality/RERE-relation-extraction",
    },
  },
];

// Shown under the list. Set to "" to hide.
export const scholarUrl = "";
