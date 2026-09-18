/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0b2a1a',
          900: '#0f3320',
          800: '#123c26',
          700: '#155a34',
          600: '#1a7a44',
          500: '#1f9350',
          // Lighter accent for text/icons on dark surfaces -- 500 and darker
          // don't clear WCAG AA against the surface-800/900 backgrounds.
          400: '#3ecf7e',
        },
        // Dark portal surfaces -- page background down to raised card/hover
        // tones. A neutral near-black with a faint green tint so it sits
        // comfortably alongside the forest-green sidebar/accents.
        surface: {
          900: '#0a100d',
          800: '#111b16',
          700: '#1a2620',
          600: '#293a30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
}
