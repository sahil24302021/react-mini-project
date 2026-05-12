import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-[var(--text)] text-[var(--canvas)] hover:opacity-90',
  ghost:   'bg-transparent text-[var(--text-2)] hover:bg-white/5 hover:text-[var(--text)]',
  outline: 'bg-transparent text-[var(--text)] border border-[var(--border-2)] hover:border-[var(--text-3)]',
}
const sizes = {
  sm: 'px-3 py-1.5 text-[12px] rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-[13px] rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-[14px] rounded-2xl gap-2.5',
}

export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button' }) {
  const isPrimary = variant === 'primary'

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.025, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      style={{
        boxShadow: isPrimary && !disabled ? '0 10px 30px -10px var(--text-2), 0 0 0 1px rgba(255,255,255,0.1) inset' : undefined
      }}
      className={`
        relative inline-flex items-center justify-center font-ui font-semibold
        transition-colors duration-200 cursor-pointer no-select overflow-hidden
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {isPrimary && (
        <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen" />
      )}
      <span className="relative z-10 flex items-center gap-[inherit]">{children}</span>
    </motion.button>
  )
}
