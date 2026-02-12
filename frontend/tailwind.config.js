/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cifp: {
          red: {
            DEFAULT: '#D32F2F', // Rojo corporativo profesional
            light: '#EF5350',
            dark: '#C62828',
          },
          blue: {
            DEFAULT: '#1976D2', // Azul corporativo basado en mockup
            dark: '#1565C0',
            light: '#42A5F5',
          },
          neutral: {
            50: '#F8FAFC',   // Fondos claros
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',  // Texto oscuro
          }
        }
      },
      screens: {
        'short': { 'raw': '(max-height: 500px)' },
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
