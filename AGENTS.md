# WhatsDiscount Client - Development Guide

> UK coupon aggregation site | Astro + React + Tailwind CSS | Cloudflare Pages

**⚡ FIRST: Read `CONTEXT.md` for a compressed project overview — it contains everything you need to start working immediately.**

## Project Overview

WhatsDiscount is a coupon/voucher aggregation website targeting the UK market. The site aggregates promo codes and deals from various retailers, presenting them in a user-friendly format optimized for SEO and conversions.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Astro 5.x (SSR mode) |
| UI Library | React 19.x |
| Styling | Tailwind CSS 4.x |
| Components | shadcn/ui + Radix UI |
| Deployment | Cloudflare Pages |
| Language | TypeScript (strict) |
| CMS API | RESTful JSON API |

## Project Structure

```
whatsdiscount-client/
├── .opencode/
│   └── skills/           # opencode skills
│       ├── frontend-dev/
│       ├── seo-checklist/
│       └── cloudflare-deploy/
├── public/               # Static assets
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── components/       # React & Astro components
│   │   └── ui/           # shadcn/ui components
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utilities
│   │   ├── cms-client.ts # CMS API client
│   │   ├── types.ts      # TypeScript types
│   │   └── utils.ts      # Helper functions
│   ├── pages/            # File-based routing
│   │   ├── api/          # API routes
│   │   ├── discount/     # Store pages
│   │   └── detail/       # Coupon detail pages
│   └── styles/           # Global styles
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── AGENTS.md             # This file
├── DESIGN.md             # Design system
├── TODO.md               # Development plan
├── API.md                # API documentation
└── requirements.md       # Requirements
```

## Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run deploy       # Build and deploy to Cloudflare Pages
```

## Development Workflow

### 1. Plan Before Coding
- Read requirements in `requirements.md`, `API.md`, `website-structure.md`
- Check `TODO.md` for current task status
- Review `DESIGN.md` for UI specifications
- Load relevant skills (frontend-dev, seo-checklist)

### 2. Code Conventions
- TypeScript strict mode - no `any`
- PascalCase for components, kebab-case for files
- Astro components for static content, React for interactive
- Tailwind utility classes only - no inline styles
- Extract reusable logic to `src/lib/`

### 3. API Integration
- All CMS API calls through `src/lib/cms-client.ts`
- Server-side calls in Astro pages/components
- Client-side fetch only for interactive features (search)
- Handle loading and error states

### 4. SEO Requirements
- Every page must have SEO component
- Use CMS-provided SEO data when available
- Add structured data (JSON-LD) where applicable
- Follow `seo-checklist` skill guidelines

### 5. Testing
- Test on mobile, tablet, desktop viewports
- Verify all links work
- Check Lighthouse scores
- Validate structured data with Google Rich Results Test

## CMS API Integration

Base URL: `https://ecc.cgs-api.me`

All API calls include `X-Site-Id` header. See `API.md` for full documentation.

Key endpoints:
- `GET /api/site/tags` - All tags (header navigation)
- `GET /api/site/stores/:domain` - Store detail page
- `GET /api/site/coupons/latest` - Latest coupons
- `GET /api/site/stores/popular` - Popular stores

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CMS_API_URL` | CMS API base URL | `https://ecc.cgs-api.me` |
| `SITE_ID` | Site identifier | `whatsdiscount.co.uk` |
| `IMG_URL` | Image CDN base | `https://pics.dibsale.com/cdn-cgi/image/width=360/` |
| `BASE_URL` | Site domain | `https://www.whatsdiscount.co.uk` |

## Important Conventions

### Image URLs
All images use the `IMG_URL` prefix:
```ts
const logoUrl = `${IMG_URL}${store.logoPic}`;
```

### Coupon Link Encoding
Store page coupon buttons use Base64 encoding:
```ts
const encodedId = btoa(`${domain}&${couponId}`);
const link = `/api/r?code=${encodedId}`;
```

### Coupon Detail Page
Detail page decodes the `pid` parameter:
```ts
const [domain, couponId] = atob(pid).split('&');
```

### UK English
Use British English spelling throughout:
- colour (not color)
- favour (not favor)
- voucher (not coupon, where appropriate)

### i18n Readiness
Structure code for future German market support:
- Extract display strings
- Use consistent date/currency formatting
- Avoid hardcoded UK-specific text in components

## Coding Principles

### 1. Minimum Change
- Only modify what is necessary to solve the current task
- Do not refactor unrelated code "while you're at it"
- If you notice a bug unrelated to the task, report it but do not fix it unless asked

### 2. Component Extraction
- Extract reusable UI patterns into separate components
- If a component exceeds 80 lines, consider splitting it
- If the same JSX pattern appears 2+ times, extract it

### 3. Type Safety
- Never use `any` - use `unknown` or proper types
- Every API response must have a corresponding TypeScript interface
- Every component prop must have a typed interface
- Use `as const` for literal unions when appropriate

### 4. Single Responsibility
- Pages: data fetching + layout composition
- Components: rendering + interaction logic
- Lib: pure utility functions, no side effects
- API routes: request handling + response formatting

### 5. Build Verification
- After every code change, run `npm run build` to verify
- Do not proceed to the next task if the build fails
- Fix build errors before asking for review

### 6. Naming Conventions
- Components: PascalCase (`CouponCard`)
- Files: kebab-case (`coupon-card.astro`) - except for index pages
- Variables/functions: camelCase (`encodeCouponLink`)
- Constants: UPPER_SNAKE_CASE (`CMS_API_BASE`)
- Types/interfaces: PascalCase (`SiteStoreDetail`)

### 7. Tailwind Only
- Use only Tailwind utility classes
- No inline styles (`style="..."`)
- No CSS modules
- Custom animations go in `src/styles/global.css` under `@layer components`

### 8. Error Boundaries
- Every API call must have try/catch
- Provide fallback UI for empty/error states
- Never let unhandled errors reach the user

## Code Review Checklist

Before committing:
- [ ] TypeScript compiles without errors
- [ ] No `any` types used
- [ ] Tailwind classes follow DESIGN.md
- [ ] Component is responsive
- [ ] SEO meta tags present
- [ ] Accessibility basics covered (aria labels, keyboard nav)
- [ ] No console errors
- [ ] Works on mobile viewport

## When in Doubt

1. Check `TODO.md` for task context
2. Review `DESIGN.md` for UI specs
3. Load relevant skill with `/skill` command
4. Ask the user for clarification
