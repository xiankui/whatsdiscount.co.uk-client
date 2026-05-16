# WhatsDiscount Client - Project Context

> UK coupon/voucher aggregation site | Astro 5 + React 19 + Tailwind 4 | Cloudflare Pages
> Design: Premium Retail Intelligence (Electric Red + Midnight Navy + Glassmorphism)

---

## Quick Start

```bash
npm install                          # Install deps
cp .env.example .env.local           # Copy env template, fill values
npm run dev                          # Dev server at http://localhost:4321
npm run build                        # Production build (needs cloudflare adapter enabled)
```

**Env vars** (see `.env.example`):
| Variable | Value |
|----------|-------|
| `CMS_API_URL` | `https://ecc.cgs-api.me` |
| `SITE_ID` | `whatsdiscount.co.uk` |
| `IMG_URL` | `https://pics.dibsale.com/cdn-cgi/image/width=360/` |
| `BASE_URL` | `https://www.whatsdiscount.co.uk` |

---

## Architecture

```
src/
├── lib/                    # Core utilities (NO side effects)
│   ├── cms-client.ts       # 14 CMS API functions, all server-side
│   ├── types.ts            # TypeScript interfaces for all API responses
│   └── utils.ts            # Pure helpers: getImageUrl, encode/decodeCouponLink, formatDate, slugify
├── layouts/
│   └── BaseLayout.astro    # Shell: Header + Main + Footer + grain overlay + SearchDrawer
├── components/             # Astro (.astro) + React (.tsx)
│   ├── Header.astro        # Sticky nav, CMS-driven menu items, search trigger
│   ├── Footer.astro        # 3-col: brand, links, social
│   ├── SEO.astro           # Meta tags, OG, Twitter, JSON-LD structured data
│   ├── SearchDrawer.tsx    # React: search modal, debounced API call, brand results
│   ├── CouponCard.astro    # Two variants: 'ticket' (horizontal 3-col) | 'list' (vertical)
│   ├── StoreCard.astro     # Circular logo + name + voucher count
│   ├── QuickAccessPills.astro  # Horizontal scrollable coupon code pills
│   ├── FeaturedBrands.astro    # 3-col image cards with overlay
│   ├── ValueProps.astro        # 3-col: Instant Savings / Hand Verified / Exclusive Codes
│   ├── FAQSection.astro        # Accordion + JSON-LD FAQPage structured data
│   └── ui/                 # shadcn/ui base components (empty, add as needed)
├── pages/                  # File-based routing
│   ├── index.astro         # Homepage: Hero → Pills → Brands → Coupons → Categories → Stores → ValueProps → FAQ → Newsletter
│   ├── discount/[domain].astro  # Store page: Brand header + stats bento + ticket vouchers + sidebar
│   ├── detail/[pid].astro       # Coupon detail: Large ticket + Split Action Button + stats + how-to-use
│   ├── tag-[category].astro     # Category page: coupon cards filtered by tag
│   ├── stores.astro             # All categories list
│   ├── about.astro, contact.astro, privacy.astro, terms.astro, imprint.astro
│   ├── sitemap.xml.ts           # Dynamic sitemap from CMS
│   └── api/
│       ├── r.ts                 # 302 redirect: /api/r?code={base64} or ?domain=xxx
│       └── site-stores.ts       # Search proxy: /api/site-stores?kwds=xxx
└── styles/
    └── global.css          # Design tokens: colors, mesh gradient, glass-panel, digital-ticket, shimmer-sweep
```

---

## CMS API (Base: https://ecc.cgs-api.me)

All calls include `X-Site-Id: whatsdiscount.co.uk` header. See `API.md` for full docs.

| Function | Endpoint | Returns | Used By |
|----------|----------|---------|---------|
| `getTags()` | `/api/site/tags` | `string[]` | (legacy, replaced by getTopMenus) |
| `getTopMenus()` | `/api/site/decoration?key=layout-top-menus` | `TopMenuItem[]` | Header nav |
| `getPopularBrands()` | `/api/site/decoration?key=index-popular-brands` | `DecorationBrand[]` | Homepage Featured Brands |
| `getSiteStats()` | `/api/site/stats` | `{storeCount, couponCount}` | Homepage Hero |
| `getLatestCoupons(limit)` | `/api/site/coupons/latest?limit=N` | `CouponWithSiteStore[]` | Homepage Pills + Coupons |
| `getPopularStores(limit)` | `/api/site/stores/popular?limit=N` | `SiteStoreSummary[]` | Homepage Popular Stores |
| `getStoreDetail(domain)` | `/api/site/stores/:domain` | `SiteStoreDetail` | Store page, Detail page |
| `getRelatedStores(domain, limit)` | `/api/site/stores/:domain/related?limit=N` | `SiteStoreSummary[]` | Store page sidebar |
| `getCouponsByTag(tag)` | `/api/site/coupons/by-tag?tag=xxx` | `CouponWithSiteStore[]` | Category page |
| `getAllStoreDomains()` | `/api/site/stores/all-domains` | `string[]` | Sitemap |
| `getRedirectUrl(domain)` | `/api/site/stores/:domain/redirect-url` | `{outUrl}` | /api/r.ts |
| `searchStores(kwds, limit)` | `/api/site/stores/search?kwds=xxx` | `StoreSearchResult[]` | SearchDrawer (via proxy) |
| `getDecoration(key)` | `/api/site/decoration?key=xxx` | `Decoration[]` | Generic decoration |
| `getAllDecorations()` | `/api/site/decoration` | `DecorationMap` | Bulk decoration |

