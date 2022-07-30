// tailwind.config.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors")
module.exports = {
  purge: ["{app,pages}/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
        cyan: colors.cyan,
        teal: colors.teal,
        emerald: colors.emerald,
      },
      backgroundImage: {
        hero: "url(/weights.jpg)",
      },
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
