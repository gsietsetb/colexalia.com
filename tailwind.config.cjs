/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf8ff',
          100: '#dceffd',
          200: '#c0e3fa',
          300: '#95d0f6',
          400: '#61b5ee',
          500: '#3a96e7',
          600: '#247adc',
          700: '#1f65ca',
          800: '#1f54a4',
          900: '#1f4982',
          950: '#162d50',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede8ff',
          200: '#dcd5fe',
          300: '#c3b4fc',
          400: '#aa8ff8',
          500: '#9168f2',
          600: '#7e42e6',
          700: '#6a30cc',
          800: '#5828a7',
          900: '#482587',
          950: '#2d134c',
        },
        accent: {
          50: '#fef2f3',
          100: '#fde6e7',
          200: '#fbd0d5',
          300: '#f7aab2',
          400: '#f27a8a',
          500: '#e73d56',
          600: '#d42d4e',
          700: '#b21c41',
          800: '#951a3c',
          900: '#7e1a39',
          950: '#450919',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'url("/hero-pattern.svg")',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(4px)',
          '-webkit-backdrop-filter': 'blur(4px)',
          'border-radius': '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-dark': {
          background: 'rgba(17, 25, 40, 0.75)',
          'backdrop-filter': 'blur(4px)',
          '-webkit-backdrop-filter': 'blur(4px)',
          'border-radius': '10px',
          border: '1px solid rgba(255, 255, 255, 0.125)',
          'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      }
      addUtilities(newUtilities)
    },
    require('tailwindcss-gradients'),
  ],
} 