/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Work Sans', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
      colors: {
        background: '#0c0a09',
        'background-light': '#f8f7f5', 
        'background-dark': '#0c0a09',
        surface: '#1c1917',
        'surface-dark': '#1c1917',
        'card-dark': '#1c1917',
        primary: '#f59e0b',
        'primary-fg': '#0c0a09',
        muted: '#292524',
        'text-main': '#fafaf9',
        'text-muted': '#a8a29e',
        'border-dark': '#2d2a27',
        
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
