/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        ui:      ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        canvas: '#060608',
        surface: { DEFAULT: '#0e0e12', 2: '#16161c', 3: '#1e1e26' },
        gold: '#c9a96e',
        jade: '#5cb87a',
      },
      animation: {
        'shimmer':    'shimmer 2.5s linear infinite',
        'float':      'float 7s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'slide-up':   'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fadeIn 0.5s ease both',
        'spin-slow':  'spin 4s linear infinite',
        'marquee':    'marquee 28s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 20px -4px var(--tw-shadow-color)',
        'glow-md': '0 0 40px -8px var(--tw-shadow-color)',
        'glow-lg': '0 0 80px -12px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
}
