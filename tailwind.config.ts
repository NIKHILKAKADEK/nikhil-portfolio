import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-hover": "rgb(var(--color-accent-hover) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        "surface-raised": "rgb(var(--color-surface-raised) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "Avenir Next", "Avenir", "Helvetica Neue", "sans-serif"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        panel: "var(--radius-panel)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        float: "var(--shadow-float)",
      },
      maxWidth: {
        reading: "var(--measure-reading)",
      },
    },
  },
  plugins: [],
};

export default config;
