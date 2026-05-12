/**
 * colorUtils.js — Core Color Science & Utility Library
 * 
 * This module contains ALL the color math for Palette Studio. It handles:
 *   1. Color space conversions (HEX ↔ RGB ↔ HSL)
 *   2. Color analysis (lightness detection, mood classification, WCAG contrast)
 *   3. Color vision deficiency simulation (protanopia, deuteranopia, tritanopia)
 *   4. Harmonic palette generation using color theory (complementary, analogous, triadic, split)
 *   5. Export formatters (CSS, JSON, Tailwind, SCSS, SwiftUI, Jetpack Compose)
 * 
 * No external dependencies — all calculations are done with pure math.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: COLOR SPACE CONVERSIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert a HEX color string to RGB values.
 * 
 * How it works:
 *   - Strips the '#' prefix if present
 *   - Takes pairs of hex digits (e.g., "FF" = 255, "00" = 0)
 *   - Converts each pair from base-16 to base-10 using parseInt
 * 
 * Example: "#FF6B35" → { r: 255, g: 107, b: 53 }
 */
export function hexToRgb(hex) {
  const c = hex.replace('#', '')
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  }
}

/**
 * Convert RGB values to a HEX string.
 * 
 * How it works:
 *   - Clamps each channel to [0, 255]
 *   - Converts to base-16 and pads to 2 digits
 *   - Joins all three channels with a '#' prefix
 * 
 * Example: (255, 107, 53) → "#FF6B35"
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
    .join('').toUpperCase()
}

/**
 * Convert RGB to HSL (Hue, Saturation, Lightness).
 * 
 * Algorithm (standard):
 *   1. Normalize RGB values to [0, 1] range
 *   2. Find the maximum and minimum channel values
 *   3. Lightness = average of max + min
 *   4. Saturation depends on whether lightness is above or below 0.5
 *   5. Hue is calculated based on which channel is dominant:
 *      - Red dominant   → hue between yellow and magenta
 *      - Green dominant → hue between cyan and yellow
 *      - Blue dominant  → hue between magenta and cyan
 * 
 * Returns: { h: 0-360, s: 0-100, l: 0-100 }
 */
