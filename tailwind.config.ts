import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  mode: "jit",
  content: [
    // class属性を含む全てのファイルを指定する必要がある(jsx,htmlなど)
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/stories/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "grid-cols-auto-fill": value => ({
            gridTemplateColumns: `repeat(auto-fill, minmax(${value}, 1fr))`,
          }),
        },
        { values: theme("spacing") },
      );
    }),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "grid-cols-auto-fit": value => ({
            gridTemplateColumns: `repeat(auto-fit, minmax(${value}, 1fr))`,
          }),
        },
        { values: theme("spacing") },
      );
    }),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  theme: {
    extend: {
      animation: {
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
      },
      keyframes: {
        enter: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  daisyui: {
    themes: ["light", "dark"],
  },
};

export default config;
