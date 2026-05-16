import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const kwds = url.searchParams.get('kwds');
  const limit = url.searchParams.get('limit') || '10';

  if (!kwds) {
    return new Response(
      JSON.stringify({ success: false, error: 'Missing kwds parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const cmsUrl = `${import.meta.env.CMS_API_URL}/api/site/stores/search?kwds=${encodeURIComponent(kwds)}&limit=${limit}`;

  try {
    const res = await fetch(cmsUrl, {
      headers: {
        'X-Site-Id': import.meta.env.SITE_ID,
      },
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch search results' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
