/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#06090e',
          surface: '#0a0e17',
          card: '#0e1420',
          cardHover: '#131b2c',
          cardGlass: 'rgba(14, 20, 32, 0.75)',
          border: 'rgba(255, 122, 24, 0.18)',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          textMuted: '#94a3b8',
          textSubtle: '#64748b'
        },
        heat: {
          fire: '#FF4D00',
          orange: '#FF7A18',
          amber: '#FFA726',
          yellow: '#FBBF24',
          crimson: '#EF4444',
          darkRed: '#991B1B'
        },
        brand: {
          navy: '#071A2B',
          dark: '#0B2942',
          blue: '#1479D1',
          cyan: '#28B8F2',
          orange: '#FF7A18',
          warmOrange: '#FF9F43',
          softWhite: '#F7FAFC',
          lightBlue: '#EAF6FF',
          darkText: '#102A43',
        },
        climate: {
          950: '#06090e',
          900: '#0a0e17',
          800: '#0e1420',
          700: '#141e2e',
          blue: '#1479D1',
          cyan: '#38bdf8',
          orange: '#FF7A18',
          amber: '#FF9F43',
          emerald: '#10b981',
          rose: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'heat-glow': '0 0 25px -5px rgba(255, 122, 24, 0.4)',
        'heat-glow-sm': '0 0 15px -3px rgba(255, 122, 24, 0.3)',
        'heat-glow-lg': '0 0 40px -8px rgba(255, 77, 0, 0.5)',
        'cyan-glow': '0 0 20px -4px rgba(56, 189, 248, 0.35)',
        'dark-card': '0 10px 30px -5px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'heat-gradient': 'linear-gradient(135deg, #FF4500 0%, #FF7A18 50%, #FFA726 100%)',
        'heat-radial': 'radial-gradient(ellipse at center, rgba(255, 77, 0, 0.15) 0%, rgba(6, 9, 14, 0) 70%)',
        'dark-glass': 'linear-gradient(180deg, rgba(20, 28, 44, 0.65) 0%, rgba(10, 14, 23, 0.85) 100%)',
      }
    },
  },
  plugins: [],
}
