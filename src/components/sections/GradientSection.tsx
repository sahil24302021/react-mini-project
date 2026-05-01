import { useState } from 'react'
import { motion } from 'framer-motion'
import { useColor } from '@/context/ColorContext'
import { CopyIcon, CheckIcon } from '@/components/ui/Icons'

type GradType = 'linear' | 'radial' | 'conic'

export default function GradientSection() {
  const { color, copied, copyText } = useColor()
  const [type, setType] = useState<GradType>('linear')
  const [angle, setAngle] = useState(135)

  // Use primary and a couple of palette colors
  const c1 = color.hex
  const c2 = color.palette.find(p => p.relation === 'analogous')?.hex || color.palette[0].hex
  const c3 = color.palette.find(p => p.relation === 'triadic')?.hex   || color.palette[1].hex

  let cssBackground = ''
  if (type === 'linear') cssBackground = `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`
  else if (type === 'radial') cssBackground = `radial-gradient(circle at center, ${c1} 0%, ${c2} 50%, ${c3} 100%)`
  else if (type === 'conic') cssBackground = `conic-gradient(from ${angle}deg, ${c1}, ${c2}, ${c3}, ${c1})`

  const isCopied = copied === cssBackground

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <span className="section-label">Gradient Generator</span>
        <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--text)' }}>
          Glass <em>Blends</em>
        </h2>
      </div>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl border" style={{ borderColor: 'var(--border)' }}>
        {/* The Preview Area */}
        <motion.div
          animate={{ background: cssBackground }}
          className="w-full min-h-[400px] transition-colors duration-500"
        />

        {/* Controls Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pointer-events-none">
          <div className="glass px-2 py-2 rounded-2xl flex items-center gap-1 pointer-events-auto">
            {(['linear', 'radial', 'conic'] as GradType[]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer no-select ${type === t ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center pointer-events-auto w-full md:w-auto">
            {type !== 'radial' && (
              <div className="glass px-4 py-2 rounded-2xl flex items-center gap-4 flex-1 md:flex-none">
                <span className="font-mono text-[10px] text-white/50 uppercase">Angle</span>
                <input
                  type="range"
                  min="0" max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-24 md:w-32 accent-[#c9a96e]"
                />
                <span className="font-mono text-[11px] text-white w-8 text-right">{angle}°</span>
              </div>
            )}
            
            <button
              onClick={() => copyText(cssBackground)}
              className="flex items-center gap-2 glass glass-hover px-5 py-3 rounded-2xl text-sm font-ui font-medium cursor-pointer no-select shrink-0"
              style={{ color: 'var(--text)' }}
            >
              {isCopied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              <span className="hidden sm:inline">Copy CSS</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
