import { motion, AnimatePresence } from 'framer-motion'
import { useColor } from '@/context/ColorContext'
import { CheckIcon, BookmarkIcon } from '@/components/ui/Icons'

export default function HistorySection() {
  const { history, copied, copyText, saveColor, setColor } = useColor()
  if (history.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="section-label">Recent Colors</span>
          <span className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>{history.length} generated</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <AnimatePresence initial={false} mode="popLayout">
            {history.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="group relative flex-shrink-0 flex flex-col gap-2 cursor-pointer no-select"
                style={{ width: 72 }}
              >
                <div
                  className="w-full rounded-xl relative overflow-hidden border"
                  style={{
                    aspectRatio: '1/1',
                    backgroundColor: entry.hex,
                    borderColor: 'rgba(255,255,255,0.07)',
                    boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 32px -8px ${entry.hex}`,
                  }}
                  onClick={() => setColor(entry.hex)}
                >
                  <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <button
                      onClick={e => { e.stopPropagation(); copyText(entry.hex) }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/90 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {copied === entry.hex ? <CheckIcon size={12} /> : <span className="text-[10px] font-mono">Copy</span>}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] leading-tight truncate" style={{ color: 'var(--text-3)' }}>
                    {entry.hex}
                  </span>
                  <span className="font-display italic text-[9px] leading-tight truncate" style={{ color: 'var(--text-3)' }}>
                    {entry.mood}
                  </span>
                </div>

                <button
                  onClick={() => saveColor(entry)}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ color: 'var(--gold)' }}
                >
                  <BookmarkIcon size={11} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
