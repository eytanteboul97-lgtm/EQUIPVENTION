import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paper — near-white, slightly cool so navy/green both sit cleanly on it
        paper: "#F5F6F4",
        "paper-raised": "#FFFFFF",
        // Navy — EQUIP half of the wordmark: authority, compliance, seriousness
        navy: {
          DEFAULT: "#15233F",
          deep: "#0E1930",
          soft: "#E3E7EF",
        },
        // Green — VENTION half: subsidy obtained, growth, validation
        green: {
          DEFAULT: "#1E7A3B",
          bright: "#8CC63F",
          soft: "#DCEEDF",
        },
        ink: {
          DEFAULT: "#1C2333",
          soft: "#4A5165",
          faint: "#7B8093",
        },
        line: "#D6D4C9",
        alert: {
          DEFAULT: "#A23B2E",
          soft: "#F3DAD5",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        card: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(21,35,63,0.06), 0 8px 24px -12px rgba(21,35,63,0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
