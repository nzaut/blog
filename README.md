# enzo-m.fr

Personal site — [Astro](https://astro.build), Markdown/MDX, deployed to GitHub Pages on every push to `main`.

```bash
npm install
npm run dev      # http://localhost:4321 (drafts visible)
npm run build    # production build into dist/
```

## Writing

All content is plain Markdown in **`content/`**:

| Folder              | Shows up at        |
| ------------------- | ------------------ |
| `content/blog/`     | `/blog/<file>`     |
| `content/projects/` | `/projects/<file>` |
| `content/configs/`  | `/configs/<file>`  |
| `content/pages/`    | `/<file>` + menu   |

### From GitHub (no install)

1. Open the folder on github.com → **Add file** → *Create new file* (or *Upload files*).
2. Write Markdown. Start with `# Your title`. Check the **Preview** tab.
3. **Commit changes** → the site rebuilds in ~1 min (Actions tab shows progress; a red ✗ means the file broke the build and the site kept the previous version).

Press **`.`** on the repo page for a full editor in the browser (github.dev).

### The only rules

- **Title** = the first `# Heading` (or the file name). **Description** = first paragraph. **Date** = when the file was first committed. All can be overridden with frontmatter.
- **Images**: put them next to the file and link relatively — `![alt](./chart.png)` — so they work on GitHub *and* the site. For a post with images, use a folder: `content/blog/my-post/index.md` + `content/blog/my-post/chart.png`.
- Math `$…$` / `$$…$$` and ` ```mermaid ` blocks render on GitHub and on the site.
- `.mdx` (inline SVG, components) works on the site but GitHub won't preview it.

### Optional frontmatter

```md
---
title: Overrides the # heading
description: Overrides the first paragraph
date: 2026-10-01
tags: [python, trading]
draft: true          # hidden online, visible with npm run dev
---
```

Projects also take `status` (active/paused/done/archived), `stack`, `repo`, `url`, `featured`; configs take `category`; pages take `nav: false` to stay out of the menu and `order` to sort it. Full list: `src/content.config.ts`.

### Locally

```bash
npm run dev                  # live preview at http://localhost:4321, reloads on save
npm run new post "Title"     # scaffold: post | project | config | page
```

## Design

Brand guide: `design/charte.html` (logo, colours, type, motifs). All tokens are at the top of `src/styles/global.css`; the logo is `src/components/Logo.astro`.
Name, tagline, nav and socials live in `src/consts.ts`.
