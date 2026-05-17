# WhatsDiscount Client - Project Context

> UK coupon/voucher aggregation site | Astro 5 + React 19 + Tailwind 4 | Cloudflare Pages
> Design: Premium Retail Intelligence (Electric Red + Midnight Navy + Glassmorphism)

---

## Quick Start

```bash
npm install                          # Install deps
cp .env.example .env.local           # Copy env template, fill values
npm run dev                          # Dev server at http://localhost:4321
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
├── lib/
│   ├── cms-client.ts       # CMS API client (14 functions, 2h store cache, coupon enrichment)
│   ├── types.ts            # TypeScript interfaces for all API responses
│   └── utils.ts            # Pure helpers: getImageUrl, encode/decodeCouponLink, formatDate, slugify
├── layouts/
│   └── BaseLayout.astro    # HTML shell: Header + <main> + Footer + Organization JSON-LD + SearchDrawer
├── components/
│   ├── Header.astro        # Sticky nav with logo, CMS menu, search trigger
│   ├── Footer.astro        # 3-col: brand, links, social
│   ├── SEO.astro           # Meta, OG, Twitter, hreflang, JSON-LD
│   ├── SearchDrawer.tsx    # React: search modal, debounced API call, brand results
│   ├── CouponCard.astro    # 'ticket' (15/60/25 grid) | 'list' (vertical)
│   ├── StoreCard.astro     # Circular logo + name + voucher count
│   ├── HeroStats.astro     # Homepage hero with store/coupon counts
│   ├── FeaturedBrands.astro    # 3-col image cards with overlay
│   ├── ValueProps.astro        # 3-col: Instant Savings / Hand Verified / Exclusive Codes
│   ├── FAQSection.astro        # Accordion (no SEO component - FAQPage in homepage SEO)
│   └── ui/                     # shadcn/ui base (empty)
├── pages/
│   ├── index.astro         # Hero → Brands → Coupons → Categories → Stores → ValueProps → FAQ → Newsletter
│   ├── discount/[domain].astro  # Store: Brand header + stats + tickets + sidebar (FAQ + tips)
│   ├── detail/[pid].astro       # Coupon: Ticket + code box + copy + how-to-use
│   ├── tag-[category].astro     # Category: coupon cards filtered by tag
│   ├── stores.astro             # All stores list
│   ├── about.astro, contact.astro, privacy.astro, terms.astro, imprint.astro
│   ├── sitemap.xml.ts           # Dynamic sitemap (stores + tags + static pages)
│   └── api/
│       ├── r.ts                 # 302 redirect: /api/r?domain=xxx
│       └── site-stores.ts       # Search proxy: /api/site-stores?kwds=xxx
└── styles/
    └── global.css          # Design tokens, glass-panel, digital-ticket, shimmer-sweep
```

---

## CMS API (Base: `https://ecc.cgs-api.me`)

All calls include `X-Site-Id: whatsdiscount.co.uk` header. See `API.md` for full docs.

| Function | Endpoint | Used By |
|----------|----------|---------|
| `getTopMenus()` | `/api/site/decoration?key=layout-top-menus` | Header nav |
| `getPopularBrands()` | `/api/site/decoration?key=index-popular-brands` | Homepage |
| `getSiteStats()` | `/api/site/stats` | Homepage Hero |
| `getLatestCoupons(n)` | `/api/site/coupons/latest?limit=n` | Homepage |
| `getPopularStores(n)` | `/api/site/stores/popular?limit=n` | Homepage |
| `getStoreDetail(domain)` | `/api/site/stores/:domain` | Store + Detail pages (2h cache) |
| `getRelatedStores(domain, n)` | `/api/site/stores/:domain/related?limit=n` | Store sidebar |
| `getCouponsByTag(tag)` | `/api/site/coupons/by-tag?tag=xxx` | Category page |
| `getAllStoreDomains()` | `/api/site/stores/all-domains` | Sitemap |
| `getRedirectUrl(domain)` | `/api/site/stores/:domain/redirect-url` | /api/r.ts |
| `searchStores(kwds, n)` | `/api/site/stores/search?kwds=xxx` | SearchDrawer |
| `getDecoration(key)` | `/api/site/decoration?key=xxx` | Generic |
| `getAllDecorations()` | `/api/site/decoration` | Bulk |

---

## Key Data Types

```typescript
Coupon { id, title, type: 'code'|'deal', code, disInfo, description?, isValid?, expireDate?, usesToday?, successRate?, avgSaving? }
CouponWithSiteStore extends Coupon { siteStore: SiteStoreSummary }
SiteStoreSummary { id, domain, name, logoPic, affiliateUrl, couponCount? }
SiteStoreDetail { id, domain, name, logoPic, tags, coupons, savingTips, faqs, about, seo, lastUpdateAt?, successRate? }
SEO { title, keywords, description, h1, isFallback }
DecorationBrand { domain, pic, logo, name }
TopMenuItem { name, path }
```

