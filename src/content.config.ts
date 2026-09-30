// Content lives in /content at the repo root. Frontmatter is optional:
// missing fields are filled in by src/lib/content.ts (title from the first
// "# Heading" or the filename, dates from git history).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const files = (dir: string) => glob({ base: `./content/${dir}`, pattern: '**/*.{md,mdx}' });

const blog = defineCollection({
  loader: files('blog'),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: files('projects'),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    status: z.enum(['active', 'paused', 'done', 'archived']).default('active'),
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    url: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const configs = defineCollection({
  loader: files('configs'),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.string().default('Misc'),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Standalone pages (about, ...). Each file becomes /<filename>.
const pages = defineCollection({
  loader: files('pages'),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    nav: z.boolean().default(true), // show in the header menu
    order: z.number().default(50),  // menu position, lower = further left
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects, configs, pages };
