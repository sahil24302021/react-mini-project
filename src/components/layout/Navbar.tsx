/**
 * Navbar.tsx — Responsive Navigation Bar
 * 
 * Features:
 *   - Scroll-responsive: transforms from full-width transparent bar to a floating
 *     glassmorphic capsule (pill shape) when user scrolls past 20px
 *   - Active route indicator: animated golden underline using Framer Motion's layoutId
 *   - Mobile: full-screen overlay menu with staggered entry animations
 *   - Dynamic logo: colored square animates to match the current generated color
 */
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useColor } from '@/context/ColorContext'

const NAV_LINKS = [
  { label: 'Studio',   href: '/'         },
  { label: 'Explore',  href: '/explore'  },
  { label: 'Saved',    href: '/saved'    },
  { label: 'Docs',     href: '/docs'     },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { color } = useColor()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 pt-6">
        <motion.header
          className="pointer-events-auto transition-all duration-500"
          style={{
            width: scrolled ? '800px' : '100%',
            maxWidth: '1152px',
            background: scrolled ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            backdropFilter: scrolled ? 'blur(24px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
            border: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
            borderRadius: scrolled ? '100px' : '0px',
            boxShadow: scrolled ? '0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.05)' : 'none',
          }}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="px-5 md:px-8 h-16 flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-select">
            <motion.div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-medium"
              animate={{ backgroundColor: color.hex }}
              transition={{ duration: 0.8 }}
              style={{ color: color.isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)' }}
            >
              P
            </motion.div>
            <span className="font-ui font-semibold text-[15px] tracking-tight text-[var(--text)]">
              Palette<span className="text-[var(--text-3)]"> Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="nav-link"
                style={{ color: pathname === href ? 'var(--text)' : 'var(--text-2)' }}
              >
                {label}
                {pathname === href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px"
                    style={{ background: 'var(--gold)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-widest text-[var(--text-3)]">
              ⌘ + G
            </span>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 no-select"
              style={{
                background: 'var(--text)',
                color: 'var(--canvas)',
              }}
            >
              Open Studio
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            aria-label="Menu"
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="h-px w-5 bg-[var(--text)]"
                animate={menuOpen
                  ? i === 0 ? { rotate: 45,  y: 8 }
                  : i === 1 ? { opacity: 0 }
                  : { rotate: -45, y: -8 }
                  : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.22 }}
              />
            ))}
          </button>
        </div>
        </motion.header>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col pt-16 md:hidden"
            style={{ background: 'rgba(6,6,8,0.97)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col items-center justify-center flex-1 gap-8">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={href}
                    className="font-display text-4xl italic"
                    style={{ color: pathname === href ? 'var(--gold)' : 'var(--text)' }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
