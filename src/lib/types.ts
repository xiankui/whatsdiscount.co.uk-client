export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Coupon {
  id: number;
  title: string;
  type: 'code' | 'deal';
  code: string;
  disInfo: string;
  description?: string;
  isValid?: number;
  source?: string;
  expireDate?: string;
  usesToday?: number;
  successRate?: number;
  avgSaving?: number;
}

export interface CouponWithSiteStore extends Coupon {
  siteStore: SiteStoreSummary;
}

export interface SiteStoreSummary {
  id: string;
  domain: string;
  name: string;
  logoPic: string;
  affiliateUrl: string;
  couponCount?: number;
  coupons?: Coupon[];
}

export interface SiteStoreDetail {
  id: string;
  domain: string;
  name: string;
  logoPic: string;
  tags: string[];
  coupons: Coupon[];
  savingTips: SavingTip[];
  faqs: FAQ[];
  about: string;
  seo: SEO;
  lastUpdateAt?: string;
}

export interface SavingTip {
  title: string;
  content: string;
  isFallback: boolean;
}

export interface FAQ {
  topic: string;
  content: string;
  isFallback: boolean;
}

export interface SEO {
  title: string;
  keywords: string;
  description: string;
  h1: string;
  isFallback: boolean;
}

export interface RedirectUrl {
  outUrl: string;
  domain: string;
  selectedCardNo: string;
}

export interface StoreSearchResult {
  domain: string;
  name: string;
  logoPic: string;
}

export interface SiteStats {
  storeCount: number;
  couponCount: number;
}

export interface TopMenuItem {
  name: string;
  path: string;
}

export interface DecorationBrand {
  domain: string;
  pic: string;
  logo: string;
  name: string;
}

export interface Decoration {
  domain?: string;
  pics: string[];
  txts: string[];
}

export interface DecorationMap {
  [key: string]: Decoration[];
}
