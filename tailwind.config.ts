import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gallery palette — light aged paper, forest green as the lead accent,
        // flat ochre brass as the quiet second. No pure black, no pure white.
        paper: {
          DEFAULT: "#EFE8D5", // aged paper ground
          deep: "#E7DDC4", // recessed panel
          edge: "#D6CBAE", // hairline border
          card: "#F7F1E1", // raised plate / card
        },
        ink: {
          DEFAULT: "#23201A", // warm near-black
          soft: "#524B39", // secondary text
          faint: "#8A8067", // tertiary / captions
        },
        // Forest green — the lead accent (structure, action, links).
        fairway: {
          DEFAULT: "#2F5140",
          deep: "#203A2C",
          wash: "#E4EAE0",
        },
        // Deep green — the footer anchor.
        clubhouse: {
          DEFAULT: "#233F30",
          deep: "#1A2E22",
        },
        // Walnut — small warm accents only.
        walnut: {
          DEFAULT: "#3A2C22",
          deep: "#241B15",
          soft: "#5B473A",
        },
        // Flat ochre brass — the quiet second accent.
        gold: {
          DEFAULT: "#A9823F",
          bright: "#C8A763",
          deep: "#7D5F2B",
          wash: "#EFE3C6",
        },
        // Oxblood — reserved emphasis.
        claret: {
          DEFAULT: "#7A322C",
          deep: "#5C2927",
          wash: "#ECDBD6",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
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
