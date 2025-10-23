/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // namespaced palette
        lux: {
          gold: '#d4af37',
          coal: '#0a0a0a',
          ink: '#0b0f14',
        },
        // top-level shortcuts for common classes like bg-ink, bg-gold
        gold: '#d4af37',
        coal: '#0a0a0a',
        ink: '#0b0f14',
        navy: '#06121b',
        aquamarine: '#4fd1c5',
        aqua: '#22d3ee',
        teal: '#14b8a6',
        cyan: '#06b6d4',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      letterSpacing: {
        wider2: '0.08em',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}

