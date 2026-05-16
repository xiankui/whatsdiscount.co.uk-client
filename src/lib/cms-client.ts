import type { ApiResponse } from './types';

const CMS_API_BASE = import.meta.env.CMS_API_URL;
const SITE_ID = import.meta.env.SITE_ID;

async function cmsFetch<T>(path: string): Promise<T> {
  const url = `${CMS_API_BASE}${path}`;
  
  const res = await fetch(url, {
    headers: {
      'X-Site-Id': SITE_ID,
    },
  });
  
  if (!res.ok) {
    throw new Error(`CMS API error: ${res.status} ${res.statusText}`);
  }
  
  const body: ApiResponse<T> = await res.json();
  
  if (!body.success) {
    throw new Error(body.error || 'CMS API error');
  }
  
  return body.data as T;
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

export async function getDecoration(key: string) {
  return cmsFetch(`/api/site/decoration?key=${encodeURIComponent(key)}`);
}

export async function getAllDecorations() {
  return cmsFetch('/api/site/decoration');
}
