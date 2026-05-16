---
name: seo-checklist
description: Use ONLY when implementing SEO optimization, meta tags, structured data, or GEO improvements for the UK coupon site. Covers JSON-LD templates, meta tag patterns, and search engine optimization workflows.
---

# SEO & GEO Checklist

## Target Market

- Primary: United Kingdom (en-GB)
- Secondary consideration: Germany (de-DE) - architecture should support future expansion
- Currency: GBP (£)
- Date format: DD/MM/YYYY (display), ISO 8601 (data)

## Page SEO Requirements

### Every Page Must Have
- [ ] `<title>` - 50-60 characters, keyword-rich
- [ ] `<meta name="description">` - 150-160 characters, action-oriented
- [ ] `<link rel="canonical">` - self-referencing canonical URL
- [ ] Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- [ ] Twitter Card tags (twitter:card, twitter:title, twitter:description)
- [ ] `<meta name="robots" content="index, follow">`
- [ ] H1 tag (exactly one per page)
- [ ] Proper heading hierarchy (H1 > H2 > H3)

### Homepage `/`
```
Title: "WhatsDiscount - Verified UK Promo Codes & Voucher Codes {Month Year}"
Description: "Save money with hand-tested promo codes from 3,000+ UK stores. Get verified voucher codes, exclusive deals, and discount offers updated daily."
H1: "Today's Best UK Voucher Codes & Promo Codes"
```

### Store Page `/discount/[domain]`
```
Title: Use CMS-provided seo.title (e.g., "Adidas UK Promo Code: 30% Off - May 2026")
Description: Use CMS-provided seo.description
H1: Use CMS-provided seo.h1
Keywords: Use CMS-provided seo.keywords
```

### Category Page `/tag-[category]`
```
Title: "{Category} Voucher Codes & Promo Codes - May 2026 | WhatsDiscount"
Description: "Browse verified {category} voucher codes and promo codes. Save money at top UK {category} stores with exclusive discounts and deals."
H1: "{Category} Voucher Codes & Deals"
```

### Static Pages
```
/about: "About Us - WhatsDiscount UK"
/contact: "Contact Us - WhatsDiscount"
/privacy: "Privacy Policy - WhatsDiscount"
/terms: "Terms of Use - WhatsDiscount"
/imprint: "Imprint - WhatsDiscount"
```

## JSON-LD Structured Data

### Organization (All Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WhatsDiscount",
  "url": "https://www.whatsdiscount.co.uk",
  "logo": "https://www.whatsdiscount.co.uk/logo.png",
  "sameAs": []
}
```

### BreadcrumbList (Store, Category, Detail Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.whatsdiscount.co.uk/" },
    { "@type": "ListItem", "position": 2, "name": "Fashion", "item": "https://www.whatsdiscount.co.uk/tag-fashion" }
  ]
}
```

### FAQPage (Store Pages with FAQs)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I find the latest Adidas UK promo codes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To find the latest Adidas UK promo codes, check our page for verified offers..."
      }
    }
  ]
}
```

### ItemList (Category Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Fashion Voucher Codes",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "WebPage",
        "name": "Nike UK",
        "url": "https://www.whatsdiscount.co.uk/discount/nike.com"
      }
    }
  ]
}
```

### WebSite (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "WhatsDiscount",
  "url": "https://www.whatsdiscount.co.uk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.whatsdiscount.co.uk/discount/{search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## GEO (Generative Engine Optimization)

### Principles
1. **Answer-first content**: Start sections with direct answers
2. **FAQ format**: Use question-answer pairs for common queries
3. **Structured data**: Help AI engines understand content
4. **Entity-rich content**: Mention brands, products, categories explicitly
5. **Trust signals**: "Verified", "Tested", "Updated [date]"

### Implementation
- Include "Last Updated: [date]" on store pages
- Use "Verified" badges for valid coupons
- Write comprehensive FAQ sections
- Include "How to use this code" step-by-step guides
- Add "About [Store]" sections with entity-rich descriptions

## Technical SEO

### Sitemap
- Generate `/sitemap.xml` with all store pages
- Include static pages
- Update on content changes
- Submit to Google Search Console

### Robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://www.whatsdiscount.co.uk/sitemap.xml
```

### Performance Targets
- Lighthouse Performance: > 90
- Lighthouse SEO: 100
- Lighthouse Accessibility: > 90
- Lighthouse Best Practices: > 90

### Image Optimization
- Use WebP format where possible
- Lazy load below-fold images
- Add descriptive alt text
- Use `loading="lazy"` attribute
- Specify width/height to prevent CLS

## SEO Component

Create `src/components/SEO.astro` that accepts:
- `title`: string
- `description`: string
- `keywords?`: string
- `image?`: string (OG image)
- `canonical`: string
- `structuredData?`: JSON-LD object
- `type`: 'website' | 'article' | 'product'

## Review Checklist

Before deploying any page:
- [ ] Title length 50-60 chars
- [ ] Description length 150-160 chars
- [ ] Exactly one H1
- [ ] Canonical URL set
- [ ] OG tags present
- [ ] Structured data valid (test with Google Rich Results Test)
- [ ] No broken internal links
- [ ] Images have alt text
- [ ] Mobile-friendly (test with Google Mobile-Friendly Test)
- [ ] Page loads in < 3 seconds
