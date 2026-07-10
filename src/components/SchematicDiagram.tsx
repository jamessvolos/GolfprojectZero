/**
 * Aerial-style illustrations of the template archetypes, drawn as inline SVG.
 * Richer than a line diagram: gradient turf with contour shading, textured
 * bunkers with depth, water hazards, soft relief shadows, and a pin flag —
 * with the gold dashed line marking the intended play (see SchematicLegend).
 *
 * Rendered in-code (not image files) so they stay crisp at any size, live in
 * the palette, and never break. Where a real licensed photo exists it replaces
 * these via <Figure>; otherwise this is what shows.
 */

// Module counter → unique gradient/filter ids per render (server-rendered,
// static SVG, so no hydration concern).
let uidCounter = 0;

const GRN_STROKE = "#20362a";
const CONTOUR = "#8bb89a";
const SAND_LINE = "#a98f5c";
const INK = "#23201a";
const GOLD = "#a9823f";

type Slug =
  | "redan"
  | "eden"
  | "road"
  | "alps"
  | "cape"
  | "short"
  | "biarritz"
  | "punchbowl";

function Defs({ u }: { u: string }) {
  return (
    <defs>
      <radialGradient id={`grn-${u}`} cx="40%" cy="32%" r="80%">
        <stop offset="0%" stopColor="#5f8d6d" />
        <stop offset="58%" stopColor="#3c6149" />
        <stop offset="100%" stopColor="#274233" />
      </radialGradient>
      <linearGradient id={`snd-${u}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ecdcb0" />
        <stop offset="100%" stopColor="#c6ac74" />
      </linearGradient>
      <linearGradient id={`wtr-${u}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5f918c" />
        <stop offset="100%" stopColor="#325f5b" />
      </linearGradient>
      <linearGradient id={`turf-${u}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c9cf9f" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#8fa06a" stopOpacity="0.14" />
      </linearGradient>
      <filter id={`sh-${u}`} x="-25%" y="-25%" width="150%" height="160%">
        <feDropShadow
          dx="0"
          dy="1.3"
          stdDeviation="1.3"
          floodColor="#182619"
          floodOpacity="0.34"
        />
      </filter>
    </defs>
  );
}

/** Faint fairway ground behind the composition, for aerial depth. */
function Ground({ u }: { u: string }) {
  return (
    <rect x="0" y="0" width="200" height="140" fill={`url(#turf-${u})`} rx="4" />
  );
}

function Green({
  u,
  d,
  contour,
}: {
  u: string;
  d: string;
  contour?: string[];
}) {
  return (
    <g>
      <path d={d} fill={`url(#grn-${u})`} filter={`url(#sh-${u})`} />
      {contour?.map((c, i) => (
        <path
          key={i}
          d={c}
          fill="none"
          stroke={CONTOUR}
          strokeWidth="0.9"
          strokeOpacity="0.4"
        />
      ))}
      <path d={d} fill="none" stroke={GRN_STROKE} strokeWidth="1" strokeOpacity="0.75" />
    </g>
  );
}

function Bunker({
  u,
  cx,
  cy,
  rx,
  ry,
}: {
  u: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}) {
  return (
    <g filter={`url(#sh-${u})`}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#snd-${u})`} stroke={SAND_LINE} strokeWidth="0.8" />
      {/* inner shadow for depth */}
      <ellipse cx={cx} cy={cy + ry * 0.3} rx={rx * 0.78} ry={ry * 0.5} fill="#7a6537" opacity="0.2" />
    </g>
  );
}

function Water({ u, d }: { u: string; d: string }) {
  return (
    <g>
      <path d={d} fill={`url(#wtr-${u})`} />
      <path
        d={d}
        fill="none"
        stroke="#cfe6df"
        strokeWidth="0.7"
        strokeOpacity="0.45"
        strokeDasharray="7 5"
      />
    </g>
  );
}

function Tee({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 5} y={y - 3} width="10" height="6" rx="2" fill="#4f7458" opacity="0.85" />
      <circle cx={x} cy={y} r="1.5" fill={INK} />
    </g>
  );
}

function PlayLine({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={GOLD}
      strokeWidth="1.7"
      strokeDasharray="4 3"
      strokeLinecap="round"
    />
  );
}

function Flag({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="1.5" fill="#2a2018" />
      <line x1={x} y1={y} x2={x} y2={y - 12} stroke="#3a2b1c" strokeWidth="1" />
      <path d={`M${x} ${y - 12} l 7 2.2 l -7 2.2 z`} fill={GOLD} />
    </g>
  );
}

function shapeFor(slug: Slug, u: string): React.ReactNode {
  switch (slug) {
    case "redan":
      return (
        <>
          <Green
            u={u}
            d="M96 34 L150 46 L138 74 L84 60 Z"
            contour={["M92 46 Q118 52 140 62", "M98 40 Q120 46 144 54"]}
          />
          <Bunker u={u} cx={90} cy={70} rx={13} ry={6} />
          <Tee x={40} y={112} />
          <PlayLine d="M40 112 Q120 104 150 60 T112 50" />
          <Flag x={112} y={50} />
        </>
      );
    case "eden":
      return (
        <>
          <Green
            u={u}
            d="M78 40 L142 40 L150 66 L70 66 Z"
            contour={["M74 54 L146 54", "M76 48 L144 48"]}
          />
          <Bunker u={u} cx={132} cy={74} rx={11} ry={5.5} />
          <Bunker u={u} cx={84} cy={76} rx={12} ry={6} />
          <Tee x={110} y={116} />
          <PlayLine d="M110 116 L110 66" />
          <Flag x={110} y={50} />
        </>
      );
    case "road":
      return (
        <>
          {/* road + wall behind the green */}
          <line x1={70} y1={30} x2={158} y2={44} stroke="#5a5147" strokeWidth="3" strokeLinecap="round" />
          <line x1={70} y1={30} x2={158} y2={44} stroke="#7d7264" strokeWidth="1" strokeDasharray="5 4" />
          <Green u={u} d="M74 44 L150 56 L146 68 L70 56 Z" contour={["M72 56 L148 62"]} />
          <Bunker u={u} cx={92} cy={62} rx={9} ry={4.5} />
          <Tee x={36} y={116} />
          <PlayLine d="M36 116 L120 92 L128 62" />
          <Flag x={128} y={58} />
        </>
      );
    case "alps":
      return (
        <>
          {/* the dune ridge, shaded */}
          <path d="M46 84 L82 42 L112 74 L142 38 L172 80 L172 92 L46 92 Z" fill="#4a6b52" opacity="0.5" />
          <path d="M46 84 L82 42 L112 74 L142 38 L172 80" fill="none" stroke="#2c4636" strokeWidth="1.3" />
          <Green u={u} d="M100 28 L150 28 L150 42 L100 42 Z" contour={["M100 35 L150 35"]} />
          <Bunker u={u} cx={108} cy={86} rx={17} ry={5.5} />
          <Tee x={38} y={114} />
          <PlayLine d="M38 114 Q92 96 112 62" />
          <Flag x={124} y={35} />
        </>
      );
    case "cape":
      return (
        <>
          <Water u={u} d="M18 98 L120 40 L168 40 L168 122 L18 122 Z" />
          <Green u={u} d="M116 34 L152 34 L152 58 L108 58 Z" contour={["M110 46 L150 46"]} />
          <Tee x={34} y={122} />
          {/* bold line (solid) and the safe line (faint) */}
          <path d="M34 122 L130 46" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
          <path d="M34 122 Q58 92 124 54" fill="none" stroke="#efe6cd" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <Flag x={130} y={44} />
        </>
      );
    case "short":
      return (
        <>
          <Green
            u={u}
            d="M110 54 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0"
            contour={["M92 46 Q110 34 128 46 Q132 58 120 63"]}
          />
          <Bunker u={u} cx={110} cy={20} rx={11} ry={4.5} />
          <Bunker u={u} cx={148} cy={54} rx={5} ry={11} />
          <Bunker u={u} cx={72} cy={54} rx={5} ry={11} />
          <Bunker u={u} cx={110} cy={88} rx={11} ry={4.5} />
          <Tee x={110} y={120} />
          <PlayLine d="M110 120 L110 64" />
          <Flag x={116} y={50} />
        </>
      );
    case "biarritz":
      return (
        <>
          <Green u={u} d="M78 34 L142 34 L142 74 L78 74 Z" />
          {/* the swale across the middle, cut in shadow */}
          <rect x={78} y={50} width={64} height={9} fill="#2c4a38" opacity="0.55" />
          <line x1={78} y1={50} x2={142} y2={50} stroke="#1e3428" strokeWidth="0.8" />
          <line x1={78} y1={59} x2={142} y2={59} stroke="#1e3428" strokeWidth="0.8" />
          <path d="M78 34 L142 34 L142 74 L78 74 Z" fill="none" stroke={GRN_STROKE} strokeWidth="1" strokeOpacity="0.75" />
          <Bunker u={u} cx={70} cy={54} rx={4.5} ry={13} />
          <Bunker u={u} cx={150} cy={54} rx={4.5} ry={13} />
          <Tee x={110} y={118} />
          <PlayLine d="M110 118 L110 40" />
          <Flag x={110} y={40} />
        </>
      );
    case "punchbowl":
      return (
        <>
          {/* gathering bowl: nested rings shaded to read as a hollow */}
          <ellipse cx={110} cy={54} rx={42} ry={27} fill="#38553f" opacity="0.45" />
          <ellipse cx={110} cy={54} rx={42} ry={27} fill="none" stroke="#2c4636" strokeWidth="1" />
          <Green u={u} d="M110 54 m-27 0 a27 16 0 1 0 54 0 a27 16 0 1 0 -54 0" contour={["M110 54 m-13 0 a13 7 0 1 0 26 0 a13 7 0 1 0 -26 0"]} />
          <Tee x={110} y={120} />
          <PlayLine d="M110 120 Q110 92 110 62" />
          <Flag x={110} y={52} />
        </>
      );
  }
}

export function SchematicDiagram({
  slug,
  size = "hero",
  className = "",
}: {
  slug: string;
  size?: "thumb" | "hero" | "plate";
  className?: string;
}) {
  const u = `s${uidCounter++}`;
  const shape = shapeFor(slug as Slug, u);
  const dims =
    size === "thumb"
      ? "h-32 w-full"
      : size === "plate"
        ? "aspect-[3/2] w-full"
        : "aspect-[16/10] w-full max-w-lg";

  return (
    <svg
      viewBox="0 0 200 140"
      role="img"
      aria-label={`Illustration of the ${slug} template hole`}
      className={`${dims} ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <Defs u={u} />
      <Ground u={u} />
      {shape ?? (
        <Green u={u} d="M70 44 L130 44 L130 82 L70 82 Z" />
      )}
    </svg>
  );
}
