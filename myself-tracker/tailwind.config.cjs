/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#208085",
          green: "#22C55E",
          amber: "#F59E0B",
          red: "#EF4444"
        }
      }
    }
  },
  plugins: []
};