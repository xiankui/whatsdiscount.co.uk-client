import type { APIRoute } from 'astro';
import { getAllStoreDomains, getTags } from '../lib/cms-client';

const siteUrl = 'https://www.whatsdiscount.co.uk';

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/stores', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.3', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/imprint', priority: '0.3', changefreq: 'yearly' },
];

export const GET: APIRoute = async () => {
  let storeDomains: string[] = [];
  let tags: string[] = [];

  try {
    storeDomains = await getAllStoreDomains();
  } catch {
    // Empty fallback
  }

  try {
    tags = await getTags();
  } catch {
    // Empty fallback
  }

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  const urls = [
    ...staticPages.map((page) => ({
      loc: `${siteUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
    })),
    ...storeDomains.map((domain) => ({
      loc: `${siteUrl}/discount/${domain}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8',
    })),
    ...tags.map((tag) => ({
      loc: `${siteUrl}/tag-${slugify(tag)}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7',
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
