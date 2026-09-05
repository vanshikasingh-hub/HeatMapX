/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
          950: '#071A2B',
          900: '#0B2942',
          800: '#13395c',
          700: '#1d4d7a',
          blue: '#1479D1',
          cyan: '#28B8F2',
          orange: '#FF7A18',
          amber: '#FF9F43',
          emerald: '#10b981',
          rose: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
