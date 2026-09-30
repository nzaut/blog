// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkStripTitle from './src/plugins/remark-strip-title.mjs';

export default defineConfig({
  site: 'https://enzo-m.fr',
  integrations: [mdx(), sitemap()],
  markdown: {
    // Math: $inline$ and $$block$$ rendered with KaTeX at build time.
    // A leading "# Title" is removed from the body (the layout renders the title).
    processor: unified({
      remarkPlugins: [remarkMath, remarkStripTitle],
      rehypePlugins: [rehypeKatex],
    }),
    // ```mermaid blocks are left raw and rendered client-side (see Base.astro).
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
