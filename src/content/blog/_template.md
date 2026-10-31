---
# ─────────────────────────────────────────────────────────────────────────────
# How to write a post
#
# 1. Copy this file to a new name in the same folder, e.g. my-first-post.md.
#    The file name becomes the address: /blog/my-first-post/
#    Use lowercase words joined by hyphens.
# 2. Fill in the fields below, then replace the body with your writing.
# 3. Preview with `npm run dev` → http://localhost:3000/blog/
#    (drafts and this template show up there, marked "Draft").
# 4. When it's ready, delete the `draft: true` line (or set it to false) and push.
#
# Files starting with "_" (like this one) are never published.
# Lines starting with "#" up here are notes and are ignored.
# ─────────────────────────────────────────────────────────────────────────────

title: "Post title, in sentence case"
date: 2026-10-30            # YYYY-MM-DD; posts are sorted by this
description: "One sentence that says what the post is about. Shown in the blog list and in link previews."
tags: [agents, notes]       # optional
draft: true                 # remove this line to publish
---

Open with a short paragraph that tells the reader what the post is about and why it matters. The first paragraph is set a little larger, like the introduction on the homepage.

Regular paragraphs follow. You can use **bold**, *italic*, `inline code` and [links](https://mila.quebec/en). Links to other sites open in a new tab. Footnotes look like this.[^1]

## A section heading

Use `##` for sections and `###` for subsections. Each heading gets an anchor, so you can link to it, e.g. [#a-section-heading](#a-section-heading).

- Bulleted lists use a dash
- Keep items short
  - Indent two spaces to nest

1. Numbered lists use numbers
2. Like this

> A quotation or a key takeaway, set off with a thin blue rule.

### Math

Inline math goes between single dollar signs, like $p_\theta(a_t \mid s_t)$. Display math goes between double dollar signs:

$$
\mathcal{L}(\theta) = -\sum_{t=1}^{T} \log p_\theta(x_t \mid x_{<t})
$$

### Code

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

### Figures

Put images in `public/blog/<post-name>/` and refer to them from `/blog/<post-name>/…`. A line in italics right after the image becomes its caption.

![A short description of the image for screen readers](/blog/_template/figure.svg)
*Figure 1. A caption that says what the reader should notice.*

### Tables

| Method   | Accuracy | Tokens |
|----------|---------:|-------:|
| Baseline |     71.2 |  1,024 |
| Ours     | **78.9** |    412 |

---

A horizontal rule (three dashes) separates the end matter. You can close with acknowledgements or references here.

[^1]: The note's text can go anywhere in the file; it is collected at the end of the post.
