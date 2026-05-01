interface P { size?: number; className?: string }
const ico = (d: string) => ({ size = 16, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ico2 = (paths: string[]) => ({ size = 16, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {paths.map((d, i) => <path key={i} d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>)}
  </svg>
)

export const CopyIcon     = ico('M9 9h13v13H9zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1')
export const CheckIcon    = ico('M20 6L9 17l-5-5')
export const ShuffleIcon  = ico2(['M16 3h5v5M4 20L21 3','M21 16v5h-5M15 15l6 6M4 4l5 5'])
export const BookmarkIcon = ico('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z')
export const TrashIcon    = ico2(['M3 6h18','M8 6V4h8v2M19 6l-1 14H6L5 6'])
export const DownloadIcon = ico2(['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'])
export const EyeIcon      = ico2(['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'])
export const ArrowRightIcon = ico('M5 12h14M12 5l7 7-7 7')
export const DiamondIcon  = ico('M12 2l10 10-10 10L2 12z')
export const RefreshIcon  = ico2(['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'])
export const CodeIcon     = ico2(['M16 18l6-6-6-6','M8 6l-6 6 6 6'])
export const CloseIcon    = ico('M18 6L6 18M6 6l12 12')
export const PlusIcon     = ico('M12 5v14M5 12h14')

export function SpinnerIcon({ size = 16, className = '' }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
