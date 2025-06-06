/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1DB954',
          light: '#1ED760',
          dark: '#138D42'
        },
        secondary: {
          DEFAULT: '#191414',
          light: '#282828',
          dark: '#000000'
        },
        accent: '#FF6B35',
        surface: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        'neu-light': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neu-dark': '8px 8px 16px #0f0f23, -8px -8px 16px #1a1a2e'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}