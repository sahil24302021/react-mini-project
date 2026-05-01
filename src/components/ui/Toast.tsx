import { motion, AnimatePresence } from 'framer-motion'
import { useColor } from '@/context/ColorContext'
import { CheckIcon } from './Icons'

export default function Toast() {
  const { toast } = useColor()

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full" style={{ background: 'var(--gold)' }}>
              <CheckIcon size={12} className="text-[#060608]" />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
