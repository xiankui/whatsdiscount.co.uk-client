# Design System - WhatsDiscount

> UK coupon aggregation site | Premium Retail Intelligence aesthetic
> Inspired by Linear precision + modern Fintech trust

## Design Principles

1. **Premium Retail Intelligence** — Clinical precision meets sophisticated trust
2. **Glassmorphism** — Strategic translucency for navigation and overlays
3. **Digital Ticket Metaphor** — Side-cut notch cards for vouchers
4. **Atmospheric Texture** — Subtle noise grain + dynamic mesh gradients
5. **UK Focus** — `DD/MM/YYYY`, `£`, British English throughout

## Color Palette

### Primary
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#ac001e` | Hero actions, CTAs, urgent alerts |
| `primary-hover` | `#d90429` | Hover state |
| `primary-light` | `#ffdad7` | Light backgrounds |
| `primary-container` | `#d90429` | Badge backgrounds |

### Brand
| Token | Value | Usage |
|-------|-------|-------|
| `midnight-navy` | `#2B2D42` | Deep backgrounds, footer, headings |
| `surface` | `#fff8f7` | Page background |
| `on-surface` | `#291716` | Primary text |
| `on-surface-variant` | `#5d3f3d` | Secondary text |

### Surface Containers
| Token | Value |
|-------|-------|
| `surface-container-lowest` | `#ffffff` |
| `surface-container-low` | `#fff0ef` |
| `surface-container` | `#ffe9e7` |
| `surface-container-high` | `#ffe1df` |
| `surface-container-highest` | `#fddbd8` |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `tertiary` | `#005a7d` | Trust badges, info |
| `success` | `#16a34a` | Verified, valid |
| `warning` | `#f59e0b` | Expiring soon |
| `error` | `#ba1a1a` | Expired, invalid |

### Borders & Outlines
| Token | Value |
|-------|-------|
| `outline-variant` | `#e7bcba` |

## Typography

### Font Family
- **Primary**: System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`)
- **Mono**: `'Fira Code', 'Courier New'` (coupon codes)

### Font Sizes
| Level | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Display Hero | 64px | 800 | 1.1 |
| Heading 1 | 40px | 700 | 1.2 |
| Heading 2 | 24px | 600 | 1.3 |
| Body Large | 18px | 400 | 1.6 |
| Body Main | 16px | 400 | 1.5 |
| Label Caps | 12px | 600 | 1.4 (uppercase, tracking-wider) |

## Spacing

| Token | Value |
|-------|-------|
| `gutter` | 24px |
| `margin-desktop` | 32px |
| `margin-mobile` | 16px |
| `container-max` | 1280px |

## Border Radius

| Token | Value |
|-------|-------|
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 0.75rem |
| `full` | 9999px |

## Component Specifications

### Glass Panel
```
bg-white/70 backdrop-blur-xl border border-white/20
shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
rounded-xl
```

### Digital Ticket (Voucher Card)
```
mask-image: radial-gradient(circle at 0 50%, transparent 12px, black 13px),
            radial-gradient(circle at 100% 50%, transparent 12px, black 13px)
mask-composite: intersect
```
- Left section: discount value (large, bold, primary color)
- Center: title, description, verified badge
- Right: action button (Get Code / Get Deal)

### Shimmer Sweep (Hover Effect)
```css
.shimmer-sweep::after {
  background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0));
  transform: rotate(30deg);
  transition: left 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.shimmer-sweep:hover::after { left: 130%; }
```

### Split Action Button (Detail Page)
- Primary: "Copy & Visit" — copies code + opens store in new tab
- Secondary: external link icon
- Shows "Code Copied!" feedback on click
- Button text changes to code for 3 seconds

### Buttons
| Type | Style |
|------|-------|
| Primary | `bg-primary text-white rounded-lg hover:bg-primary-hover` |
| Secondary | `border border-primary text-primary hover:bg-primary/5` |
| Split | Two-part button with divider |

### Badges
| Type | Style |
|------|-------|
| Verified | `bg-primary/10 text-primary border border-primary/20 rounded-full` |
| Category Tag | `bg-white border border-outline-variant/30 hover:bg-primary hover:text-white` |

## Background

### Mesh Gradient
```css
background-image: 
  radial-gradient(at 0% 0%, rgba(172, 0, 30, 0.04) 0px, transparent 50%),
  radial-gradient(at 100% 0%, rgba(0, 90, 125, 0.04) 0px, transparent 50%),
  radial-gradient(at 100% 100%, rgba(217, 4, 41, 0.03) 0px, transparent 50%),
  radial-gradient(at 0% 100%, rgba(43, 45, 66, 0.03) 0px, transparent 50%);
```

### Grain Overlay
SVG noise filter at 3% opacity, fixed position, pointer-events none.

## Layout

### Header
- Height: 80px
- Background: `bg-white/80 backdrop-blur-xl`
- Sticky: top-0
- Logo: left, bold, primary color, tracking-tighter
- Navigation: center (from CMS)
- Search: right

### Footer
- Background: `midnight-navy`
- 3 columns: Brand info, Quick Links, Social
- Bottom bar: copyright + "Made with ♥ for UK shoppers"

## Animation

| Token | Duration | Easing |
|-------|----------|--------|
| Short | 200ms | ease-in-out |
| Medium | 400ms | cubic-bezier(0.19, 1, 0.22, 1) |
| Long | 700ms | cubic-bezier(0.19, 1, 0.22, 1) |

## Accessibility

- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Focus states on all interactive elements
- Keyboard navigation support
- ARIA labels on icon buttons
- Screen reader friendly
