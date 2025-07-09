/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#0a0a0a',
        'planet-blue': '#1e3a8a',
        'white-fade': 'rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}
