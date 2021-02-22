// tailwind.config.js
const colors = require("tailwindcss/colors")
module.exports = {
  purge: ["{app,pages}/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: { orange: colors.orange, cyan: colors.cyan },
    },
    fontFamily: {
      sans: [
        "Montserrat",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "ui-sans-serif",
        "system-ui",
      ],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
