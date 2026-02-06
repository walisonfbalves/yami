/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
      colors: {
        background: '#0c0a09', // Stone 950
        surface: '#1c1917',    // Stone 900
        primary: '#f59e0b',    // Amber 500
        'primary-fg': '#0c0a09',
        muted: '#292524',      // Stone 800
        'text-main': '#fafaf9', // Stone 50
        'text-muted': '#a8a29e', // Stone 400
      },
    },
  },
  plugins: [],
}
