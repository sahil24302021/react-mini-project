<div align="center">

# 🎨 Palette Studio

### Professional Color Generation, Exploration & Export Tool

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

> **Generate harmonic color palettes using pure color theory math — no APIs, no external services.**  
> Built with React + JavaScript. Zero backend. 100% client-side color science.

[**🚀 Live Demo**](#) · [**📖 How It Works**](#-the-color-science) · [**⚡ Quick Start**](#-quick-start)

</div>

---

## ✨ Features at a Glance

| Feature | Description |
|---------|-------------|
| 🎯 **One-Click Generation** | Press `Space` or click Generate — instant harmonic palette |
| 🌈 **4 Harmony Types** | Complementary, Analogous, Triadic, Split — real color theory |
| 📋 **Copy Anything** | HEX, RGB, HSL — click any chip to copy instantly |
| 🔍 **Explore 80+ Colors** | Browse by mood (Vermillion, Cerulean, Amethyst...) and tone |
| 💾 **Save & Collect** | Bookmark favorites — persisted in localStorage |
| ♿ **Accessibility Checker** | WCAG contrast ratios + color blindness simulation |
| 📦 **6 Export Formats** | CSS, SCSS, Tailwind, JSON, SwiftUI, Jetpack Compose |
| 🎨 **Gradient Generator** | Linear, radial, conic gradients from your palette |
| ⌨️ **Keyboard Shortcuts** | `Space` to generate, `⌘+G` alternative |
| 📱 **Fully Responsive** | Glassmorphic design, mobile-first, 60fps animations |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/sahil24302021/react-mini-project.git

# Navigate to project
cd react-mini-project

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open **http://localhost:5173** and press `Space` to generate your first palette! 🎉

---

## 📁 Project Structure

```
src/
├── main.jsx                          # Entry point
├── App.jsx                           # Router setup + ColorProvider
├── index.css                         # Design system (CSS variables, glass, noise)
│
├── utils/
│   └── colorUtils.js                 # 🧮 ALL color math (380+ lines of pure science)
│
├── context/
│   └── ColorContext.jsx              # 🧠 Global state (Context API + hooks)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx                # Floating glassmorphic navbar
│   │   ├── Footer.jsx                # Dynamic glow footer
│   │   └── PageLayout.jsx            # Page wrapper
│   │
│   ├── sections/
│   │   ├── HeroSection.jsx           # 3D tilt card + ambient mesh
│   │   ├── PaletteSection.jsx        # 4-swatch grid + export panel
│   │   ├── GradientSection.jsx       # Live gradient generator
│   │   └── HistorySection.jsx        # Recent colors strip
│   │
│   └── ui/
│       ├── Button.jsx                # Animated button system
│       ├── Icons.jsx                 # 14 custom SVG icons
│       └── Toast.jsx                 # Notification system
│
└── pages/
    ├── HomePage.jsx                  # Main studio page
    ├── ExplorePage.jsx               # Browse 80+ colors by mood
    ├── SavedPage.jsx                 # Bookmarked collection
    ├── DocsPage.jsx                  # How it works
    └── NotFoundPage.jsx              # 404 page
```

---

## 🧮 The Color Science

> **Everything in this app runs on pure math. No APIs, no color libraries, no external services.**

### 🔄 Color Space Conversions

The app works with **three color spaces** and converts between them freely:

```
  ┌─────────┐       ┌─────────┐       ┌─────────┐
  │   HEX   │ ←───→ │   RGB   │ ────→ │   HSL   │
  │ #FF6B35 │       │ 255,107 │       │ 25°,85% │
  │         │       │   ,53   │       │  ,55%   │
  └─────────┘       └─────────┘       └─────────┘
    Web-ready        Screen native     Human-friendly
```

| Conversion | Function | What It Does |
|------------|----------|-------------|
| HEX → RGB | `hexToRgb()` | Splits 6-char hex into 3 decimal channels using `parseInt(_, 16)` |
| RGB → HEX | `rgbToHex()` | Clamps 0–255, converts to base-16, pads to 2 digits |
| RGB → HSL | `rgbToHsl()` | Standard algorithm — finds dominant channel, computes hue sector |
| HSL → HEX | `hslToHex()` | CSS Color Level 4 algorithm with phase offsets `f(0)`, `f(8)`, `f(4)` |

### 🎯 How HSL → HEX Works (The Elegant One)

```js
function hslToHex(h, s, l) {
  const sn = s / 100, ln = l / 100
  const a = sn * Math.min(ln, 1 - ln)     // Chroma
  
  const f = (n) => {
    const k = (n + h / 30) % 12            // Phase on color wheel
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
  }
  
  return `#${f(0)}${f(8)}${f(4)}`          // Red, Green, Blue offsets
}
```

The magic numbers `0`, `8`, `4` are **phase offsets**: Red=0°, Green=120° (8×15°), Blue=240° (4×60°). One function, three channels! ✨

---

### 🌈 Harmonic Palette Generation — The Core Algorithm

Every generated color produces **4 companion colors** using established color theory:

```
        Analogous (+30°)
             ↑
             │
  Split      │      Complementary
  (+210°) ←──●──→  (+180°)
             │
             │
        Triadic (+120°)
