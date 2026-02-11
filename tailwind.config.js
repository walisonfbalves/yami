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
        // 1. BRAND (A cor da marca)
        primary: {
          DEFAULT: 'var(--color-primary, #f59f0a)',
          hover: 'var(--color-primary-hover, #d97706)',
          light: 'var(--color-primary-light, rgba(245, 159, 10, 0.15))',
          content: '#ffffff'
        },

        // 2. SURFACE (Camadas do Dark Mode)
        background: '#0c0a09', // stone-950 (Fundo da página)
        surface: {
          DEFAULT: '#1c1917', // stone-900 (Cards, Modais)
          hover: '#292524',   // stone-800 (Hover em listas)
          active: '#44403c',  // stone-700
          border: 'rgba(255, 255, 255, 0.1)' // Bordas sutis
        },

        // 3. SEMANTIC STATES (Feedback)
        danger: {
          DEFAULT: '#ef4444', // red-500
          bg: 'rgba(239, 68, 68, 0.1)',
          text: '#ef4444'
        },
        success: {
          DEFAULT: '#10b981', // emerald-500
          bg: 'rgba(16, 185, 129, 0.1)',
          text: '#10b981'
        },
        info: {
          DEFAULT: '#3b82f6', // blue-500
          bg: 'rgba(59, 130, 246, 0.1)',
          text: '#3b82f6'
        },
        
        // 4. TYPOGRAPHY
        text: {
          primary: '#ffffff',
          secondary: '#a8a29e', // stone-400
          tertiary: '#78716c'   // stone-500
        },

        // Legacy/Utility mappings (preserved for compatibility if needed, or remove if clean sweep)
        // 'background-dark': '#0c0a09', -> background
        // 'surface-dark': '#1c1917', -> surface.DEFAULT
        muted: '#292524', 
        'border-dark': '#2d2a27',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
