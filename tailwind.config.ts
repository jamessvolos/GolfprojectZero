import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens — no pure black, no pure white.
        paper: {
          DEFAULT: "#F7F4EC", // warm paper background
          deep: "#EFEADD", // slightly recessed panels
          edge: "#E4DECB", // hairline borders
        },
        ink: {
          DEFAULT: "#1C1A17", // primary text
          soft: "#4A463E", // secondary text
          faint: "#7C7565", // tertiary / captions
        },
        fairway: {
          DEFAULT: "#3A5A40", // muted fairway green accent
          deep: "#2C4632",
          wash: "#E8EDE6",
        },
        gold: {
          DEFAULT: "#B08D4C", // single restrained gold for emphasis
          deep: "#8C6E37",
          wash: "#F0E7D4",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
        shell: "72rem",
      },
      typography: {},
      letterSpacing: {
        label: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
