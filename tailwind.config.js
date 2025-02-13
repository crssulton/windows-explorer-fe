/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        opacity: "opacity",
        transform: "transform",
      },
    },
  },
  plugins: [],
};
