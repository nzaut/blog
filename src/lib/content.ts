import { getCollection } from 'astro:content';

// Drafts are visible in `npm run dev`, hidden in the production build.
const visible = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

export async function getPosts() {
  return (await getCollection('blog', visible)).sort((a, b) => +b.data.date - +a.data.date);
}

// Memoized: the header calls this on every page, and an empty collection logs a warning each time.
let projects: ReturnType<typeof loadProjects> | undefined;
export const getProjects = () => (projects ??= loadProjects());

async function loadProjects() {
  return (await getCollection('projects', visible)).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || +b.data.date - +a.data.date,
  );
}

export async function getConfigs() {
  return (await getCollection('configs', visible)).sort((a, b) =>
    a.data.category.localeCompare(b.data.category) || a.data.title.localeCompare(b.data.title),
  );
}

export async function getPages() {
  return (await getCollection('pages', visible)).sort((a, b) => a.data.order - b.data.order);
}

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
