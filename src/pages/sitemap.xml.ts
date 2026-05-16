import type { APIRoute } from 'astro';
import { getAllStoreDomains, getTags } from '../lib/cms-client';
import { slugify } from '../lib/utils';

export const GET: APIRoute = async () => {
  const baseUrl = import.meta.env.BASE_URL || 'https://www.whatsdiscount.co.uk';
  
  let domains: string[] = [];
  let tags: string[] = [];
  
  try {
    domains = await getAllStoreDomains();
  } catch {
    // Empty fallback
  }
  
  try {
    tags = await getTags();
  } catch {
    // Empty fallback
  }

  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/stores', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.5', changefreq: 'monthly' },
    { path: '/contact', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
    { path: '/terms', priority: '0.3', changefreq: 'monthly' },
    { path: '/imprint', priority: '0.3', changefreq: 'monthly' },
  ];

  const storeUrls = domains.map((domain) => ({
    path: `/discount/${domain}`,
    priority: '0.9',
    changefreq: 'daily',
  }));

  const tagUrls = tags.map((tag) => ({
    path: `/tag-${slugify(tag)}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticPages, ...storeUrls, ...tagUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((url) => `  <url>
    <loc>${baseUrl}${url.path}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
