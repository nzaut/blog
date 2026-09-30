#!/usr/bin/env node
// Create a new piece of content with the right frontmatter.
//
//   npm run new                          → interactive
//   npm run new post "My great title"    → direct
//   npm run new page "Now" -- --mdx      → .mdx instead of .md (for inline SVG / components)
//
// Types: post, project, config, page

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { spawnSync } from 'node:child_process';
import { stdin, stdout, argv, env, exit } from 'node:process';

const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const TYPES = {
  post: {
    dir: 'content/blog',
    url: (slug) => `/blog/${slug}`,
    frontmatter: (title) => ({ title, description: '', date: today, tags: [], draft: true }),
    body: 'Start writing here.\n',
  },
  project: {
    dir: 'content/projects',
    url: (slug) => `/projects/${slug}`,
    frontmatter: (title) => ({ title, description: '', date: today, status: 'active', stack: [], draft: true }),
    body: '## Why\n\n## How it works\n\n## Results\n',
  },
  config: {
    dir: 'content/configs',
    url: (slug) => `/configs/${slug}`,
    frontmatter: (title) => ({ title, description: '', category: 'Misc', updated: today, tags: [], draft: true }),
    body: '```yaml\n# config here\n```\n\n## Why each choice\n\n- \n',
  },
  page: {
    dir: 'content/pages',
    url: (slug) => `/${slug}`,
    frontmatter: (title) => ({ title, description: '', nav: true, order: 50 }),
    body: '',
  },
};

const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const yaml = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(', ')}]` : typeof v === 'string' && v !== today ? JSON.stringify(v) : v}`)
    .join('\n');

const args = argv.slice(2).filter((a) => !a.startsWith('--'));
const ext = argv.includes('--mdx') ? 'mdx' : 'md';
let [type, ...titleWords] = args;
let title = titleWords.join(' ');

const rl = createInterface({ input: stdin, output: stdout });
if (!TYPES[type]) {
  type = (await rl.question(`Type (${Object.keys(TYPES).join(' / ')}) [post]: `)).trim() || 'post';
  if (!TYPES[type]) { console.error(`Unknown type "${type}".`); exit(1); }
}
if (!title) title = (await rl.question('Title: ')).trim();
rl.close();
if (!title) { console.error('A title is required.'); exit(1); }

const { dir, url, frontmatter, body } = TYPES[type];
const slug = slugify(title);
const file = `${dir}/${slug}.${ext}`;
if (existsSync(file)) { console.error(`${file} already exists.`); exit(1); }

mkdirSync(dir, { recursive: true });
writeFileSync(file, `---\n${yaml(frontmatter(title))}\n---\n\n${body}`);

console.log(`\n  Created ${file}`);
console.log(`  URL      ${url(slug)}  (with npm run dev running)`);
if ('draft' in frontmatter(title)) console.log('  It is a draft: remove `draft: true` to publish it.');
console.log('');

if (env.EDITOR) spawnSync(env.EDITOR, [file], { stdio: 'inherit' });
