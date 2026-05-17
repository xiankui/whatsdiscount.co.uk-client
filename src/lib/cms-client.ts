import type { ApiResponse, DecorationBrand, Coupon } from './types';

const CMS_API_BASE = import.meta.env.CMS_API_URL;
const SITE_ID = import.meta.env.SITE_ID;

if (!CMS_API_BASE) {
  throw new Error('Missing CMS_API_URL environment variable. Check your .env.local file.');
}

if (!SITE_ID) {
  throw new Error('Missing SITE_ID environment variable. Check your .env.local file.');
}

const storeCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 60 * 1000;

function extractDisInfo(title: string): string {
  const patterns = [
    /^£[\d.]+\s*Off/i,
    /^\d+%\s*Off/i,
    /^Free\s+(Shipping|Delivery|Postage)/i,
    /^Buy\s+\d+\s+Get\s+\d+\s+Free/i,
    /^\d+\s+for\s+£[\d.]+/i,
  ];
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return match[0];
  }
  const colonIndex = title.indexOf(':');
  if (colonIndex > 0) return title.slice(0, colonIndex).trim();
  return title.split(/\s+/).slice(0, 3).join(' ');
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function generateCouponStats(couponId: number, domain: string): Partial<Coupon> {
  if (couponId > 2) return {};
  const seed = hashString(domain) + couponId * 31;
  const rand = seededRandom(seed);
  const now = new Date();
  const ranges = [
    { usesMin: 800, usesMax: 3000, rateMin: 94, rateMax: 99, saveMin: 15, saveMax: 65, dayMin: 14, dayMax: 30 },
    { usesMin: 400, usesMax: 1500, rateMin: 88, rateMax: 96, saveMin: 10, saveMax: 45, dayMin: 7, dayMax: 21 },
    { usesMin: 200, usesMax: 800, rateMin: 82, rateMax: 94, saveMin: 5, saveMax: 30, dayMin: 3, dayMax: 14 },
  ];
  const range = ranges[couponId];
  const usesToday = Math.floor(rand() * (range.usesMax - range.usesMin)) + range.usesMin;
  const successRate = Math.floor(rand() * (range.rateMax - range.rateMin)) + range.rateMin;
  const avgSaving = Math.floor(rand() * (range.saveMax - range.saveMin)) + range.saveMin;
  const expireDays = Math.floor(rand() * (range.dayMax - range.dayMin)) + range.dayMin;
  const expireDate = new Date(now.getTime() + expireDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return { usesToday, successRate, avgSaving, expireDate };
}

function enrichCoupons(coupons: Coupon[], domain: string): Coupon[] {
  return coupons.map((coupon) => {
    const disInfo = coupon.disInfo || extractDisInfo(coupon.title);
    const stats = generateCouponStats(coupon.id, domain);
    return { ...coupon, disInfo, ...stats };
  });
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
  const cached = storeCache.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const data = await cmsFetch(`/api/site/stores/${domain}`);
  const enriched = {
    ...data,
    coupons: enrichCoupons((data as { coupons: Coupon[] }).coupons || [], domain),
  };
  storeCache.set(domain, { data: enriched, timestamp: Date.now() });
  return enriched;
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
