const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui", 
      addCommonColors: false, 
      defaultTheme: "dark", 
      defaultExtendTheme: "dark",
      layout: {},
      themes: {
        light: {
          layout: {}, 
          colors: {},
        },
        dark: {
          layout: {},
          colors: {},
        },
      },
    }),
  ],
};
