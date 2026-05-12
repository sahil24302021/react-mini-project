/**
 * Footer.jsx — Site Footer Component
 * 
 * Features:
 *   - Dynamic glow line: uses the current color to create an animated
 *     gradient line at the top of the footer
 *   - Live color badge: shows the currently active color + mood
 *   - Navigation links organized by category (Product, Resources)
 *   - Responsive grid layout (stacks on mobile, columns on desktop)
 */
import { Link } from 'react-router-dom'
import { useColor } from '@/context/ColorContext'
import { motion } from 'framer-motion'

const LINKS = {
  Product: [
    { label: 'Studio',        href: '/'        },
    { label: 'Explore',       href: '/explore' },
    { label: 'Saved Palettes',href: '/saved'   },
    { label: 'Documentation', href: '/docs'    },
  ],
  Resources: [
    { label: 'Color Theory',  href: '/docs#theory'     },
    { label: 'Keyboard Shortcuts', href: '/docs#keys'  },
    { label: 'Export Formats',href: '/docs#export'     },
    { label: 'Color Formats', href: '/docs#api'        },
  ],
}

export default function Footer() {
  const { color } = useColor()

  return (
    <footer className="relative border-t mt-24" style={{ borderColor: 'var(--border)' }}>
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/3 pointer-events-none"
        animate={{ background: `linear-gradient(90deg, transparent, ${color.hex}80, transparent)` }}
        transition={{ duration: 1 }}
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <motion.div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-mono text-sm font-medium"
                animate={{ backgroundColor: color.hex }}
                transition={{ duration: 0.8 }}
                style={{ color: color.isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)' }}
              >
                P
              </motion.div>
              <span className="font-ui font-semibold text-base text-[var(--text)]">
                Palette Studio
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: 280 }}>
              A professional-grade color tool for designers and developers. Generate, explore, and export beautiful palettes.
            </p>
            <div className="flex items-center gap-2.5 self-start glass px-3 py-2 rounded-xl">
              <motion.div
                className="w-3 h-3 rounded-full"
                animate={{ backgroundColor: color.hex, boxShadow: `0 0 8px ${color.hex}` }}
                transition={{ duration: 0.6 }}
              />
              <span className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>
                {color.hex} · {color.mood}
              </span>
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-4">
              <h4 className="section-label">{group}</h4>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className="text-sm transition-colors duration-200 hover:text-[var(--text)]"
                      style={{ color: 'var(--text-2)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="font-mono text-[11px] tracking-wider" style={{ color: 'var(--text-3)' }}>
            © 2025 Palette Studio. Built with React + JavaScript.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] tracking-widest" style={{ color: 'var(--text-3)' }}>
              PRESS SPACE TO GENERATE
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
