# WhatsDiscount Client - Project Context

> UK coupon/voucher site | Astro 5 + React 19 + Tailwind 4 | Cloudflare Pages
> Design: Premium Retail Intelligence (Electric Red + Midnight Navy + Glassmorphism)

## Quick Start

```bash
npm install && cp .env.example .env.local && npm run dev
```

| Variable | Value |
|----------|-------|
| `CMS_API_URL` | `https://ecc.cgs-api.me` |
| `SITE_ID` | `whatsdiscount.co.uk` |
| `IMG_URL` | `https://pics.dibsale.com/cdn-cgi/image/width=360/` |
| `BASE_URL` | `https://www.whatsdiscount.co.uk` |

## Structure

```
src/
├── lib/
│   ├── cms-client.ts       # 14 API functions, 2h store cache, coupon enrichment
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # getImageUrl, encodeCouponLink, extractDiscountInfo, formatDate
├── layouts/BaseLayout.astro    # HTML shell + Header/Footer + Organization JSON-LD
├── components/
│   ├── Header.astro        # Sticky nav: logo (SVG) + CMS menu + search
│   ├── Footer.astro        # 3-col: logo + quick links + share buttons (X/Facebook)
│   ├── SEO.astro           # Meta, OG, Twitter, hreflang, JSON-LD
│   ├── SearchDrawer.tsx    # React search modal
│   ├── CouponCard.astro    # Ticket (15/60/25) | List variant
│   ├── StoreCard.astro     # Circular logo + name + voucher count
│   ├── FeaturedBrands.astro    # 3-col image cards with dark overlay
│   ├── HeroStats.astro         # Homepage hero stats
│   ├── ValueProps.astro        # 3-col value propositions
│   └── FAQSection.astro        # Accordion
└── pages/
    ├── index.astro             # Hero → Brands → Coupons → Stores → ValueProps → FAQ → Newsletter
    ├── discount/[domain].astro # Store: brand header + stats + tickets + sidebar
    ├── detail/[pid].astro      # Coupon: ticket + code box + copy + how-to-use
    ├── tag-[category].astro    # Category: coupons filtered by tag
    ├── stores.astro            # All stores list
    ├── about.astro             # Brand story + trust metrics
    ├── contact.astro           # Contact info + form (mailto fallback) + FAQ
    ├── privacy.astro           # Privacy policy (GDPR compliant)
    ├── terms.astro             # Terms of use + disclaimer
    ├── imprint.astro           # Legal imprint + company details
    ├── sitemap.xml.ts          # Dynamic sitemap
    └── api/r.ts                # 302 affiliate redirect
```

## CMS API (Base: `https://ecc.cgs-api.me`)

All calls include `X-Site-Id: whatsdiscount.co.uk`. See `API.md` for full docs.

| Function | Endpoint | Used By |
|----------|----------|---------|
| `getTopMenus()` | `/api/site/decoration?key=layout-top-menus` | Header nav |
| `getPopularBrands()` | `/api/site/decoration?key=index-popular-brands` | Homepage |
| `getSiteStats()` | `/api/site/stats` | Homepage Hero |
| `getLatestCoupons(n)` | `/api/site/coupons/latest?limit=n` | Homepage |
| `getPopularStores(n)` | `/api/site/stores/popular?limit=n` | Homepage |
| `getStoreDetail(domain)` | `/api/site/stores/:domain` | Store page (2h cache) |
| `getRelatedStores(domain, n)` | `/api/site/stores/:domain/related?limit=n` | Store sidebar |
| `getCouponsByTag(tag)` | `/api/site/coupons/by-tag?tag=xxx` | Category page |
| `getAllStoreDomains()` | `/api/site/stores/all-domains` | Sitemap |
| `getRedirectUrl(domain)` | `/api/site/stores/:domain/redirect-url` | /api/r.ts |
| `searchStores(kwds, n)` | `/api/site/stores/search?kwds=xxx` | SearchDrawer |

## Key Types

