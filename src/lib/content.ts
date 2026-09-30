import { execFileSync } from 'node:child_process';
import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

// ---------------------------------------------------------------------------
// Defaults for missing frontmatter, so a bare Markdown file just works.
// ---------------------------------------------------------------------------

// First "# Heading" of the file (it is stripped from the body by remark-strip-title).
const firstHeading = (body = '') => body.match(/^#\s+(.+?)\s*#*\s*$/m)?.[1];

// "my-first-post" / "blog/my-first-post" -> "My first post"
const fromFilename = (id: string) => {
  const s = id.split('/').filter((p) => p !== 'index').pop()!.replace(/[-_]+/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// First real paragraph, as plain text, cut around 160 chars.
const firstParagraph = (body = '') => {
  const para = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^(#|```|\$\$|<|!\[|>|[-*+] |\d+\. |\||import |export )/.test(b));
  if (!para) return undefined;
  const text = para
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ');
  return text.length > 160 ? text.slice(0, 157).replace(/\s+\S*$/, '') + '…' : text;
};

// Dates from git: first commit that added the file, last commit that touched it.
const gitCache = new Map<string, { created?: Date; modified?: Date }>();
function gitDates(file?: string) {
  if (!file) return {};
  if (!gitCache.has(file)) {
    let created: Date | undefined, modified: Date | undefined;
    try {
      const log = execFileSync('git', ['log', '--follow', '--format=%aI', '--', file], { encoding: 'utf8' })
        .trim().split('\n').filter(Boolean);
      if (log.length) { modified = new Date(log[0]); created = new Date(log.at(-1)!); }
    } catch {}
    gitCache.set(file, { created, modified });
  }
  return gitCache.get(file)!;
}

function withDefaults<E extends { id: string; body?: string; filePath?: string; data: Record<string, any> }>(entry: E) {
  const git = gitDates(entry.filePath);
  const now = new Date(); // not committed yet
  const d = entry.data;
  return {
    ...entry,
    data: {
      ...d,
      title: (d.title ?? firstHeading(entry.body) ?? fromFilename(entry.id)) as string,
      description: (d.description ?? firstParagraph(entry.body) ?? '') as string,
      date: (d.date ?? git.created ?? now) as Date,
      updated: (d.updated ?? (d.date ? undefined : git.modified)) as Date | undefined,
    },
  };
}

// Drafts are visible in `npm run dev`, hidden in the production build.
const visible = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

async function load<C extends CollectionKey>(name: C) {
  return (await getCollection(name, visible as any)).map((e) => withDefaults(e as CollectionEntry<C>));
}

// Memoized: the header calls these on every page.
const memo = <T,>(fn: () => Promise<T>) => { let p: Promise<T> | undefined; return () => (p ??= fn()); };

export const getPosts = memo(async () =>
  (await load('blog')).sort((a, b) => +b.data.date - +a.data.date),
);

export const getProjects = memo(async () =>
  (await load('projects')).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || +b.data.date - +a.data.date,
  ),
);

export const getConfigs = memo(async () =>
  (await load('configs')).sort((a, b) =>
    a.data.category.localeCompare(b.data.category) || a.data.title.localeCompare(b.data.title),
  ),
);

export const getPages = memo(async () =>
  (await load('pages')).sort((a, b) => a.data.order - b.data.order),
);

// Header menu: sections that have content, then pages flagged `nav: true`.
export async function getNav() {
  const [posts, projects, configs, pages] = await Promise.all([getPosts(), getProjects(), getConfigs(), getPages()]);
  return [
    posts.length && { href: '/blog', label: 'Writing' },
    projects.length && { href: '/projects', label: 'Projects' },
    configs.length && { href: '/configs', label: 'Configs' },
    ...pages.filter((p) => p.data.nav).map((p) => ({ href: `/${p.id}`, label: p.data.title })),
  ].filter((item): item is { href: string; label: string } => Boolean(item));
}
