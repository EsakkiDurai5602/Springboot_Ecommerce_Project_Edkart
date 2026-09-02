/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          200: '#BAE0FD',
          300: '#7DC4FC',
          400: '#38A4F8',
          500: '#0E85EB',
          600: '#0267C9',
          700: '#0352A2',
          800: '#074685',
          900: '#0B3C6F',
          950: '#08264A',
        },
        fintech: {
          navy: '#0A192F',
          navyDark: '#07101E',
          navyCard: '#112240',
          navyLight: '#1E293B',
          cyan: '#06B6D4',
          cyanLight: '#67E8F9',
          cyanDark: '#0891B2',
          gold: '#D97706',
          goldLight: '#FBBF24',
          emerald: '#10B981',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'fintech': '0 4px 20px -2px rgba(10, 25, 47, 0.08), 0 2px 6px -1px rgba(10, 25, 47, 0.04)',
        'fintech-lg': '0 10px 30px -4px rgba(10, 25, 47, 0.12), 0 4px 10px -2px rgba(10, 25, 47, 0.06)',
        'fintech-glow': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'card-hover': '0 12px 32px -4px rgba(14, 133, 235, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