```typescript
Coupon { id, title, type: 'code'|'deal', code, disInfo, description?, isValid?, expireDate?, usesToday?, successRate?, avgSaving? }
CouponWithSiteStore extends Coupon { siteStore: SiteStoreSummary }
SiteStoreSummary { id, domain, name, logoPic, affiliateUrl, couponCount? }
SiteStoreDetail { id, domain, name, logoPic, tags, coupons, savingTips, faqs, about, seo, lastUpdateAt?, successRate? }
SEO { title, keywords, description, h1, isFallback }
DecorationBrand { domain, pic, logo, name }
TopMenuItem { name, path }
```

## Key Conventions

### Coupon Link Encoding
`encodeCouponLink(domain, couponId)` → `btoa(${domain}&${couponId})` → `/detail/${encodedId}`

### Discount Extraction
`extractDiscountInfo(text)` extracts value + type from verbose titles:
- "Save 15% on Your Order" → `{ value: "15%", type: "Save" }`
- "Get $10 Off Your Purchase" → `{ value: "$10", type: "Off" }`

### Image URLs
`getImageUrl(logoPic)` → `${IMG_URL}${logoPic}`

### SEO Pattern
- All pages: `<Fragment slot="head"><SEO .../></Fragment>`
- `SEO.astro`: title, description, canonical, OG, Twitter, hreflang (en-GB + x-default), JSON-LD
- Store pages: `@graph` for BreadcrumbList + FAQPage
- Detail pages: `@graph` for BreadcrumbList + Offer (priceCurrency: GBP)
- BaseLayout: site-wide Organization JSON-LD

### Routing
- `/discount/[domain]` — Store page (SSR)
- `/detail/[pid]` — Coupon detail (SSR, pid = base64 `domain&couponId`)
- `/tag-[category]` — Category page (SSR)
- `/api/r?code={base64}` or `?domain=xxx` — 302 affiliate redirect

## Design Tokens (see DESIGN.md for full system)

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#ac001e` | CTAs, accents |
| `primary-hover` | `#d90429` | Hover state |
| `midnight-navy` | `#2B2D42` | Footer, dark sections |
| `surface` | `#fff8f7` | Page background |
| `on-surface` | `#291716` | Primary text |
| `on-surface-variant` | `#5d3f3d` | Secondary text |
| `slate-gray` | `#9ca3af` | Light text on dark backgrounds |

### Key CSS Classes
| Class | Purpose |
|-------|---------|
| `.glass-panel` | `bg-white/70 backdrop-blur-xl border border-white/20` |
| `.digital-ticket` | Side-cut notch via mask-image |
| `.shimmer-sweep` | Hover shimmer animation |
| `.btn-primary` | Red CTA button |
| `.btn-code-reveal` | Code reveal with peel effect |
| `.card` | `bg-white/70 backdrop-blur-md border border-white/20 rounded-xl` |

## Development Rules

See `AGENTS.md` for full rules. Key points:
- TypeScript strict mode, no `any`
- Tailwind utility classes only, no inline styles
- UK English spelling
- All API calls in try/catch with fallback UI
- Run `npm run build` after changes

## Deployment

```bash
npm run build && wrangler pages deploy dist
```

Set env vars in Cloudflare Pages dashboard. Add `@astrojs/cloudflare` adapter to `astro.config.mjs`.

## Status

### Done
- ✅ Core: Astro 5 + React 19 + Tailwind 4 + TypeScript strict
- ✅ CMS API client (14 functions, 2h cache, coupon enrichment)
- ✅ 10 pages + sitemap + API routes
- ✅ SEO: hreflang, JSON-LD (Organization, BreadcrumbList, Offer, FAQPage)
- ✅ Design: Red/Navy colors, glassmorphism, digital ticket, mesh gradient
- ✅ Logo: SVG text logo + favicon (discount tag shape)
- ✅ Share buttons: X + Facebook in footer

### Remaining
- ☐ Cloudflare adapter activation + deployment
- ☐ Blog page
- ☐ i18n architecture (German market)
- ☐ Newsletter form backend
- ☐ Explicit image dimensions (CLS prevention)
- ☐ Dark mode
