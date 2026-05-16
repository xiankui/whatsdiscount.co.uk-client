---
name: frontend-dev
description: Use ONLY when developing frontend components, pages, or UI for the Astro + React + Tailwind CSS project. Covers component creation patterns, styling conventions, and API integration workflows.
---

# Frontend Development Skill

## Tech Stack

- **Framework**: Astro 5.x with SSR
- **UI Library**: React 19.x (embedded in Astro)
- **Styling**: Tailwind CSS 4.x
- **Component Library**: shadcn/ui + Radix UI primitives
- **Deployment**: Cloudflare Pages

## Project Structure

```
src/
├── components/     # React (.tsx) and Astro (.astro) components
│   ├── ui/         # shadcn/ui base components
│   └── ...         # feature components
├── layouts/        # Page layouts
├── pages/          # File-based routing
│   ├── api/        # API routes
│   ├── discount/   # Dynamic routes
│   ├── detail/     # Dynamic routes
│   └── ...
├── lib/            # Utilities, API client, types
└── styles/         # Global styles
```

## Component Development Workflow

### 1. Plan
- Identify component purpose and props
- Check if existing component can be extended
- Determine if Astro or React component is needed

**Astro vs React decision**:
- Use **Astro components** for static content, layouts, pages
- Use **React components** for interactive elements (search drawer, accordions, modals, carousels)

### 2. Create
- Create component file: `src/components/ComponentName.tsx` (React) or `ComponentName.astro` (Astro)
- Follow naming convention: PascalCase for components, kebab-case for files
- Use TypeScript strictly - no `any`
- Export as default for pages, named export for components

### 3. Styling
- Use Tailwind utility classes exclusively
- No inline styles
- No CSS modules
- For complex animations, use `@keyframes` in `src/styles/global.css`

### 4. API Integration
- All CMS API calls go through `src/lib/cms-client.ts`
- Never call `fetch` directly to CMS API in components
- Use Astro's `getStaticPaths` or server-side code for data fetching
- Client-side fetch only for interactive features (search drawer)

### 5. Review Checklist
- [ ] TypeScript types are complete
- [ ] No `any` types
- [ ] Tailwind classes follow project conventions
- [ ] Component is responsive
- [ ] Accessibility (aria labels, keyboard navigation)
- [ ] SEO meta tags if it's a page component

## Tailwind CSS Conventions

### Color Palette
- Primary: `blue-600` / `blue-700` (CTA buttons, links)
- Success: `green-600` (valid coupons)
- Warning: `amber-500` (expiring soon)
- Error: `red-600` (invalid/expired)
- Neutral: `gray-50` to `gray-900`

### Spacing
- Use Tailwind spacing scale (1 = 0.25rem)
- Section padding: `py-8 md:py-12`
- Card padding: `p-4 md:p-6`
- Gap between items: `gap-4 md:gap-6`

### Responsive Breakpoints
- Mobile first: default = mobile
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

## shadcn/ui Usage

- Install components via `npx shadcn@latest add <component>`
- Components live in `src/components/ui/`
- Customize theme in `src/styles/globals.css`
- Prefer Radix primitives for custom interactive components

## Code Examples

### Astro Page Component
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { cmsGet } from '../lib/cms-client';
import type { StoreDetail } from '../lib/types';

const store = await cmsGet<StoreDetail>(`/api/site/stores/${domain}`);
---

<BaseLayout title={store.seo.title} description={store.seo.description}>
  <h1>{store.seo.h1}</h1>
  {/* Page content */}
</BaseLayout>
```

### React Interactive Component
```tsx
import { useState } from 'react';

interface Props {
  items: Array<{ title: string; content: string }>;
}

export function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border rounded-lg">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-4 text-left font-medium"
            aria-expanded={openIndex === index}
          >
            {item.title}
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-gray-600">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Important Notes

- All images use `IMG_URL` env var prefix: `${IMG_URL}${logoPic}`
- Base64 encoding for coupon links: `btoa(`${domain}&${couponId}`)`
- UK English spelling throughout (colour, favour, etc.)
- i18n-ready: extract strings for future German market support
