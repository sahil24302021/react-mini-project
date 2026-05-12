import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useColor } from '@/context/ColorContext'
import { formatRgb, formatHsl } from '@/utils/colorUtils'
import { ShuffleIcon, SpinnerIcon, CopyIcon, CheckIcon, BookmarkIcon, ArrowRightIcon } from '@/components/ui/Icons'
import Button from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function HeroSection() {
  const { color, isGenerating, generate, copyText, copied, saveColor } = useColor()

  const formats = [
    { label: 'HEX', value: color.hex },
    { label: 'RGB', value: formatRgb(color.rgb) },
    { label: 'HSL', value: formatHsl(color.hsl) },
  ]

  const secColor = color.palette[0]?.hex || color.hex

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.div
          className="absolute will-change-transform"
          style={{ width: '60vw', height: '60vw', top: '-10%', left: '-10%' }}
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="w-full h-full rounded-full blur-[120px] opacity-25 transition-colors duration-1000"
            style={{ backgroundColor: color.hex }}
          />
        </motion.div>
        <motion.div
          className="absolute will-change-transform"
          style={{ width: '70vw', height: '70vw', bottom: '-20%', right: '-10%' }}
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div
            className="w-full h-full rounded-full blur-[140px] opacity-[0.18] transition-colors duration-1000"
            style={{ backgroundColor: secColor }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            <div className="inline-flex items-center gap-2 self-start glass px-3.5 py-1.5 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)] backdrop-blur-xl">
              <motion.div
                className="w-2.5 h-2.5 rounded-full shadow-inner"
                animate={{ backgroundColor: color.hex, boxShadow: `0 0 10px ${color.hex}` }}
                transition={{ duration: 0.6 }}
              />
              <span className="font-mono text-[11px] font-medium tracking-wider" style={{ color: 'var(--text-2)' }}>
                {color.mood} · {color.hex}
              </span>
            </div>

            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight -ml-1">
              <span style={{ color: 'var(--text)' }}>Color,</span>
              <br />
              <div className="relative inline-block">
                <motion.em 
                  className="text-shimmer not-italic block"
                  animate={{ backgroundPosition: ['-200% center', '200% center'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${color.hex} 0%, #fff 25%, ${color.hex} 50%, #fff 75%, ${color.hex} 100%)`,
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Perfected.
                </motion.em>
              </div>
            </h1>

            <p className="text-lg leading-relaxed font-ui font-light" style={{ color: 'var(--text-2)', maxWidth: 440 }}>
              Generate harmonic color palettes with aesthetic theory built in. Copy formats instantly, explore by mood, and export into your production app.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-2.5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {formats.map(({ label, value }) => {
              const isCopied = copied === value
              return (
                <button
                  key={label}
                  onClick={() => copyText(value)}
                  className="group flex items-center gap-2 glass glass-hover px-4 py-3 rounded-xl cursor-pointer no-select shadow-sm"
                >
                  <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-white/30 group-hover:text-white/60 transition-colors">
                    {label}
                  </span>
                  <span className="font-mono text-[13.5px] font-medium" style={{ color: 'var(--text)' }}>
                    {value}
                  </span>
                  <span className="ml-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }}>
                    {isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  </span>
                </button>
              )
            })}
          </motion.div>

          <motion.div
            className="flex items-center gap-4 flex-wrap mt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button size="lg" onClick={generate} disabled={isGenerating} className="shadow-[0_8px_40px_rgba(0,0,0,0.5)] group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out" />
              <div className="relative flex items-center gap-2 z-10">
                {isGenerating ? <SpinnerIcon size={16} /> : <ShuffleIcon size={16} />}
                {isGenerating ? 'Generating…' : 'Generate'}
                <span className="font-mono text-[11px] font-normal opacity-50 ml-1 bg-black/20 px-1.5 py-0.5 rounded">Space</span>
              </div>
            </Button>

            <Button variant="outline" size="lg" onClick={() => saveColor(color)} className="hover:border-white/30 transition-colors hover:bg-white/5">
              <BookmarkIcon size={15} />
              Save
            </Button>

            <Link to="/explore">
              <Button variant="ghost" size="lg" className="hover:bg-white/5 transition-colors">
                Explore
                <ArrowRightIcon size={15} />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="perspective-1000"
        >
          <ColorCard color={color} onCopy={copyText} copied={copied} />
        </motion.div>
      </div>
    </section>
  )
}

function ColorCard({ color, onCopy, copied }) {
  const textC = color.isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)'
  const subC  = color.isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)'
  const isCopied = copied === color.hex

  const [isHovered, setHovered] = useState(false)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 })
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 })

  const rotateX = useTransform(mouseYSpring, [0, 1], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [0, 1], ["-5deg", "5deg"])
  const glareX = useTransform(mouseXSpring, [0, 1], ["0%", "100%"])
  const glareY = useTransform(mouseYSpring, [0, 1], ["0%", "100%"])

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / rect.width)
    y.set(mouseY / rect.height)
  }

  function handleMouseLeave() {
    setHovered(false)
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-[32px] overflow-hidden cursor-pointer group shadow-2xl will-change-transform"
      onClick={() => onCopy(color.hex)}
    >
      <div style={{ aspectRatio: '4/5' }} className="w-full relative">
        <motion.div
          className="absolute inset-0 transition-colors duration-500"
          style={{ backgroundColor: color.hex }}
        />
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay transition-opacity duration-300"
          style={{
            opacity: isHovered ? (color.isLight ? 0.3 : 0.15) : 0,
            background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,1) 0%, transparent 60%)`
          }}
        />
        <div className="absolute inset-0 rounded-[32px]" style={{
          background: `radial-gradient(ellipse at 80% 10%, ${color.isLight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'} 0%, transparent 65%)`
        }} />
        <motion.div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          animate={{ boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 140px -20px ${color.hex}` }}
          transition={{ duration: 0.8 }}
        />

        <div 
          className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 pointer-events-none"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex items-start justify-between">
            <motion.span
              key={color.mood}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display italic text-[15px] tracking-[0.15em] uppercase font-medium drop-shadow-sm"
              style={{ color: subC }}
            >
              {color.mood}
            </motion.span>
            <div className="flex flex-col gap-2.5 items-end">
              <div className="glass bg-white/5 backdrop-blur-md rounded-xl px-3.5 py-2 text-[11px] font-mono shadow-sm border border-white/10" style={{ color: subC }}>
                H{color.hsl.h} · S{color.hsl.s} · L{color.hsl.l}
              </div>
              {color.contrast && (
                <motion.div 
                  key={color.hex + 'contrast'}
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 glass bg-black/10 backdrop-blur-md rounded-xl px-3.5 py-1.5 text-[10.5px] font-mono font-medium shadow-sm border" 
                  style={{ color: subC, borderColor: color.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }}
                >
                  <span style={{ color: color.contrast.AA ? (color.isLight ? '#059669' : '#34d399') : (color.isLight ? '#dc2626' : '#f87171') }}>
                    {color.contrast.ratio}:1
                  </span>
                  <span className="opacity-80">
                    {color.contrast.AAA ? 'AAA' : color.contrast.AA ? 'AA' : 'FAIL'}
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div
              key={color.hex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono leading-none font-medium drop-shadow-md" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.03em', color: textC }}>
                {color.hex}
              </p>
            </motion.div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase transition-opacity duration-300" style={{ color: subC, opacity: isHovered || isCopied ? 1 : 0 }}>
              {isCopied ? '✓ Copied to clipboard' : 'Click to copy hex'}
            </p>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 rounded-[32px] pointer-events-none mix-blend-overlay bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: isCopied ? 0.2 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <div className="absolute inset-0 rounded-[32px] border border-white/20 mix-blend-overlay pointer-events-none" />
      </div>
    </motion.div>
  )
}