---

## Key Data Types

```typescript
Coupon { id, title, type: 'code'|'deal', code, disInfo, description?, isValid?, source? }
CouponWithSiteStore extends Coupon { siteStore: SiteStoreSummary }
SiteStoreSummary { id, domain, name, logoPic, affiliateUrl, couponCount?, coupons? }
SiteStoreDetail { id, domain, name, logoPic, tags, coupons, savingTips, faqs, about, seo, lastUpdateAt? }
SEO { title, keywords, description, h1, isFallback }
DecorationBrand { domain, pic, logo, name }
TopMenuItem { name, path }
```

---

## Key Conventions

### Coupon Link Encoding
```ts
encodeCouponLink(domain, couponId) → btoa(`${domain}&${couponId}`)  // for /detail/[pid]
decodeCouponLink(pid) → { domain, couponId }                        // reverse
```

### Image URLs
```ts
getImageUrl(logoPic) → `${IMG_URL}${logoPic}`  // IMG_URL = https://pics.dibsale.com/cdn-cgi/image/width=360/
```

### API Error Handling
- All CMS calls wrapped in `try/catch` with `console.error` logging
- Pages provide fallback UI on empty/error states
- `cms-client.ts` validates env vars at module load

### Routing
- `/discount/[domain]` - Store page (SSR, dynamic)
- `/detail/[pid]` - Coupon detail (SSR, dynamic, pid = base64 encoded `domain&couponId`)
- `/tag-[category]` - Category page (SSR, dynamic)
- `/api/r?code={base64}` or `?domain=xxx` - 302 affiliate redirect

---

## Design System (see DESIGN.md)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#ac001e` | CTAs, hero actions |
| `primary-hover` | `#d90429` | Hover state |
| `midnight-navy` | `#2B2D42` | Footer, headings |
| `surface` | `#fff8f7` | Page background |
| `on-surface` | `#291716` | Primary text |
| `on-surface-variant` | `#5d3f3d` | Secondary text |

### Key CSS Classes (in global.css)
| Class | Purpose |
|-------|---------|
| `.glass-panel` | `bg-white/70 backdrop-blur-xl border border-white/20` |
| `.digital-ticket` | `mask-image: radial-gradient(...)` side-cut notch |
| `.shimmer-sweep` | Hover shimmer animation via `::after` |
| `.btn-primary` | Red CTA button |
| `.btn-split` / `.btn-split-primary` / `.btn-split-secondary` | Split action button (detail page) |
| `.badge-verified` | Primary-colored verified badge |
| `.label-caps` | `text-xs font-semibold uppercase tracking-wider` |

### Background
- Mesh gradient: 4-layer `radial-gradient` (red + navy tones)
- Grain overlay: SVG noise filter at 3% opacity, fixed, pointer-events none

---

## Development Rules (from AGENTS.md)

1. **Minimum Change** - Only modify what's necessary for the current task
2. **Component Extraction** - Split >80 lines, extract repeated patterns
3. **Type Safety** - No `any`, typed API responses, typed props
4. **Single Responsibility** - Pages: data fetching; Components: rendering; Lib: pure utilities
5. **Build Verification** - Run `npm run build` after every change
6. **Naming** - PascalCase components, kebab-case files, camelCase variables
7. **Tailwind Only** - No inline styles, no CSS modules
8. **Error Boundaries** - All API calls have try/catch, fallback UI

---

## Deployment (Cloudflare Pages)

**Current state**: Cloudflare adapter is **commented out** in `astro.config.mjs` for local dev.

**To deploy**:
1. Uncomment `adapter: cloudflare({...})` in `astro.config.mjs`
2. Set env vars in Cloudflare Pages dashboard
3. `npm run build && wrangler pages deploy dist`

**Env vars for Cloudflare**: Same as `.env.example`

---

## What's Done

- ✅ Project setup (Astro 5, React 19, Tailwind 4, TypeScript strict)
- ✅ CMS API client (14 functions, error handling, env validation)
- ✅ All pages: Homepage, Store, Detail, Category, Categories list, Static pages
- ✅ API routes: `/api/r` (redirect), `/api/site-stores` (search proxy)
- ✅ Sitemap generation
- ✅ Search drawer (React, debounced)
- ✅ SEO component + JSON-LD structured data
- ✅ Design system: Red/Navy colors, glassmorphism, digital ticket, shimmer, mesh gradient
- ✅ opencode skills: frontend-dev, seo-checklist, cloudflare-deploy

## What's Remaining

- ☐ Cloudflare adapter activation + deployment
- ☐ Blog page (deferred)
- ☐ i18n architecture (for future German market)
- ☐ Newsletter form backend (currently static)
- ☐ Performance optimization (caching, image lazy loading)
- ☐ Dark mode support (design system has dark tokens defined)
- ☐ shadcn/ui base components (directory exists, not populated)
