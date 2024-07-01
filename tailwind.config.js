/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        customBg: '#282e33',
        customFill: '#b6c2cf',
      }
    },
  },
  plugins: [],
}