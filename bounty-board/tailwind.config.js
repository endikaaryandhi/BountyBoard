/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: '#5D4037',
        paper: '#F5E6C8',
        stamp: '#D32F2F'
      }
    },
  },
  plugins: [],
}