export function rgbToHsl(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

/**
 * Convert HSL values to a HEX string.
 * 
 * Uses the CSS Color Module Level 4 algorithm:
 *   1. Calculate the chroma (a = saturation * min(lightness, 1-lightness))
 *   2. For each RGB channel, compute piecewise using the k-value formula
 *   3. k = (n + hue/30) mod 12, then clamp the intermediate result
 * 
 * Example: (25, 85, 55) → "#E87A2C"
 */
export function hslToHex(h, s, l) {
  const sn = s / 100, ln = l / 100
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0').toUpperCase()
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: COLOR ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Determine if a color is "light" (for choosing foreground text color).
 * 
 * Uses the WCAG relative luminance formula:
 *   L = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear
 * 
 * The coefficients reflect human eye sensitivity (we see green most, blue least).
 * sRGB gamma is removed via the linearization step (c / 12.92 or ((c+0.055)/1.055)^2.4).
 * Returns true if luminance > 0.35 (threshold chosen for good readability).
 */
export function isColorLight(hex) {
  const { r, g, b } = hexToRgb(hex)
  const toL = (c) => { const n = c / 255; return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4) }
  return (0.2126 * toL(r) + 0.7152 * toL(g) + 0.0722 * toL(b)) > 0.35
}

/**
 * Classify a color into an evocative "mood" name based on its HSL values.
 * 
 * The mood system uses hue ranges from the color wheel:
 *   0°–15°  / 345°–360° → Vermillion (reds)
 *   15°–30°  → Ember (orange-reds)
 *   30°–50°  → Aureate (golds)
 *   50°–70°  → Citrine (yellows)
 *   70°–100° → Verdant (yellow-greens)
 *   100°–150° → Malachite (greens)
 *   150°–185° → Glacial (teals)
 *   185°–220° → Cerulean (blues)
 *   220°–255° → Cobalt (deep blues)
 *   255°–285° → Amethyst (purples)
 *   285°–315° → Mauve (pink-purples)
 *   315°–345° → Carmine (pinks)
 * 
 * Special cases for very dark (Void), very light (Celestial),
 * and desaturated colors (Obsidian / Lunar).
 */
export function getColorMood(hex) {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  if (l < 8)  return 'Void'
  if (l > 93) return 'Celestial'
  if (s < 8)  return l < 45 ? 'Obsidian' : 'Lunar'
  if (h < 15 || h >= 345) return 'Vermillion'
  if (h < 30)  return 'Ember'
  if (h < 50)  return 'Aureate'
  if (h < 70)  return 'Citrine'
  if (h < 100) return 'Verdant'
  if (h < 150) return 'Malachite'
  if (h < 185) return 'Glacial'
  if (h < 220) return 'Cerulean'
  if (h < 255) return 'Cobalt'
  if (h < 285) return 'Amethyst'
  if (h < 315) return 'Mauve'
  return 'Carmine'
}

/**
 * Calculate the relative luminance of an RGB color.
 * Used internally by WCAG contrast calculation.
 * Follows the W3C formula: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG 2.1 contrast ratio against both white and black.
 * 
 * The formula: (L1 + 0.05) / (L2 + 0.05) where L1 > L2
 * 
 * Returns the higher contrast ratio plus whether it passes:
 *   - AA: ratio >= 4.5:1 (normal text)
 *   - AAA: ratio >= 7.0:1 (enhanced accessibility)
 */
export function getWCAGContrast(hex) {
  const { r, g, b } = hexToRgb(hex);
  const l1 = getLuminance(r, g, b);
  const whiteContrast = (1 + 0.05) / (l1 + 0.05);
  const blackContrast = (l1 + 0.05) / (0 + 0.05);
  const ratio = Math.max(whiteContrast, blackContrast);
  return {
    ratio: Number(ratio.toFixed(2)),
    AA: ratio >= 4.5,
    AAA: ratio >= 7.0
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: COLOR VISION DEFICIENCY (CVD) SIMULATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Simulate how a color appears to people with color vision deficiency.
 * 
 * Uses transformation matrices based on Brettel, Viénot & Mollon (1997):
 *   - Protanopia: reduced red cone sensitivity (~1.3% of males)
 *   - Deuteranopia: reduced green cone sensitivity (~1.2% of males)
 *   - Tritanopia: reduced blue cone sensitivity (~0.01% of population)
 * 
 * Each matrix remaps the RGB channels to approximate what the affected
 * person would perceive. This is used in the accessibility checker UI.
 */
export function simulateCVD(hex, type) {
  const { r, g, b } = hexToRgb(hex);
  let [nr, ng, nb] = [r, g, b];

  if (type === 'protanopia') {
    nr = 0.56667 * r + 0.43333 * g + 0.00000 * b;
    ng = 0.55833 * r + 0.44167 * g + 0.00000 * b;
    nb = 0.00000 * r + 0.24167 * g + 0.75833 * b;
  } else if (type === 'deuteranopia') {
    nr = 0.62500 * r + 0.37500 * g + 0.00000 * b;
    ng = 0.70000 * r + 0.30000 * g + 0.00000 * b;
    nb = 0.00000 * r + 0.30000 * g + 0.70000 * b;
  } else if (type === 'tritanopia') {
    nr = 0.95000 * r + 0.05000 * g + 0.00000 * b;
    ng = 0.00000 * r + 0.43333 * g + 0.56667 * b;
    nb = 0.00000 * r + 0.47500 * g + 0.52500 * b;
  }
  
  return rgbToHex(nr, ng, nb);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: HARMONIC PALETTE GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/** Utility: clamp a value between a min and max */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

/**
 * Generate a 4-color harmonic palette from a base color.
 * 
 * Color Theory Applied:
 *   Each harmony type offsets the hue by a specific amount on the 360° color wheel:
 * 
 *   ┌──────────────┬─────────┬───────────────────────────────────────┐
 *   │ Relation     │ Hue Δ   │ Purpose                               │
 *   ├──────────────┼─────────┼───────────────────────────────────────┤
 *   │ Complementary│ +180°   │ Maximum contrast, visual tension      │
 *   │ Analogous    │ +30°    │ Cohesive, soothing combinations       │
 *   │ Triadic      │ +120°   │ Vibrant, balanced, three-way harmony  │
 *   │ Split        │ +210°   │ Nuanced alternative to complementary  │
 *   └──────────────┴─────────┴───────────────────────────────────────┘
 * 
 * Saturation and lightness are also adjusted slightly (ds, dl) to create
 * more visually pleasing results than pure hue rotation alone.
 * All values are clamped to safe ranges to prevent washed-out or too-dark colors.
 */
export function generateHarmonicPalette(hex) {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const defs = [
    { relation: 'complementary', dh: 180, ds: 0,   dl: 0   },
    { relation: 'analogous',     dh: 30,  ds: -5,  dl: 8   },
    { relation: 'triadic',       dh: 120, ds: 5,   dl: -5  },
    { relation: 'split',         dh: 210, ds: -10, dl: 12  },
  ]
  return defs.map(({ relation, dh, ds, dl }) => {
    const nh = (h + dh) % 360
    const ns = clamp(s + ds, 15, 95)
    const nl = clamp(l + dl, 12, 88)
    const nhex = hslToHex(nh, ns, nl)
    return { hex: nhex, mood: getColorMood(nhex), relation }
  })
}

/**
 * Generate a random HEX color with controlled saturation and lightness.
 * 
 * Instead of fully random RGB (which produces many muddy/dark colors),
 * we randomize in HSL space with constraints:
 *   - Hue: full 0–360° range
 *   - Saturation: 30–95% (avoids washed-out grays)
 *   - Lightness: 22–72% (avoids pure black/white)
 */
export function generateRandomHex() {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 65) + 30
  const l = Math.floor(Math.random() * 50) + 22
  return hslToHex(h, s, l)
}

/**
 * Build a complete GeneratedColor object from a HEX string.
 * 
 * This is the "factory function" that creates the full data structure used
 * throughout the application. It computes all derived values:
 *   - RGB and HSL conversions
 *   - Mood classification
 *   - 4-color harmonic palette
 *   - Lightness flag (for choosing text color)
 *   - WCAG contrast ratios
 *   - Unique ID and timestamp
 */
export function buildGeneratedColor(hex) {
  const upper = (hex.startsWith('#') ? hex : `#${hex}`).toUpperCase()
  const rgb = hexToRgb(upper)
  return {
    hex: upper,
    rgb,
    hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
    mood: getColorMood(upper),
    palette: generateHarmonicPalette(upper),
    isLight: isColorLight(upper),
    contrast: getWCAGContrast(upper),
    timestamp: Date.now(),
    id: Math.random().toString(36).slice(2, 9),
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: FORMAT HELPERS & EXPORT GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

/** Format an RGB object as a CSS rgb() string */
export const formatRgb  = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`
/** Format an HSL object as a CSS hsl() string */
export const formatHsl  = ({ h, s, l }) => `hsl(${h}, ${s}%, ${l}%)`

/** Export as CSS Custom Properties (:root block) */
export function exportCss(color) {
  return `:root {\n  --color-primary: ${color.hex};\n  --color-primary-rgb: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b};\n  --color-primary-hsl: ${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%;\n${color.palette.map((s, i) => `  --color-${s.relation}: ${s.hex};`).join('\n')}\n}`
}

/** Export as a structured JSON object */
export function exportJson(color) {
  return JSON.stringify({
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl,
    mood: color.mood,
    palette: color.palette.map(s => ({ hex: s.hex, relation: s.relation, mood: s.mood })),
  }, null, 2)
}

/** Export as Tailwind CSS config (colors extend block) */
export function exportTailwind(color) {
  const entries = [
    `        primary: '${color.hex}',`,
    ...color.palette.map(s => `        '${s.relation}': '${s.hex}',`),
  ].join('\n')
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      },\n    },\n  },\n}`
}

/** Export as SCSS variables */
export function exportScss(color) {
  return `$color-primary: ${color.hex};\n` +
         color.palette.map(s => `$color-${s.relation}: ${s.hex};`).join('\n');
}

/** Export as SwiftUI Color extensions */
export function exportSwiftUI(color) {
  return `import SwiftUI\n\nextension Color {\n  static let primary = Color(hex: "${color.hex}")\n` +
         color.palette.map(s => `  static let ${s.relation} = Color(hex: "${s.hex}")`).join('\n') +
         `\n}`;
}

/** Export as Jetpack Compose Color definitions */
export function exportCompose(color) {
  const toCompose = (hex) => `Color(0xFF${hex.replace('#', '')})`;
  return `import androidx.compose.ui.graphics.Color\n\nval PrimaryColor = ${toCompose(color.hex)}\n` +
         color.palette.map(s => `val ${s.relation.charAt(0).toUpperCase() + s.relation.slice(1)}Color = ${toCompose(s.hex)}`).join('\n');
}
