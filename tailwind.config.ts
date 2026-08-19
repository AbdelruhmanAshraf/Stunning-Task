import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090a10",
        foreground: "#f8fafc",
        surface: {
          50: "#181a28",
          100: "#131522",
          200: "#0f101c",
          300: "#0b0c14",
          card: "rgba(18, 20, 34, 0.75)",
          cardHover: "rgba(28, 30, 48, 0.85)",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          glow: "rgba(147, 51, 234, 0.45)",
          active: "rgba(139, 36, 245, 0.6)",
        },
        brand: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#8b24f5",
          800: "#6b21a8",
          900: "#581c87",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
        },
      },
      borderRadius: {
        DEFAULT: "12px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        glow: "0 0 35px -5px rgba(139, 36, 245, 0.4)",
        glowCyan: "0 0 25px -5px rgba(6, 182, 212, 0.3)",
        card: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        cat: "0 10px 40px -10px rgba(139, 36, 245, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
