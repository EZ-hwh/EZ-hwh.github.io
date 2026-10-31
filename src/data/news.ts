import type { NewsItem } from "@/types";

// Newest first. date is "YYYY-MM". Text supports **bold**, *italic* and [link text](https://…).

export const news: NewsItem[] = [
  {
    date: "2026-09",
    text: "*Latent Action Reparameterization for Efficient Agent Inference* was accepted to **NeurIPS 2026**.",
  },
  {
    date: "2026-01",
    text: "*Towards Agentic Intelligence for Materials Science* is out on [arXiv](https://arxiv.org/abs/2602.00169).",
  },
  {
    date: "2025-09",
    text: "Started my Ph.D. at [Mila](https://mila.quebec/en) and Université de Montréal, advised by [Prof. Bang Liu](https://www-labs.iro.umontreal.ca/~liubang/).",
  },
  {
    date: "2025-01",
    text: "*Steering Protein Family Design through Profile Bayesian Flow* was accepted to **ICLR 2025**.",
  },
  {
    date: "2024-09",
    text: "Three papers accepted to **EMNLP 2024**, including [AutoScraper](https://github.com/EZ-hwh/AutoScraper) in the main conference.",
  },
];
