import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f6f7fb",
          100: "#eceef5",
          200: "#d6dae8",
          300: "#b1b9d3",
          700: "#2b3350",
          800: "#1c2238",
          900: "#111523",
          950: "#0a0d1a",
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config;
