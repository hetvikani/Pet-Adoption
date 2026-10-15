/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0aba2',
          400: '#d78275',
          500: '#c85a49',
          600: '#b24434',
          700: '#943628',
          800: '#7a2f24',
          900: '#642b22',
        }
      }
    },
  },
  plugins: [],
}
