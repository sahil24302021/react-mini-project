/**
 * ColorContext.jsx — Global State Management
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
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { buildGeneratedColor, generateRandomHex } from '@/utils/colorUtils'

const ColorContext = createContext(null)

export function ColorProvider({ children }) {
  // Core color state — initialized with a warm amber default
  const [color, setColorState]       = useState(() => buildGeneratedColor('#B5673C'))
  // Recently generated colors (newest first, max 12)
  const [history, setHistory]        = useState([])
  // User's saved collection (persisted to localStorage, max 24)
  const [saved, setSaved]            = useState(() => {
    try {
      const stored = localStorage.getItem('palette-studio-saved')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  // UI state flags
  const [isGenerating, setGenerating]= useState(false)
  const [copied, setCopied]          = useState(null)
  const [toast, setToast]            = useState(null)
  
  // Timer refs to properly debounce copy feedback and toast auto-dismiss
  const timerRef = useRef(null)
  const toastTimerRef = useRef(null)

  // Persist saved colors to localStorage whenever they change
  useEffect(() => {
    try { localStorage.setItem('palette-studio-saved', JSON.stringify(saved)) }
    catch { /* storage full or unavailable — silently fail */ }
  }, [saved])

  const showToast = useCallback((message) => {
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

  const setColor = useCallback((hex) => {
    const next = buildGeneratedColor(hex)
    setColorState(next)
    setHistory(prev => [next, ...prev].slice(0, 12))
  }, [])

  const copyText = useCallback(async (text) => {
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

  const saveColor = useCallback((c) => {
    setSaved(prev => prev.find(s => s.hex === c.hex) ? prev : [c, ...prev].slice(0, 24))
    showToast(`Saved ${c.hex} to collection`)
  }, [showToast])

  const removeColor = useCallback((id) => {
    setSaved(prev => prev.filter(s => s.id !== id))
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName
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

export function useColor() {
  const ctx = useContext(ColorContext)
  if (!ctx) throw new Error('useColor must be used within ColorProvider')
  return ctx
}
