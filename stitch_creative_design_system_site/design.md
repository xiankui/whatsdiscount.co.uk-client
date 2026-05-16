# Design System: whatsdiscount.co.uk

## 1. Visual Identity & Vibe
*   **Aesthetic:** "Premium Retail Intelligence" — merging the clinical precision of Linear with the sophisticated trust of modern Fintech.
*   **Core Concepts:**
    *   **Glassmorphism:** Strategic use of translucency for navigation and overlays.
    *   **Bento Layout:** Asymmetrical, high-information-density grids for brand discovery.
    *   **Atmospheric Texture:** Subtle noise grain overlay with dynamic mesh gradients.
    *   **UK Focus:** Deep cultural cues via color and formatting (`DD/MM/YYYY`, `£`).

## 2. Design Tokens

### Color Palette (Material 3 Adaptive)
| Token | Value (Light) | Value (Dark) | Description |
| :--- | :--- | :--- | :--- |
| `--sys-color-primary` | `#D90429` (Electric UK Red) | `#EF233C` | Hero actions & urgent alerts |
| `--sys-color-on-primary` | `#FFFFFF` | `#FFFFFF` | Text on primary |
| `--sys-color-secondary` | `#2B2D42` (Midnight Navy) | `#8D99AE` | Brand grounding & deep UI elements |
| `--sys-color-surface` | `#F8F9FA` | `#0B0C10` | Base background |
| `--sys-color-surface-container` | `rgba(255, 255, 255, 0.7)` | `rgba(15, 17, 26, 0.7)` | Glass containers (Blur: 16px) |
| `--sys-color-outline` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.1)` | Subtle borders |

### Spacing & Geometry
*   **`--radius-none`:** `0px`
*   **`--radius-sm`:** `8px`
*   **`--radius-md`:** `16px` (Standard components)
*   **`--radius-lg`:** `24px` (Large cards/containers)
*   **`--radius-full`:** `9999px` (Pills/Search bars)
*   **`--spacing-unit`:** `4px`
*   **`--container-max-width`:** `1280px`

## 3. Typography System
*   **Primary Font:** Variable Sans-Serif (e.g., Inter or Geist).
*   **Weight Mapping:** Regular (400), Medium (500), SemiBold (600), Bold (800).

| Level | Size | Weight | Line Height | Case |
| :--- | :--- | :--- | :--- | :--- |
| **Display (Hero)** | `64px` | `800` | `1.1` | Sentence |
| **Heading 1** | `40px` | `700` | `1.2` | Sentence |
| **Heading 2** | `24px` | `600` | `1.3` | Sentence |
| **Body Large** | `18px` | `400` | `1.6` | - |
| **Body Main** | `16px` | `400` | `1.5` | - |
| **Caption/Label** | `12px` | `600` | `1.4` | UPPERCASE |

## 4. Component Specifications

### The Voucher Card (Digital Ticket)
*   **Visuals:** Side-cut notch (physical voucher metaphor). 
*   **Header:** Brand Logo (circular, 48px) + Brand Name.
*   **Body:** Bold Discount Value (e.g., "20% OFF") + Short Desc.
*   **Footer:** "Verified 2h ago" (Trust Badge) + Expiry Timer.
*   **Hover State:** `translateY(-4px)`, Shadow Elevation Level 3, subtle iridescent shimmer sweep.

### Search Gateway
*   **Style:** Minimalist pill shape, 64px height.
*   **Visuals:** `backdrop-filter: blur(20px)`, thin white inner glow.
*   **Feedback:** Auto-complete dropdown with brand logos and "trending" tags.

### Split Action Button (Detail Page)
*   **Interaction:** Primary button shows "Copy & Visit".
*   **Execution:** 
    1. Click triggers "Success Tick" + Particle burst (CSS-based).
    2. Label changes to code (e.g., "SAVE20") for 3s.
    3. Silent background tab open for affiliate link.

## 5. Motion & Interaction Tokens
*   **Easing:** `cubic-bezier(0.2, 0, 0, 1)` (Standard Decelerate).
*   **Duration Short:** `200ms` (Hover, Toggle).
*   **Duration Medium:** `400ms` (Shared Element Transitions).
*   **Duration Long:** `700ms` (Page-level entry).
*   **Shared Element:** Card Logo and Background container morph into Detail Page Header.

## 6. SEO & Accessibility
*   **Semantics:** Use `<main>`, `<article>` for vouchers, `<nav>` for category bar.
*   **Alt Text:** Brand logos must include " [Brand] Discount Code Logo".
*   **Localisation:** All currency formatted as `£` using `Intl.NumberFormat('en-GB')`.
*   **Aria:** Buttons for "Copy" must announce state change to screen readers.
