# enzo-m.fr

Personal site — [Astro](https://astro.build), Markdown/MDX, deployed to GitHub Pages on every push to `main`.

```bash
npm install
npm run dev      # http://localhost:4321 (drafts visible)
npm run build    # production build into dist/
```

## Writing

```bash
npm run new                          # asks what to create
npm run new post "My title"          # post | project | config | page
npm run new page "Now" -- --mdx      # .mdx when you need inline SVG / components
```

It creates the file with the right frontmatter (posts, projects and configs start as `draft: true`: visible in `npm run dev`, hidden online until you remove that line).

| What             | Where                        | URL                |
| ---------------- | ---------------------------- | ------------------ |
| Blog post        | `src/content/blog/`          | `/blog/<file>`     |
| Project          | `src/content/projects/`      | `/projects/<file>` |
| Reference config | `src/content/configs/`       | `/configs/<file>`  |
| Page (about, …)  | `src/content/pages/`         | `/<file>`          |
| Images, SVG, PDF | `public/…` → linked as `/…`  |                    |

- **Menu** — builds itself: Writing / Projects / Configs appear once they have content; pages appear if `nav: true` (position via `order`, lower = left).
- **Math** — `$inline$` and `$$ block $$` (KaTeX).
- **Diagrams** — fenced ` ```mermaid ` blocks.
- **SVG / components** — use `.mdx` and paste raw `<svg>` (use `strokeWidth` not `stroke-width`; colours: `currentColor`, `var(--accent)`).
- All frontmatter fields are listed in `src/content.config.ts`. Cheat sheet: `src/content/blog/markdown-playground.mdx`.

## Design

Brand guide: `design/charte.html` (logo, colours, type, motifs). All tokens are at the top of `src/styles/global.css`; the logo is `src/components/Logo.astro`.
Name, tagline, nav and socials live in `src/consts.ts`.
