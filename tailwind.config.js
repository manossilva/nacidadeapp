/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fundo bege quente
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
        // Acento escuro — verde musgo profundo
        ink: {
          50:  '#f2f4f1',
          100: '#e0e5dd',
          200: '#bfcbb9',
          300: '#9aad92',
          400: '#728c68',
          500: '#527044',
          600: '#3d5733',
          700: '#2e4226',
          800: '#1f2e1a',
          900: '#121b0f',
          950: '#090e07',
        },
        // Destaque quente
        rust: {
          50:  '#fef4f0',
          100: '#fde6dc',
          200: '#f9c6b1',
          300: '#f4a07e',
          400: '#ed7548',
          500: '#e35220',
          600: '#c43d12',
          700: '#9e2f0e',
          800: '#7a2410',
          900: '#5c1c0d',
        }
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
  plugins: [],
}
