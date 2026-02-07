/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Enabled manual dark mode as per design
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Work Sans', 'sans-serif'], // Added for Stitch design
        heading: ['Oswald', 'sans-serif'],    // Added for Stitch design
      },
      colors: {
        // Yami / Stitch Design Palette
        background: '#0c0a09',     // Stone 950 (Base Dark)
        'background-light': '#f8f7f5', 
        'background-dark': '#0c0a09',
        surface: '#1c1917',        // Stone 900
        'surface-dark': '#1c1917',
        'card-dark': '#1c1917', // Alias for surface-dark
        primary: '#f59e0b',        // Amber 500 (Brand)
        'primary-fg': '#0c0a09',
        muted: '#292524',          // Stone 800
        'text-main': '#fafaf9',    // Stone 50
        'text-muted': '#a8a29e',   // Stone 400
        'border-dark': '#2d2a27',  // Custom Border
        
        // Tailwind default overrides/extends if needed
        'stone-950': '#0c0a09',
        'stone-900': '#1c1917',
        'stone-800': '#292524',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
