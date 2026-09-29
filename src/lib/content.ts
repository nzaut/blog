import { getCollection } from 'astro:content';

// Drafts are visible in `npm run dev`, hidden in the production build.
const visible = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

export async function getPosts() {
  return (await getCollection('blog', visible)).sort((a, b) => +b.data.date - +a.data.date);
}

export async function getProjects() {
  return (await getCollection('projects', visible)).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || +b.data.date - +a.data.date,
  );
}

export async function getConfigs() {
  return (await getCollection('configs', visible)).sort((a, b) =>
    a.data.category.localeCompare(b.data.category) || a.data.title.localeCompare(b.data.title),
  );
}
