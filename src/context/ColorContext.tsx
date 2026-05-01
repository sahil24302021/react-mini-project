/**
 * ColorContext.tsx — Global State Management
 * 
 * This is the single source of truth for all color-related state in Palette Studio.
 * It uses React's Context API + useReducer pattern (via useState hooks) to provide:
 *   - Current generated color (hex, rgb, hsl, mood, palette, contrast)
 *   - History of recently generated colors (capped at 12)
 *   - Saved/bookmarked colors collection (capped at 24, persisted in localStorage)
 *   - Clipboard operations with visual feedback
 *   - Toast notification system
 *   - Keyboard shortcut registration (Space / ⌘+G to generate)
 */
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { buildGeneratedColor, generateRandomHex } from '@/utils/colorUtils'
import type { GeneratedColor } from '@/types/color'

interface ToastData {
  message: string
  id: number
}

interface ColorContextValue {
  color: GeneratedColor
  history: GeneratedColor[]
  saved: GeneratedColor[]
  isGenerating: boolean
  copied: string | null
  toast: ToastData | null
  generate: () => void
  copyText: (text: string) => Promise<void>
  saveColor: (c: GeneratedColor) => void
  removeColor: (id: string) => void
  setColor: (hex: string) => void
  showToast: (message: string) => void
}

const ColorContext = createContext<ColorContextValue | null>(null)

export function ColorProvider({ children }: { children: ReactNode }) {
  // Core color state — initialized with a warm amber default
  const [color, setColorState]       = useState<GeneratedColor>(() => buildGeneratedColor('#B5673C'))
  // Recently generated colors (newest first, max 12)
  const [history, setHistory]        = useState<GeneratedColor[]>([])
  // User's saved collection (persisted to localStorage, max 24)
  const [saved, setSaved]            = useState<GeneratedColor[]>(() => {
    try {
      const stored = localStorage.getItem('palette-studio-saved')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  // UI state flags
  const [isGenerating, setGenerating]= useState(false)
  const [copied, setCopied]          = useState<string | null>(null)
  const [toast, setToast]            = useState<ToastData | null>(null)
  
  // Timer refs to properly debounce copy feedback and toast auto-dismiss
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Persist saved colors to localStorage whenever they change
  useEffect(() => {
    try { localStorage.setItem('palette-studio-saved', JSON.stringify(saved)) }
    catch { /* storage full or unavailable — silently fail */ }
  }, [saved])

  const showToast = useCallback((message: string) => {
    setToast({ message, id: Date.now() })
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const generate = useCallback(() => {
    if (isGenerating) return
    setGenerating(true)
    setTimeout(() => {
      const next = buildGeneratedColor(generateRandomHex())
      setColorState(next)
      setHistory(prev => [next, ...prev].slice(0, 12))
      setGenerating(false)
    }, 160)
  }, [isGenerating])

  const setColor = useCallback((hex: string) => {
    const next = buildGeneratedColor(hex)
    setColorState(next)
    setHistory(prev => [next, ...prev].slice(0, 12))
  }, [])

  const copyText = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const el = Object.assign(document.createElement('textarea'), {
        value: text, style: 'position:fixed;opacity:0'
      })
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el)
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    setCopied(text)
    showToast(`Copied ${text.length > 20 ? 'code snippet' : text} to clipboard`)
    timerRef.current = setTimeout(() => setCopied(null), 2000)
  }, [showToast])

  const saveColor = useCallback((c: GeneratedColor) => {
    setSaved(prev => prev.find(s => s.hex === c.hex) ? prev : [c, ...prev].slice(0, 24))
    showToast(`Saved ${c.hex} to collection`)
  }, [showToast])

  const removeColor = useCallback((id: string) => {
    setSaved(prev => prev.filter(s => s.id !== id))
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.code === 'Space' || ((e.metaKey || e.ctrlKey) && e.key === 'g')) {
        e.preventDefault(); generate()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [generate])

  return (
    <ColorContext.Provider value={{ color, history, saved, isGenerating, copied, toast, generate, copyText, saveColor, removeColor, setColor, showToast }}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColor(): ColorContextValue {
  const ctx = useContext(ColorContext)
  if (!ctx) throw new Error('useColor must be used within ColorProvider')
  return ctx
}
