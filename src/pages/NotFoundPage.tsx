import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Button from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { useColor } from '@/context/ColorContext'

export default function NotFoundPage() {
  const { color } = useColor()
  return (
    <PageLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center font-mono text-3xl font-bold"
            style={{ backgroundColor: color.hex, color: color.isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)' }}
          >
            404
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-5xl" style={{ color: 'var(--text)' }}>Page not found</h1>
            <p style={{ color: 'var(--text-2)' }}>This hue doesn't exist — yet.</p>
          </div>
          <Link to="/">
            <Button size="lg">
              Back to Studio <ArrowRightIcon size={15} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  )
}
