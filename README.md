# Palette Studio

A production-grade color palette generator — not a college project.

## Stack

| Layer | Tech |
|---|---|
| Framework | Vite + React 18 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Routing | React Router v6 |
| State | React Context API |

## Pages

| Route | Description |
|---|---|
| `/` | Studio — generate, copy, export colors |
| `/explore` | Browse 80+ curated colors, filter by mood & tone |
| `/saved` | Your saved palette collection |
| `/docs` | Color theory, shortcuts, export formats |

## Run Locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build

```bash
npm run build    # TypeScript check + Vite build
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── types/color.ts              # Shared TypeScript interfaces
├── utils/colorUtils.ts         # Color math engine
├── context/ColorContext.tsx    # Global state (React Context)
├── hooks/                      # (extensible)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav, mobile menu, animated logo
│   │   ├── Footer.tsx          # Multi-column footer, live color badge
│   │   └── PageLayout.tsx      # Wraps all pages with Navbar + Footer
│   ├── ui/
│   │   ├── Icons.tsx           # Full SVG icon set
│   │   └── Button.tsx          # Reusable button (3 variants, 3 sizes)
│   └── sections/
│       ├── HeroSection.tsx     # Hero with color card, format chips, CTAs
│       ├── PaletteSection.tsx  # Harmonic palette + export panel (CSS/JSON/Tailwind)
│       └── HistorySection.tsx  # Scrollable recent colors rail
├── pages/
│   ├── HomePage.tsx
│   ├── ExplorePage.tsx         # Filter by mood + tone
│   ├── SavedPage.tsx           # Collection manager
│   ├── DocsPage.tsx
│   └── NotFoundPage.tsx
├── App.tsx                     # BrowserRouter + Routes
├── main.tsx                    # Entry point
└── index.css                   # Tailwind + design tokens + noise texture
```

## Features

- **Color Theory Engine** — Complementary, Analogous, Triadic, Split-Complementary
- **3 Copy Formats** — HEX, RGB, HSL
- **3 Export Formats** — CSS Variables, JSON, Tailwind Config
- **Explore Page** — 80+ colors filterable by mood and saturation
- **Saved Collection** — Bookmark colors, export all as CSS
- **Navigation** — Sticky navbar, mobile hamburger menu, animated logo
- **Footer** — Multi-column with live color indicator
- **Keyboard Shortcuts** — Space / ⌘G to generate
- **React Router** — 4 pages with 404 fallback
- **Global Context** — Color state shared across all pages
- **Framer Motion** — Spring animations, layout animations, AnimatePresence
- **Fully TypeScript** — Strict mode, zero `any`
