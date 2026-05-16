import type { ApiResponse, DecorationBrand } from './types';

const CMS_API_BASE = import.meta.env.CMS_API_URL;
const SITE_ID = import.meta.env.SITE_ID;

if (!CMS_API_BASE) {
  throw new Error('Missing CMS_API_URL environment variable. Check your .env.local file.');
}

if (!SITE_ID) {
  throw new Error('Missing SITE_ID environment variable. Check your .env.local file.');
}

async function cmsFetch<T>(path: string): Promise<T> {
  const url = `${CMS_API_BASE}${path}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'X-Site-Id': SITE_ID,
      },
    });
    
    if (!res.ok) {
      console.error(`[CMS API] Request failed: ${res.status} ${res.statusText} - ${url}`);
      throw new Error(`CMS API error: ${res.status} ${res.statusText}`);
    }
    
    const body: ApiResponse<T> = await res.json();
    
    if (!body.success) {
      console.error(`[CMS API] Response error: ${body.error} - ${url}`);
      throw new Error(body.error || 'CMS API error');
    }
    
    return body.data as T;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CMS API')) {
      throw error;
    }
    console.error(`[CMS API] Network error: ${error} - ${url}`);
    throw error;
  }
}

export async function getTags(): Promise<string[]> {
  return cmsFetch<string[]>('/api/site/tags');
}

export async function getStoresByDomains(domains: string[]) {
  const domainsParam = domains.join(',');
  return cmsFetch(`/api/site/stores/by-domains?domains=${encodeURIComponent(domainsParam)}`);
}

export async function getStoreDetail(domain: string) {
  return cmsFetch(`/api/site/stores/${domain}`);
}

export async function getLatestCoupons(limit: number = 10) {
  return cmsFetch(`/api/site/coupons/latest?limit=${limit}`);
}

export async function getCouponsByTag(tag: string) {
  return cmsFetch(`/api/site/coupons/by-tag?tag=${encodeURIComponent(tag)}`);
}

export async function getAllStoreDomains(): Promise<string[]> {
  return cmsFetch<string[]>('/api/site/stores/all-domains');
}

export async function getRedirectUrl(domain: string) {
  return cmsFetch(`/api/site/stores/${domain}/redirect-url`);
}

export async function searchStores(kwds: string, limit: number = 10) {
  return cmsFetch(`/api/site/stores/search?kwds=${encodeURIComponent(kwds)}&limit=${limit}`);
}

export async function getSiteStats() {
  return cmsFetch('/api/site/stats');
}

export async function getRelatedStores(domain: string, limit: number = 10) {
  return cmsFetch(`/api/site/stores/${domain}/related?limit=${limit}`);
}

export async function getPopularStores(limit: number = 10) {
  return cmsFetch(`/api/site/stores/popular?limit=${limit}`);
}

export async function getTopMenus(): Promise<TopMenuItem[]> {
  return cmsFetch<TopMenuItem[]>('/api/site/decoration?key=layout-top-menus');
}

export async function getPopularBrands(): Promise<DecorationBrand[]> {
  return cmsFetch<DecorationBrand[]>('/api/site/decoration?key=index-popular-brands');
}

export async function getDecoration(key: string) {
  return cmsFetch(`/api/site/decoration?key=${encodeURIComponent(key)}`);
}

export async function getAllDecorations() {
  return cmsFetch('/api/site/decoration');
}
