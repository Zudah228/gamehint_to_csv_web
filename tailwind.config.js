// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
    colors: {
      ...colors,
      primary: {
        DEFAULT: "#ff3e00",
      },
    },
  },
  plugins: [],
};
