/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4F46E5",  // electric indigo
          dark: "#3730A3",
          light: "#818CF8",
          lighter: "#C7D2FE",
        },
        navy: {
          DEFAULT: "#0A0F2E",
          mid: "#111827",
          light: "#1E2746",
        },
        gold: {
          DEFAULT: "#F59E0B",
          light: "#FDE68A",
          dark: "#B45309",
        },
        saffron: "#FF6B00",
        emerald: {
          DEFAULT: "#10B981",
          light: "#6EE7B7",
          dark: "#065F46",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "mesh-drift": "meshDrift 20s ease-in-out infinite alternate",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "slide-in": "slideIn 0.4s ease-out forwards",
        "spin-slow": "spin 3s linear infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        meshDrift: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(-20px, -30px) scale(1.05)" },
          "66%": { transform: "translate(15px, -15px) scale(0.98)" },
          "100%": { transform: "translate(-10px, 20px) scale(1.02)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "brand-glow": "0 0 20px rgba(79, 70, 229, 0.35)",
        "gold-glow": "0 0 20px rgba(245, 158, 11, 0.35)",
        "card": "0 4px 24px rgba(10, 15, 46, 0.08)",
        "card-hover": "0 8px 40px rgba(10, 15, 46, 0.15)",
        "glass": "0 8px 32px rgba(10, 15, 46, 0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};