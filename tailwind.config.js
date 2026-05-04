/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-elevated)",
          sidebar: "var(--bg-sidebar)",
          card: "var(--bg-card)",
          hover: "var(--bg-hover)",
          active: "var(--bg-active)",
          elevated: "var(--bg-elevated)",
        },
        accent: {
          green: "var(--color-accent)",
          "green-light": "var(--color-accent-light)",
          "green-dark": "var(--color-accent)",
          "green-muted": "var(--color-accent-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          light: "var(--border-light)",
          subtle: "var(--border)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
          arabic: "var(--text-arabic)",
        },
        icon: {
          DEFAULT: "var(--text-icon)",
          hover: "var(--text-primary)",
          active: "var(--color-accent)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Amiri", "serif"],
        "arabic-kfgq": ["KFGQPC Uthmanic Script HAFS", "serif"],
        "arabic-amiri": ["Amiri Quran", "Amiri", "serif"],
        "arabic-scheherazade": ["Scheherazade New", "serif"],
        "arabic-noor": ["Noor", "serif"],
      },
      fontSize: {
        "arabic-sm": ["1.5rem", { lineHeight: "3rem" }],
        "arabic-md": ["2rem", { lineHeight: "3.5rem" }],
        "arabic-lg": ["2.5rem", { lineHeight: "4rem" }],
        "arabic-xl": ["3rem", { lineHeight: "5rem" }],
      },
      width: {
        sidebar: "60px",
        "surah-list": "280px",
        "settings-panel": "300px",
      },
      animation: {
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        sidebar: "2px 0 8px rgba(0,0,0,0.4)",
        card: "0 2px 8px rgba(0,0,0,0.3)",
        modal: "0 8px 32px rgba(0,0,0,0.6)",
        glow: "0 0 12px rgba(66, 128, 56, 0.3)",
      },
    },
  },
  plugins: [],
};
// Force Tailwind to recompile variables
