import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        brand: {
          blue: "#1a6ff4",
          dark: "#0f172a",
        },
        app: {
          bg: "#FFFEF9",
        },
        button: {
          start: "#004772",
          end: "#0086D8",
        },
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(to right, #004772, #0086D8)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 8px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.04)",
        "card-hover": "0 6px 24px rgba(0,0,0,0.12)",
        dropdown: "0 8px 40px rgba(0,0,0,0.14)",
        nav: "0 1px 4px rgba(0,0,0,0.06)",
        "3d": "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 18px -7px rgba(0, 0, 0, 0.08)",
        "3d-hover": "0 20px 40px -5px rgba(0, 0, 0, 0.15), 0 10px 20px -7px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
