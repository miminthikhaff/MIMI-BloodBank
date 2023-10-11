/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#B70404',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}

