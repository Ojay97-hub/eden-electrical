import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand tokens (see README "Brand / Design tokens")
        primary: "#19372D", // Primary Green
        deep: "#11261F", // Deep Green
        panel: "#1F4035", // Panel Green
        "panel-alt": "#234539",
        gold: "#D5B044", // Primary Gold
        "gold-light": "#FCE893", // Secondary / Light Gold
        "gold-ink": "#A8842A", // Gold text on light (eyebrows)
        cream: "#F6F3EC", // Page background
        field: "#FBFAF6", // Input backgrounds
        ink: "#23211C", // Body text on light
        body: "#4A463D", // Paragraph text
        muted: "#6B665A",
        "muted-2": "#8A8576",
      },
      fontFamily: {
        display: ["var(--font-ivy)", "Georgia", "serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1240px",
        calc: "1100px",
      },
      boxShadow: {
        card: "0 30px 60px -30px rgba(25,55,45,0.3)",
        result: "0 40px 80px -40px rgba(0,0,0,0.5)",
        toast: "0 20px 50px -20px rgba(0,0,0,0.5)",
      },
      letterSpacing: {
        tightish: "-0.01em",
        eyebrow: "0.14em",
        label: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
