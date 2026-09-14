/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',
          panel: '#1e293b',
          border: '#334155',
          primary: '#3b82f6',
          text: '#f8fafc',
          muted: '#94a3b8',
        },
        status: {
          good: '#22c55e',
          warning: '#eab308',
          danger: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};