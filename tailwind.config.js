/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#C7F9CC',
          100: '#C7F9CC',
          400: '#80ED99',
          500: '#57CC99',
          600: '#38A3A5',
          700: '#22577A',
        },
        teal: {
          50: '#C7F9CC',
          100: '#C7F9CC',
          400: '#80ED99',
          500: '#57CC99',
          600: '#38A3A5',
          700: '#22577A',
        },
        emerald: {
          100: '#C7F9CC',
          300: '#80ED99',
          400: '#57CC99',
        },
      },
    },
  },
  plugins: [],
}