```

```js
function generateHarmonicPalette(hex) {
  const { h, s, l } = rgbToHsl(...)
  
  const harmonies = [
    { type: 'complementary', hue: +180°, sat: +0,  light: +0  },
    { type: 'analogous',     hue: +30°,  sat: -5,  light: +8  },
    { type: 'triadic',       hue: +120°, sat: +5,  light: -5  },
    { type: 'split',         hue: +210°, sat: -10, light: +12 },
  ]
  
  // For each: rotate hue, tweak saturation/lightness, clamp to safe range
}
```

| Harmony | Hue Offset | Effect | Use Case |
|---------|:---:|--------|----------|
| **Complementary** | +180° | Maximum contrast | CTA buttons, highlights |
| **Analogous** | +30° | Gentle, cohesive | Backgrounds, supporting tones |
| **Triadic** | +120° | Vibrant, balanced | Logos, brand systems |
| **Split** | +210° | Sophisticated nuance | Elegant designs |

> **Why not just rotate hue?** Pure hue rotation can produce jarring results. The small saturation/lightness tweaks make analogous colors feel **softer**, triadic colors feel **punchy**, and split colors feel **airy**. Values are clamped to prevent washed-out or too-dark extremes.

---

### 💡 Light vs Dark Detection (WCAG Luminance)

Determines whether to show dark or light text on a color:

```js
function isColorLight(hex) {
  // Human eye sensitivity coefficients (biology!)
  const luminance = 0.2126 * Red     // 21% — moderate sensitivity
                  + 0.7152 * Green   // 72% — most sensitive
                  + 0.0722 * Blue    //  7% — least sensitive
  
  return luminance > 0.35
}
```

Our eyes have **more green-sensitive cone cells**, which is why green contributes 72% to perceived brightness.

---

### 🏷️ Mood Classification

Every color gets an evocative name based on its hue position:

```
  0°                  120°                 240°               360°
  │    Vermillion │ Aureate │ Verdant │ Cerulean │ Amethyst │ Carmine │
  ├──────┼────┼────┼────┼─────┼─────┼─────┼─────┼─────┼────┼────┤
  Red   Ember Gold Citr  Malach Glacial  Cobalt    Mauve
```

**12 mood names** mapped to hue ranges, plus 4 special cases:
- `Void` — near-black (L < 8%)
- `Celestial` — near-white (L > 93%)
- `Obsidian` — dark gray (S < 8%, L < 45%)
- `Lunar` — light gray (S < 8%, L ≥ 45%)

---

### ♿ WCAG Contrast Checker

Checks text readability against the generated color:

```
Contrast Ratio = (L_lighter + 0.05) / (L_darker + 0.05)

