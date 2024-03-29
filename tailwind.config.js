module.exports = {
  // purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fade: "fade-in .35s ease-in forwards",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["even"],
      backgroundImage: ["dark"],
      translate: ["group-hover"],
    },
  },
  plugins: [],
};
