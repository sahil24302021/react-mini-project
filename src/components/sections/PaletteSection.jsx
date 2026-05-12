import { useState } from 'react'
import { motion } from 'framer-motion'
import { useColor } from '@/context/ColorContext'
import { isColorLight, exportCss, exportJson, exportTailwind, exportScss, exportSwiftUI, exportCompose, simulateCVD } from '@/utils/colorUtils'
import { CheckIcon, CopyIcon, DownloadIcon, CodeIcon, EyeIcon } from '@/components/ui/Icons'

const RELATION_LABEL = {
  complementary: 'Complement',
  analogous: 'Analogous',
  triadic: 'Triadic',
  split: 'Split',
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 18, scale: 0.93 },
  show: { opacity: 1, y: 0, scale: 1, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.55 } },
}

export default function PaletteSection() {
  const { color, copied, copyText, saveColor } = useColor()
  const [exportFmt, setExportFmt] = useState('css')
  const [showExport, setShowExport] = useState(false)
  const [cvdType, setCvdType] = useState('none')

  const exportCode = exportFmt === 'css' ? exportCss(color)
    : exportFmt === 'json' ? exportJson(color)
    : exportFmt === 'scss' ? exportScss(color)
    : exportFmt === 'swiftui' ? exportSwiftUI(color)
    : exportFmt === 'compose' ? exportCompose(color)
    : exportTailwind(color)

  const handleDownload = () => {
    const ext = exportFmt === 'json' ? 'json' : exportFmt === 'css' ? 'css' : 'js'
    const blob = new Blob([exportCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `palette.${ext}`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 flex flex-col gap-16">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="flex flex-col gap-2">
          <span className="section-label">Harmonic Palette</span>
          <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--text)' }}>
            Generated from <em>{color.mood}</em>
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center glass rounded-xl p-1 gap-1">
            <div className="pl-2 pr-1 opacity-40"><EyeIcon size={14} /></div>
            {['none', 'protanopia', 'deuteranopia', 'tritanopia'].map(type => (
              <button
                key={type}
                onClick={() => setCvdType(type)}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer no-select ${cvdType === type ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
              >
                {type === 'none' ? 'Nor' : type.substring(0, 3)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowExport(v => !v)}
            className="flex items-center gap-2 glass glass-hover px-4 py-2.5 rounded-xl text-sm font-ui font-medium cursor-pointer no-select"
            style={{ color: 'var(--text-2)' }}
          >
            <CodeIcon size={15} />
            Export Code
          </button>
        </div>
      </div>

      <motion.div
        key={color.hex}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {color.palette.map((swatch) => {
          const displayHex = cvdType === 'none' ? swatch.hex : simulateCVD(swatch.hex, cvdType)
          const light = isColorLight(displayHex)
          const isCopied = copied === displayHex
          const tc = light ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)'
          const sc = light ? 'rgba(0,0,0,0.4)'  : 'rgba(255,255,255,0.4)'

          return (
            <motion.button
              key={swatch.hex}
              variants={item}
              onClick={() => copyText(displayHex)}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              className="relative group rounded-2xl overflow-hidden text-left cursor-pointer no-select border transition-colors duration-500"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                boxShadow: `0 12px 40px rgba(0,0,0,0.35), 0 0 60px -12px ${displayHex}66`,
              }}
            >
              <div className="w-full transition-colors duration-500" style={{ aspectRatio: '1/1', backgroundColor: displayHex }} />
              <div className="px-4 py-3.5 flex flex-col gap-1 transition-colors duration-500" style={{ backgroundColor: displayHex }}>
                <span className="text-[10px] font-ui font-semibold tracking-[0.18em] uppercase" style={{ color: sc }}>
                  {RELATION_LABEL[swatch.relation]}
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium" style={{ color: tc }}>{displayHex}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: sc }}>
                    {isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  </span>
                </div>
                <span className="font-display italic text-xs" style={{ color: sc }}>{swatch.mood}</span>
              </div>
              {isCopied && (
                <div className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                  style={{ borderColor: light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.5)' }} />
              )}
            </motion.button>
          )
        })}
      </motion.div>

      {showExport && (
        <motion.div
          className="glass rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex border-b overflow-x-auto scrollbar-hide" style={{ borderColor: 'var(--border)' }}>
            {['css', 'scss', 'tailwind', 'swiftui', 'compose', 'json'].map(fmt => (
              <button
                key={fmt}
                onClick={() => setExportFmt(fmt)}
                className="px-6 py-3.5 font-mono text-xs tracking-wider uppercase cursor-pointer transition-colors no-select"
                style={{
                  color: exportFmt === fmt ? 'var(--text)' : 'var(--text-3)',
                  borderBottom: exportFmt === fmt ? '1px solid var(--gold)' : '1px solid transparent',
                  marginBottom: -1,
                }}
              >
                {fmt}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 pr-4">
              <button
                onClick={() => copyText(exportCode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-ui font-medium glass-hover cursor-pointer no-select"
                style={{ color: 'var(--text-2)' }}
              >
                {copied === exportCode ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                Copy
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-ui font-medium glass-hover cursor-pointer no-select"
                style={{ color: 'var(--text-2)' }}
              >
                <DownloadIcon size={12} />
                Download
              </button>
            </div>
          </div>
          <pre className="p-6 font-mono text-xs leading-relaxed overflow-x-auto scrollbar-hide"
            style={{ color: 'var(--text-2)', maxHeight: 280 }}>
            {exportCode}
          </pre>
        </motion.div>
      )}
    </section>
  )
}
