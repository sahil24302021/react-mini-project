/**
 * color.ts — TypeScript Type Definitions
 * 
 * All interfaces and types used throughout Palette Studio.
 * Keeping types in a separate file ensures:
 *   1. Clean separation of data shapes vs. logic
 *   2. Single source of truth — any component can import from here
 *   3. Better IDE autocompletion and compile-time safety
 */

/** Red, Green, Blue color channels (0–255 each) */
export interface RGB { r: number; g: number; b: number }

/** Hue (0–360°), Saturation (0–100%), Lightness (0–100%) */
export interface HSL { h: number; s: number; l: number }

/** The four harmony types derived from color theory */
export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split'

/** A single color swatch in a generated palette */
export interface ColorSwatch {
  hex: string          // The color in HEX notation (e.g., "#FF6B35")
  mood: string         // Human-readable mood name (e.g., "Ember")
  relation: HarmonyType // How this color relates to the base color
}

/** WCAG contrast ratio result */
export interface ColorContrast {
  ratio: number  // The contrast ratio (e.g., 4.5)
  AA: boolean    // Passes WCAG AA (>= 4.5:1 for normal text)
  AAA: boolean   // Passes WCAG AAA (>= 7.0:1 for enhanced)
}

/** The complete data object for a generated color */
export interface GeneratedColor {
  hex: string              // Primary color in HEX
  rgb: RGB                 // RGB breakdown
  hsl: HSL                 // HSL breakdown
  mood: string             // Mood classification
  palette: ColorSwatch[]   // 4 harmonic swatches
  isLight: boolean         // Whether text on this bg should be dark
  contrast: ColorContrast  // WCAG accessibility data
  timestamp: number        // When this color was generated
  id: string               // Unique identifier for React keys
}

/** Formats the user can copy a color in */
export type CopyFormat = 'hex' | 'rgb' | 'hsl'

/** Code export formats available in the export panel */
export type ExportFormat = 'css' | 'json' | 'tailwind' | 'scss' | 'compose' | 'swiftui'