┌──────────┬──────────┬──────────────────────────────┐
│  Level   │  Ratio   │  Meaning                     │
├──────────┼──────────┼──────────────────────────────┤
│  AA ✅   │  ≥ 4.5   │  Normal text is readable     │
│  AAA ✅  │  ≥ 7.0   │  Enhanced accessibility      │
│  FAIL ❌ │  < 4.5   │  Text may be hard to read    │
└──────────┴──────────┴──────────────────────────────┘
```

---

### 👁️ Color Blindness Simulation

Simulates 3 types of color vision deficiency using transformation matrices:

| Type | Affects | % Population | What Happens |
|------|---------|:---:|---|
| **Protanopia** | Red cones | ~1.3% males | Reds look greenish-brown |
| **Deuteranopia** | Green cones | ~1.2% males | Greens look brownish |
| **Tritanopia** | Blue cones | ~0.01% all | Blues look greenish |

Based on published research (Brettel, Viénot & Mollon, 1997).

---

### 🎲 Smart Random Generation

```js
function generateRandomHex() {
  const h = random(0, 360)    // Any hue on the wheel
  const s = random(30, 95)    // No washed-out grays
  const l = random(22, 72)    // No near-black/white
  return hslToHex(h, s, l)
}
```

> **Why HSL instead of random RGB?** Random RGB produces mostly **muddy browns and dark grays** (statistically). By constraining in HSL space, every color is guaranteed vibrant and usable.

---

### 📦 Export Formats

| Format | Output Example | Platform |
|--------|---------------|----------|
| **CSS** | `:root { --color-primary: #FF6B35; }` | Any web project |
| **SCSS** | `$color-primary: #FF6B35;` | Sass projects |
| **Tailwind** | `colors: { primary: '#FF6B35' }` | Tailwind config |
| **JSON** | `{ "hex": "#FF6B35", "mood": "Ember" }` | APIs & databases |
| **SwiftUI** | `Color(hex: "#FF6B35")` | iOS apps |
| **Compose** | `Color(0xFFFF6B35)` | Android apps |

---

## 🏗️ Architecture

### Data Flow

```
┌──────────────────────────────────────────────────────────┐
│  User Action (Space / Click / Explore)                    │
└──────────────┬───────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────┐
│  generateRandomHex()  →  Random H, constrained S & L     │
└──────────────┬───────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────┐
│  buildGeneratedColor(hex)                                 │
│  ├── hexToRgb()        → { r, g, b }                    │
│  ├── rgbToHsl()        → { h, s, l }                    │
│  ├── getColorMood()    → "Ember"                         │
│  ├── generateHarmonicPalette()  → 4 companion colors     │
│  ├── isColorLight()    → true/false (text color)         │
│  └── getWCAGContrast() → { ratio, AA, AAA }             │
└──────────────┬───────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────┐
│  ColorContext (React Context API)                         │
│  ├── color        → Current generated color object       │
│  ├── history[]    → Last 12 colors                       │
│  ├── saved[]      → Bookmarked (localStorage, max 24)    │
│  └── actions      → generate, copy, save, remove         │
└──────────────┬───────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────┐
│  UI Components re-render with new color data              │
│  ├── HeroSection   → Big card, format chips, 3D tilt    │
│  ├── PaletteSection→ 4 harmonic swatches + export panel  │
│  ├── GradientSection→ Live gradient preview              │
│  └── HistorySection→ Recent colors strip                 │
└──────────────────────────────────────────────────────────┘
```

### State Management

- **React Context API** — single `ColorProvider` wraps the entire app
- **`useState` + `useCallback`** — optimized re-renders
- **`localStorage`** — saved colors persist across sessions
- **Keyboard listeners** — global `Space` / `⌘+G` shortcuts (disabled in inputs)

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--canvas` | `#060608` | Page background |
| `--surface` | `#0e0e12` | Card backgrounds |
| `--text` | `#ede8e0` | Primary text |
| `--gold` | `#c9a96e` | Accent highlights |
| `--border` | `rgba(255,255,255,0.06)` | Subtle borders |

**Typography:** Playfair Display (headings) · JetBrains Mono (code) · DM Sans (body)

**Effects:** Glassmorphism · Noise texture overlay · Ambient mesh blobs · 3D tilt card

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Generate new random color |
| `⌘ + G` | Generate (alternative) |
| Click any swatch | Copy HEX to clipboard |
| Click format chip | Copy RGB/HSL format |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework with hooks |
| **JavaScript (ES2020)** | No TypeScript — pure JS |
| **Vite 5** | Lightning-fast bundler |
| **Framer Motion** | Smooth 60fps animations |
| **Tailwind CSS 3** | Utility-first styling |
| **React Router 6** | Client-side routing |

**Zero external color libraries** — all 380+ lines of color math are hand-written using pure JavaScript.

---

## 📊 Build Stats

```
dist/index.html         1.08 kB │ gzip:   0.55 kB
dist/assets/index.css  22.86 kB │ gzip:   5.46 kB
dist/assets/index.js  327.34 kB │ gzip: 104.26 kB

✓ Built in ~800ms
```

---

## 🚀 Deployment

This project is configured for **Vercel** deployment:

1. Connect your GitHub repo to Vercel
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy! ✅

---

<div align="center">

### Built with ❤️ by Sahil Kumar

**Press `Space` to generate. Click to copy. Export to ship.**

⭐ Star this repo if you found it useful!

</div>