---

## Key Conventions

### Coupon Link Encoding
```ts
encodeCouponLink(domain, couponId) → btoa(`${domain}&${couponId}`)
decodeCouponLink(pid) → { domain, couponId }
```

### Image URLs
```ts
getImageUrl(logoPic) → `${IMG_URL}${logoPic}`
```

### Coupon Enrichment (cms-client.ts)
- `extractDisInfo(title)` — extracts 2-word max discount text (£, %, Free, etc.)
- `generateCouponStats(id, domain)` — deterministic seeded random for usesToday/successRate/avgSaving/expireDate
- `generateStoreSuccessRate(coupons, domain)` — average of coupon rates or domain-seeded fallback
- Store detail cached 2 hours via `Map<string, {data, timestamp}>`

### SEO Pattern
All pages use `<Fragment slot="head"><SEO .../></Fragment>` to inject into `BaseLayout`.
- `SEO.astro` handles: title, description, canonical, OG, Twitter, hreflang (en-GB + x-default), JSON-LD
- `BaseLayout` injects site-wide `Organization` JSON-LD
- Store pages use `@graph` for BreadcrumbList + FAQPage
- Detail pages use `@graph` for BreadcrumbList + Offer (with priceCurrency: GBP, validThrough)
- `FAQSection.astro` does NOT render SEO component (homepage SEO already includes FAQPage)

### Routing
- `/discount/[domain]` — Store page (SSR)
- `/detail/[pid]` — Coupon detail (SSR, pid = base64 `domain&couponId`)
- `/tag-[category]` — Category page (SSR)
- `/api/r?code={base64}` or `?domain=xxx` — 302 affiliate redirect

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

### Key CSS Classes
| Class | Purpose |
|-------|---------|
| `.glass-panel` | `bg-white/70 backdrop-blur-xl border border-white/20` |
| `.digital-ticket` | `mask-image: radial-gradient(...)` side-cut notch |
| `.shimmer-sweep` | Hover shimmer animation via `::after` |
| `.btn-primary` | Red CTA button |
| `.btn-code-reveal` | Code reveal button with peel effect |
| `.badge-verified` | Primary-colored verified badge |
| `.label-caps` | `text-xs font-semibold uppercase tracking-wider` |

### Background
- Mesh gradient: 4-layer `radial-gradient` (red + navy tones)
- Grain overlay: SVG noise filter at 3% opacity, fixed, pointer-events none

---

## Development Rules (from AGENTS.md)

1. **Minimum Change** — Only modify what's necessary
2. **Component Extraction** — Split >80 lines, extract repeated patterns
3. **Type Safety** — No `any`, typed API responses, typed props
4. **Single Responsibility** — Pages: data fetching; Components: rendering; Lib: pure utilities
5. **Build Verification** — Run `npm run build` after every change
6. **Naming** — PascalCase components, kebab-case files, camelCase variables
7. **Tailwind Only** — No inline styles, no CSS modules
8. **Error Boundaries** — All API calls have try/catch, fallback UI
9. **UK English** — "voucher", "favour", "colour"
10. **i18n Ready** — Extract display strings for future German market

---

## Deployment (Cloudflare Pages)

1. Add `@astrojs/cloudflare` adapter to `astro.config.mjs`
2. Set env vars in Cloudflare Pages dashboard
3. `npm run build && wrangler pages deploy dist`

---

## What's Done

- ✅ Project setup (Astro 5, React 19, Tailwind 4, TypeScript strict)
- ✅ CMS API client (14 functions, 2h store cache, coupon enrichment with seeded random)
- ✅ All 10 pages: Homepage, Store, Detail, Category, Stores, 5 static pages
- ✅ API routes: `/api/r` (redirect), `/api/site-stores` (search proxy)
- ✅ Dynamic sitemap generation
- ✅ Search Drawer (React, debounced, logo fallback to initials)
- ✅ SEO: hreflang (en-GB), Organization JSON-LD, BreadcrumbList, Offer schema, FAQPage
- ✅ Design system: Red/Navy colors, glassmorphism, digital ticket, shimmer, mesh gradient
- ✅ CouponCard: 15/60/25 grid layout (ticket variant), enlarged logo, full-width mobile buttons
- ✅ Header: grouped nav with logo
- ✅ Store page: successRate, store.seo.h1, CMS-driven FAQ accordion
- ✅ Detail page: code display + copy button, stats footer
- ✅ opencode skills: frontend-dev, seo-checklist, cloudflare-deploy

## Remaining / Future

- ☐ Cloudflare adapter activation + deployment
- ☐ Blog page (deferred)
- ☐ i18n architecture (German market)
- ☐ Newsletter form backend
- ☐ Explicit image width/height (CLS prevention)
- ☐ Dark mode (design tokens defined)
- ☐ shadcn/ui base components
