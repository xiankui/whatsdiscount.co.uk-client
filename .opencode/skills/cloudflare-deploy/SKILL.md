---
name: cloudflare-deploy
description: Use ONLY when configuring Cloudflare Pages deployment, SSR settings, environment variables, or deployment workflows for the Astro project.
---

# Cloudflare Pages Deployment

## Platform

- **Hosting**: Cloudflare Pages
- **Mode**: SSR (Server-Side Rendering)
- **Framework**: Astro
- **Adapter**: `@astrojs/cloudflare`

## Project Configuration

### astro.config.mjs
```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),
  ],
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://www.whatsdiscount.co.uk',
});
```

### Key Settings
- `output: 'server'` - Required for SSR mode
- `adapter: cloudflare()` - Cloudflare Pages adapter
- `site` - Base URL for sitemap generation

## Environment Variables

Set in Cloudflare Pages dashboard → Settings → Environment Variables:

| Variable | Production | Preview | Description |
|----------|------------|---------|-------------|
| `CMS_API_URL` | `https://ecc.cgs-api.me` | `https://ecc.cgs-api.me` | CMS API base URL |
| `SITE_ID` | `whatsdiscount.co.uk` | `whatsdiscount.co.uk-preview` | Site identifier |
| `IMG_URL` | `https://pics.dibsale.com/cdn-cgi/image/width=360/` | same | Image CDN base URL |
| `BASE_URL` | `https://www.whatsdiscount.co.uk` | auto-generated | Site base URL |

## Build Settings

In Cloudflare Pages dashboard:

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js version**: 22 (or latest LTS)

## Deployment Workflow

### Manual Deployment (Git)
1. Push to main branch → auto-deploy to production
2. Push to other branches → auto-deploy to preview
3. Cloudflare Pages detects Astro config and builds automatically

### CLI Deployment (wrangler)
```bash
# Install wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
npm run build
wrangler pages deploy dist --project-name=whatsdiscount

# Or use npm script
npm run deploy
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "npm run build && wrangler pages deploy dist"
  }
}
```

## SSR Considerations

### API Routes
- Astro API routes (`src/pages/api/*.ts`) work as Cloudflare Workers
- Keep functions lightweight (Cloudflare Worker limits apply)
- Use Cloudflare KV for caching if needed (not required initially)

### Caching Strategy
- Static assets: Cloudflare CDN handles automatically
- API responses: Implement cache headers in API routes
- Page caching: Use Cloudflare cache rules for static pages

### Limits to Keep in Mind
- Worker CPU time: 10ms (free) / 50ms (paid) per request
- Worker memory: 128MB
- Response size: 25MB
- KV reads: 100,000/day (free)

## Custom Domains

1. Add domain in Cloudflare Pages dashboard
2. Configure DNS records (CNAME to `<project>.pages.dev`)
3. SSL certificate auto-provisioned
4. Wait for DNS propagation

## Preview Deployments

- Every PR gets a unique preview URL
- Share preview links in PR descriptions
- Preview environments have isolated env vars

## Monitoring

- **Analytics**: Cloudflare Pages provides basic analytics
- **Logs**: Cloudflare Workers Logs (if enabled)
- **Errors**: Implement error tracking (Sentry, etc.)

## Rollback

1. Go to Cloudflare Pages dashboard
2. Select deployment history
3. Click "Retry" on previous successful deployment
4. Instant rollback

## Checklist Before Deploy

- [ ] All env vars configured in Cloudflare dashboard
- [ ] `npm run build` succeeds locally
- [ ] `npm run preview` works correctly
- [ ] No console errors in browser
- [ ] All pages render correctly
- [ ] API routes respond properly
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] robots.txt present
- [ ] Custom domain configured (if applicable)
