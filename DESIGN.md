# Design System - WhatsDiscount

> UK coupon aggregation site design system, inspired by hotukdeals.co.uk and vouchercodes.co.uk

## Design Principles

1. **Trust-first**: Clean, professional design that builds user confidence
2. **Action-oriented**: Clear CTAs that guide users to redeem codes
3. **Scannable**: Users can quickly find relevant deals
4. **Mobile-first**: Majority of traffic is mobile

## Color Palette

### Primary Colors
```
--color-primary: #2563eb (blue-600)
--color-primary-hover: #1d4ed8 (blue-700)
--color-primary-light: #dbeafe (blue-100)
```

### Semantic Colors
```
--color-success: #16a34a (green-600)    - Valid codes, savings
--color-warning: #f59e0b (amber-500)    - Expiring soon, limited
--color-error: #dc2626 (red-600)        - Expired, invalid
--color-info: #0891b2 (cyan-600)        - Tips, info
```

### Neutral Colors
```
--color-gray-50: #f9fafb   - Page background
--color-gray-100: #f3f4f6  - Card backgrounds
--color-gray-200: #e5e7eb  - Borders
--color-gray-300: #d1d5db  - Disabled
--color-gray-400: #9ca3af  - Placeholder text
--color-gray-500: #6b7280  - Secondary text
--color-gray-600: #4b5563  - Body text
--color-gray-700: #374151  - Headings
--color-gray-800: #1f2937  - Strong headings
--color-gray-900: #111827  - Darkest
```

### White & Black
```
--color-white: #ffffff
--color-black: #000000
```

## Typography

### Font Family
```
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
--font-mono: 'Fira Code', 'Courier New', monospace (for coupon codes)
```

### Font Sizes (Mobile-first)
```
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
--text-4xl: 2.25rem (36px)
```

### Font Weights
```
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Line Heights
```
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.625
```

## Spacing Scale

Base unit: 4px (0.25rem)

```
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.25rem (20px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
--space-20: 5rem (80px)
--space-24: 6rem (96px)
```

## Border Radius

```
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-full: 9999px
```

## Shadows

```
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
```

## Layout

### Container
```
max-width: 1280px (xl)
padding: 1rem (mobile) / 1.5rem (tablet) / 2rem (desktop)
```

### Grid
- Store cards: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Category tags: flex wrap with gap-2

### Section Spacing
```
Section padding: py-8 md:py-12
Between sections: space-y-8 md:space-y-12
```

## Component Specifications

### Header
- Height: 64px (mobile) / 72px (desktop)
- Background: white
- Border: bottom 1px gray-200
- Logo: left aligned
- Navigation: center (tags)
- Search: right
- Sticky: yes (top-0)

### Footer
- Background: gray-900
- Text: gray-300
- Links: gray-400 hover white
- Padding: py-12
- Columns: 2 (mobile) / 4 (desktop)

### Coupon Card

**Code Type** (has coupon code):
```
Layout: Horizontal flex (mobile: stacked)
Left: Store logo (64x64) + store name
Center: Title + description + code reveal
Right: "Show Code" button (primary) + "Go to Store" link
Background: white
Border: 1px gray-200
Border-radius: lg
Hover: shadow-md
```

**Deal Type** (no code, direct link):
```
Same as above but button says "Get Deal"
Code section shows discount info instead
```

### Store Card (for category pages)
```
Layout: Vertical card
Top: Store logo (80x80)
Middle: Store name + coupon count
Bottom: "View Deals" button
Background: white
Border: 1px gray-200
Border-radius: lg
Hover: shadow-md
```

### Buttons

**Primary (Show Code / Get Deal)**
```
Background: blue-600
Text: white
Padding: px-6 py-3
Border-radius: md
Font: font-semibold
Hover: blue-700
Active: blue-800
Focus: ring-2 ring-blue-500 ring-offset-2
```

**Secondary (Go to Store)**
```
Background: transparent
Text: blue-600
Border: 1px blue-600
Padding: px-4 py-2
Border-radius: md
Hover: blue-50
```

**Ghost (Tags, Links)**
```
Background: transparent
Text: gray-600
Padding: px-3 py-1
Border-radius: full
Hover: gray-100
```

### Tags / Categories
```
Background: gray-100
Text: gray-700
Padding: px-3 py-1
Border-radius: full
Font: text-sm
Hover: gray-200
Active: blue-100 text-blue-700
```

### Search Input
```
Width: 100% (mobile) / 320px (desktop)
Height: 44px
Padding: px-4
Border: 1px gray-300
Border-radius: md
Focus: ring-2 ring-blue-500 border-blue-500
Placeholder: gray-400
```

### Badge
```
Verified: green-100 text-green-700
Expiring: amber-100 text-amber-700
New: blue-100 text-blue-700
Popular: purple-100 text-purple-700
```

## Responsive Breakpoints

```
sm: 640px   - Large phones
md: 768px   - Tablets
lg: 1024px  - Small laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

## Icon System

Use inline SVG or heroicons. Size conventions:
- Small: 16px (inline with text)
- Medium: 24px (standalone)
- Large: 32px (feature icons)

## Animation

### Transitions
```
Default: transition-all duration-200 ease-in-out
Fast: duration-150
Slow: duration-300
```

### Micro-interactions
- Button hover: scale + shadow
- Card hover: shadow lift
- Code reveal: expand animation
- Search drawer: slide down

## Accessibility

- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Focus states on all interactive elements
- Keyboard navigation support
- ARIA labels on icon buttons
- Skip to main content link
- Screen reader friendly
