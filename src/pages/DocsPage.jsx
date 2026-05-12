import { motion } from 'framer-motion'
import PageLayout from '@/components/layout/PageLayout'

const sections = [
  {
    id: 'keys',
    title: 'Keyboard Shortcuts',
    content: [
      { key: 'Space',      desc: 'Generate a new random color' },
      { key: '⌘ G',        desc: 'Generate a new random color (alternative)' },
      { key: 'Click swatch', desc: 'Copy HEX to clipboard' },
      { key: 'Click chip',   desc: 'Copy RGB or HSL format' },
    ],
    type: 'keys',
  },
  {
    id: 'theory',
    title: 'Color Theory',
    type: 'text',
    body: `Every generated color produces four harmonics based on established color theory:\n\nComplementary — The color directly opposite on the hue wheel (180°). Creates maximum contrast and visual tension. Best for call-to-action elements against a background.\n\nAnalogous — A nearby hue (30° offset) with slightly adjusted saturation and lightness. Creates a gentle, cohesive feel. Great for backgrounds and supporting tones.\n\nTriadic — A hue 120° away. Triadic schemes are vibrant yet balanced — commonly used in logos and brand systems.\n\nSplit — A hue at 210°. More nuanced than complementary, the split harmony adds sophistication while keeping visual interest.`,
  },
  {
    id: 'export',
    title: 'Export Formats',
    type: 'text',
    body: `Three export formats are available from the palette section:\n\nCSS Custom Properties — Generates a :root {} block with all colors as CSS variables. Drop it into any stylesheet. Includes the primary color plus all four harmonic swatches.\n\nJSON — A structured object with full color data including hex, rgb, hsl, mood name, and the full palette. Useful for storing palettes in a database or consuming via an API.\n\nTailwind Config — Outputs a ready-to-use colors block for your tailwind.config.js file. Extend your design system with one paste.`,
  },
  {
    id: 'api',
    title: 'Color Formats',
    content: [
      { key: 'HEX',  desc: '#RRGGBB — 6-digit hexadecimal. Universal. Works everywhere.' },
      { key: 'RGB',  desc: 'rgb(r, g, b) — Red, green, blue 0–255. Native to CSS and canvas.' },
      { key: 'HSL',  desc: 'hsl(h, s%, l%) — Hue 0–360°, Saturation 0–100%, Lightness 0–100%. Most human-readable.' },
    ],
    type: 'keys',
  },
]

export default function DocsPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-16 flex flex-col gap-16">
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Documentation</span>
          <h1 className="font-display text-5xl md:text-6xl" style={{ color: 'var(--text)' }}>
            How it <em>Works</em>
          </h1>
          <p className="text-base" style={{ color: 'var(--text-2)' }}>
            Everything you need to know about Palette Studio.
          </p>
        </motion.div>

        {sections.map((sec, i) => (
          <motion.section
            key={sec.id}
            id={sec.id}
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-3xl" style={{ color: 'var(--text)' }}>{sec.title}</h2>
              <div className="h-px w-12 mt-1" style={{ background: 'var(--gold)' }} />
            </div>

            {sec.type === 'keys' && sec.content && (
              <div className="flex flex-col gap-2">
                {sec.content.map(({ key, desc }) => (
                  <div key={key} className="flex items-start gap-5 glass px-5 py-4 rounded-xl">
                    <code className="font-mono text-xs px-2.5 py-1.5 rounded-lg flex-shrink-0"
                      style={{ background: 'var(--surface-3)', color: 'var(--gold)', minWidth: 100, textAlign: 'center' }}>
                      {key}
                    </code>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', paddingTop: 4 }}>{desc}</p>
                  </div>
                ))}
              </div>
            )}

            {sec.type === 'text' && sec.body && (
              <div className="flex flex-col gap-4">
                {sec.body.trim().split('\n\n').map((para, pi) => (
                  <p key={pi} className="text-sm leading-relaxed" style={{ color: para.includes('—') ? 'var(--text)' : 'var(--text-2)' }}>
                    {para.includes('—') ? (
                      <>
                        <strong className="font-semibold" style={{ color: 'var(--text)' }}>
                          {para.split('—')[0].trim()}
                        </strong>
                        <span style={{ color: 'var(--text-3)' }}> — </span>
                        <span style={{ color: 'var(--text-2)' }}>{para.split('—').slice(1).join('—').trim()}</span>
                      </>
                    ) : para}
                  </p>
                ))}
              </div>
            )}
          </motion.section>
        ))}
      </div>
    </PageLayout>
  )
}
