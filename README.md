# enzo-m.fr

Personal site — [Astro](https://astro.build), Markdown/MDX, deployed to GitHub Pages on every push to `main`.

```bash
npm install
npm run dev      # http://localhost:4321 (drafts visible)
npm run build    # production build into dist/
```

## Writing

| What            | Where                                  | URL                  |
| --------------- | -------------------------------------- | -------------------- |
| Blog post       | `src/content/blog/<slug>.md(x)`        | `/blog/<slug>`       |
| Project         | `src/content/projects/<slug>.md(x)`    | `/projects/<slug>`   |
| Reference config| `src/content/configs/<slug>.md(x)`     | `/configs/<slug>`    |
| About / Uses    | `src/pages/about.md`, `src/pages/uses.md` | `/about`, `/uses` |
| Images, SVG, PDF| `public/…` → referenced as `/…`        |                      |

Frontmatter fields are defined (and validated) in `src/content.config.ts`. Minimal post:

```md
---
title: My post
description: One sentence.
date: 2026-10-01
tags: [python]
draft: true        # hidden in production until removed
---
```

- **Math** — `$inline$` and `$$ block $$` (KaTeX).
- **Diagrams** — fenced ` ```mermaid ` blocks.
- **SVG / components** — use `.mdx` and paste raw `<svg>` (use `strokeWidth` not `stroke-width`; colours: `currentColor`, `var(--accent)`).
- See `src/content/blog/markdown-playground.mdx` for a live cheat sheet.

## Design

All colours, fonts and spacing are tokens at the top of `src/styles/global.css`.
Name, tagline, nav and socials live in `src/consts.ts`.
