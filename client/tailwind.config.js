/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cozy': {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#ede4d3',
          300: '#e4d7ba',
          400: '#d9c8a0',
          500: '#cdb386',
          600: '#b39d6f',
          700: '#8d7a52',
          800: '#6d5e43',
          900: '#564a38',
        }
      }
    },
  },
  plugins: [],
}
