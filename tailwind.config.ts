import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Old-school clubhouse palette — aged paper, painted racing green,
        // walnut panelling, polished brass, and the oxblood of a club tie.
        // No pure black, no pure white.
        paper: {
          DEFAULT: "#F4EEE0", // aged clubhouse cream
          deep: "#EAE1CC", // recessed panel / matting
          edge: "#D8CDB0", // warm hairline border (framed-board edge)
        },
        ink: {
          DEFAULT: "#211D17", // warm near-black
          soft: "#4A443A", // secondary text
          faint: "#79705F", // tertiary / captions
        },
        // Painted billiard/racing green — the club colour.
        fairway: {
          DEFAULT: "#2F5140",
          deep: "#213B2E",
          wash: "#E3EAE1",
        },
        // Deepest green — the painted entrance sign (header).
        clubhouse: {
          DEFAULT: "#1D3325",
          deep: "#152619",
        },
        // Walnut panelling — the honour-board wood (footer, dark chrome).
        walnut: {
          DEFAULT: "#3A2C23",
          deep: "#241B15",
          soft: "#5B473A",
        },
        // Polished brass — nameplates, emphasis, the line of play.
        gold: {
          DEFAULT: "#AE8A46",
          bright: "#C8A65C",
          deep: "#856531",
          wash: "#EFE3C8",
        },
        // Oxblood / claret — the club tie; the risk half of the ledger.
        claret: {
          DEFAULT: "#7C3A38",
          deep: "#5C2927",
          wash: "#ECDBD6",
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
