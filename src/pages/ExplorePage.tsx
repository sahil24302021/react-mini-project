import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import PageLayout from '@/components/layout/PageLayout'
import { useColor } from '@/context/ColorContext'
import { hslToHex, getColorMood, isColorLight } from '@/utils/colorUtils'
import { CheckIcon, BookmarkIcon } from '@/components/ui/Icons'
import { buildGeneratedColor } from '@/utils/colorUtils'

const MOODS = ['All', 'Vermillion', 'Ember', 'Aureate', 'Citrine', 'Verdant', 'Malachite', 'Glacial', 'Cerulean', 'Cobalt', 'Amethyst', 'Mauve']
const SATURATIONS = [
  { label: 'Vivid',   s: 85, lRange: [40, 60] },
  { label: 'Muted',   s: 35, lRange: [35, 65] },
  { label: 'Pastel',  s: 55, lRange: [70, 85] },
  { label: 'Deep',    s: 70, lRange: [20, 38] },
]

function generateMoodGrid() {
  const colors: Array<{ hex: string; mood: string; h: number; s: number; l: number }> = []
  for (let h = 0; h < 360; h += 18) {
    for (const sat of SATURATIONS) {
      const l = sat.lRange[0] + Math.floor(Math.random() * (sat.lRange[1] - sat.lRange[0]))
      const hex = hslToHex(h, sat.s, l)
      colors.push({ hex, mood: getColorMood(hex), h, s: sat.s, l })
    }
  }
  return colors
}

const ALL_COLORS = generateMoodGrid()

export default function ExplorePage() {
  const { copyText, copied, saveColor } = useColor()
  const [activeMood, setActiveMood] = useState('All')
  const [activeSat, setActiveSat]   = useState('All')

  const filtered = useMemo(() => {
    return ALL_COLORS.filter(c => {
      const moodOk = activeMood === 'All' || c.mood === activeMood
      const satOk  = activeSat  === 'All' || SATURATIONS.find(s => s.label === activeSat)?.s === c.s
      return moodOk && satOk
    })
  }, [activeMood, activeSat])

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 flex flex-col gap-12">
        {/* Page header */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Explore</span>
          <h1 className="font-display text-5xl md:text-6xl" style={{ color: 'var(--text)' }}>
            Browse by <em>Mood</em>
          </h1>
          <p className="text-base" style={{ color: 'var(--text-2)', maxWidth: 480 }}>
            {ALL_COLORS.length} curated colors across every hue, saturation, and lightness. Click any to copy.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {/* Mood filter */}
          <div className="flex gap-2 flex-wrap">
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => setActiveMood(mood)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-ui font-medium transition-all duration-200 cursor-pointer no-select border"
                style={{
                  background:   activeMood === mood ? 'var(--text)' : 'transparent',
                  color:        activeMood === mood ? 'var(--canvas)' : 'var(--text-2)',
                  borderColor:  activeMood === mood ? 'transparent' : 'var(--border)',
                }}
              >
                {mood}
              </button>
            ))}
          </div>

          {/* Saturation filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="section-label">Tone:</span>
            {['All', ...SATURATIONS.map(s => s.label)].map(sat => (
              <button
                key={sat}
                onClick={() => setActiveSat(sat)}
                className="px-3 py-1 rounded-lg text-[11px] font-ui font-medium transition-all duration-200 cursor-pointer no-select"
                style={{
                  background: activeSat === sat ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeSat === sat ? 'var(--text)' : 'var(--text-3)',
                }}
              >
                {sat}
              </button>
            ))}
            <span className="ml-auto section-label">{filtered.length} colors</span>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          key={activeMood + activeSat}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filtered.map((c, i) => {
            const light    = isColorLight(c.hex)
            const isCopied = copied === c.hex
            return (
              <motion.div
                key={c.hex + i}
                className="group relative rounded-xl overflow-hidden cursor-pointer no-select"
                style={{ aspectRatio: '1/1.3' }}
                whileHover={{ y: -4, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {/* Color fill */}
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: c.hex }}
                  onClick={() => copyText(c.hex)}
                />

                {/* Bottom meta */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                >
                  <p className="font-mono text-[8px] text-white/80 leading-tight">{c.hex}</p>
                </div>

                {/* Save button */}
                <button
                  onClick={e => { e.stopPropagation(); saveColor(buildGeneratedColor(c.hex)) }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.35)', color: light ? 'rgba(0,0,0,0.7)' : 'white' }}
                >
                  <BookmarkIcon size={10} />
                </button>

                {/* Copied badge */}
                {isCopied && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <CheckIcon size={18} className="text-white" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </PageLayout>
  )
}
