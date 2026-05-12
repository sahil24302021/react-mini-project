import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '@/components/layout/PageLayout'
import { useColor } from '@/context/ColorContext'
import { isColorLight, exportCss } from '@/utils/colorUtils'
import { TrashIcon, CopyIcon, CheckIcon, DownloadIcon, ArrowRightIcon } from '@/components/ui/Icons'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function SavedPage() {
  const { saved, removeColor, copyText, copied, setColor } = useColor()

  const handleDownloadAll = () => {
    const text = saved.map(c => exportCss(c)).join('\n\n/* --- */\n\n')
    const blob = new Blob([text], { type: 'text/css' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'saved-palette.css' })
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 flex flex-col gap-12">
        <motion.div
          className="flex items-end justify-between gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-2">
            <span className="section-label">Collection</span>
            <h1 className="font-display text-5xl md:text-6xl" style={{ color: 'var(--text)' }}>
              Saved <em>Palettes</em>
            </h1>
          </div>
          {saved.length > 0 && (
            <Button variant="outline" size="md" onClick={handleDownloadAll}>
              <DownloadIcon size={14} />
              Export All CSS
            </Button>
          )}
        </motion.div>

        {saved.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-32 gap-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center">
              <span className="text-3xl">🎨</span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-display text-2xl" style={{ color: 'var(--text)' }}>Nothing saved yet</p>
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                Generate colors and click the bookmark icon to save them here.
              </p>
            </div>
            <Link to="/">
              <Button size="lg">
                Start Generating
                <ArrowRightIcon size={15} />
              </Button>
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {saved.map((entry) => {
              const light    = isColorLight(entry.hex)
              const textC    = light ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)'
              const subC     = light ? 'rgba(0,0,0,0.4)'  : 'rgba(255,255,255,0.35)'
              const isCopied = copied === entry.hex

              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="group relative rounded-2xl overflow-hidden border"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="relative w-full cursor-pointer"
                    style={{ aspectRatio: '16/9', backgroundColor: entry.hex }}
                    onClick={() => setColor(entry.hex)}
                  >
                    <div className="absolute inset-0" style={{
                      background: `radial-gradient(ellipse at 75% 25%, ${light ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'} 0%, transparent 60%)`,
                    }} />
                    <span
                      className="absolute bottom-3 left-4 font-display italic text-sm tracking-widest uppercase"
                      style={{ color: subC }}
                    >
                      {entry.mood}
                    </span>
                    <div className="absolute top-3 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="font-mono text-[10px] px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.8)' }}>
                        Click to load
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ backgroundColor: entry.hex }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-sm font-medium" style={{ color: textC }}>{entry.hex}</span>
                      <span className="font-mono text-[10px]" style={{ color: subC }}>
                        rgb({entry.rgb.r}, {entry.rgb.g}, {entry.rgb.b})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyText(entry.hex)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                        style={{ background: 'rgba(0,0,0,0.15)', color: subC }}
                        title="Copy hex"
                      >
                        {isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                      </button>
                      <button
                        onClick={() => removeColor(entry.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer opacity-40 hover:opacity-100"
                        style={{ background: 'rgba(220,60,60,0.2)', color: light ? 'rgba(0,0,0,0.7)' : 'rgba(255,120,120,0.9)' }}
                        title="Remove"
                      >
                        <TrashIcon size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex h-2">
                    {entry.palette.map(s => (
                      <div key={s.hex} className="flex-1" style={{ backgroundColor: s.hex }} />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  )
}
