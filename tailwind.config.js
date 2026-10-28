import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fundo bege quente (tema claro)
        sand: {
          50:  '#faf8f4',
          100: '#f5f0e8',
          200: '#ede5d6',
          300: '#e2d5be',
          400: '#d4bfa0',
          500: '#c4a882',
          600: '#b08d63',
          700: '#8f6e49',
          800: '#6e5238',
          900: '#4e3928',
        },
        // Texto e superfícies — grafite neutro levemente quente
        ink: {
          50:  '#f7f6f3',
          100: '#ebe9e4',
          200: '#d6d3cc',
          300: '#aeaaa1',
          400: '#858179',
          500: '#64615a',
          600: '#4a4843',
          700: '#33312e',
          800: '#1f1e1c',
          900: '#141413',
          950: '#0a0a09',
        },
        // Amarelo da marca OndeVou — 400 é o principal (fundo do ícone)
        brand: {
          50:  '#fffce8',
          100: '#fff7c4',
          200: '#fff08f',
          300: '#ffe955',
          400: '#ffe000',
          500: '#f2cf00',
          600: '#c9aa00',
          700: '#8f7900',
          800: '#4a3f00',
          900: '#1f1b00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      boxShadow: {
        glass: '0 4px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-sm': '0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
      }
    },
  },
  plugins: [
    // Tema preto (html.dark.black): black:text-white etc. vence o dark:
    plugin(({ addVariant }) => addVariant('black', '.black &')),
  ],
}
