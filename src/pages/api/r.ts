import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const domain = url.searchParams.get('domain');

  if (code) {
    try {
      const [decodedDomain, couponId] = atob(code).split('&');
      return redirectWithDomain(decodedDomain);
    } catch {
      return new Response('Invalid code', { status: 400 });
    }
  }

  if (domain) {
    return redirectWithDomain(domain);
  }

  return new Response('Missing code or domain parameter', { status: 400 });
};

async function redirectWithDomain(domain: string) {
  try {
    const cmsUrl = `${import.meta.env.CMS_API_URL}/api/site/stores/${domain}/redirect-url`;
    
    const res = await fetch(cmsUrl, {
      headers: {
        'X-Site-Id': import.meta.env.SITE_ID,
      },
    });

    if (!res.ok) {
      return new Response('Failed to fetch redirect URL', { status: 502 });
    }

    const json = await res.json();
    
    if (!json.success || !json.data?.outUrl) {
      return new Response('No redirect URL found', { status: 404 });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: json.data.outUrl,
      },
    });
  } catch {
    return new Response('Failed to process redirect', { status: 500 });
  }
}
