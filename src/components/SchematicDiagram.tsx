/**
 * Schematic diagrams of the template archetypes, drawn as inline SVG keyed by
 * slug. Rendering them in-code (rather than referencing image files) keeps them
 * on-palette, crisp at any size, and impossible to leave broken.
 *
 * Palette: ink lines, fairway-green putting surface, sandy bunkers, and a gold
 * dashed "line of play" that encodes each template's intended decision.
 */
// Kept in step with the clubhouse tokens in tailwind.config.ts.
const INK = "#211D17";
const FAIRWAY = "#2F5140";
const FAIRWAY_WASH = "#E3EAE1";
const GOLD = "#AE8A46";
const SAND = "#E4D8B8";
const SAND_LINE = "#C7B98F";

type Slug =
  | "redan"
  | "eden"
  | "road"
  | "alps"
  | "cape"
  | "short"
  | "biarritz"
  | "punchbowl";

function Tee({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={2.6} fill={INK} />;
}

function Bunker(props: React.SVGProps<SVGEllipseElement>) {
  return <ellipse fill={SAND} stroke={SAND_LINE} strokeWidth={1} {...props} />;
}

const line = {
  fill: "none",
  stroke: GOLD,
  strokeWidth: 1.6,
  strokeDasharray: "4 3",
  strokeLinecap: "round" as const,
};

const SHAPES: Record<Slug, React.ReactNode> = {
  redan: (
    <>
      {/* green on a diagonal shelf, angled away, tilting front-right→back-left */}
      <path
        d="M96 34 L150 46 L138 74 L84 60 Z"
        fill={FAIRWAY_WASH}
        stroke={FAIRWAY}
        strokeWidth={1.4}
      />
      <Bunker cx={92} cy={70} rx={13} ry={6} />
      <Tee x={40} y={112} />
      {/* running line fed off the right, chasing the slope to the hidden flag */}
      <path d="M40 112 Q120 104 150 60 T112 50" {...line} />
      <circle cx={112} cy={50} r={2.4} fill={GOLD} />
    </>
  ),
  eden: (
    <>
      {/* back-to-front green pinched between two fierce bunkers */}
      <path
        d="M78 40 L142 40 L150 66 L70 66 Z"
        fill={FAIRWAY_WASH}
        stroke={FAIRWAY}
        strokeWidth={1.4}
      />
      <Bunker cx={132} cy={74} rx={11} ry={5.5} />
      <Bunker cx={84} cy={76} rx={12} ry={6} />
      <Tee x={110} y={116} />
      <path d="M110 116 L110 66" {...line} />
      <circle cx={110} cy={52} r={2.4} fill={GOLD} />
    </>
  ),
  road: (
    <>
      {/* the road + wall behind a long, thin, angled green */}
      <line x1={70} y1={30} x2={158} y2={44} stroke={INK} strokeWidth={2} />
      <line
        x1={70}
        y1={34}
        x2={158}
        y2={48}
        stroke={SAND_LINE}
        strokeWidth={1}
      />
      <path
        d="M74 44 L150 56 L146 68 L70 56 Z"
        fill={FAIRWAY_WASH}
        stroke={FAIRWAY}
        strokeWidth={1.4}
      />
      {/* the Road bunker biting into the front-left shoulder */}
      <Bunker cx={92} cy={62} rx={9} ry={4.5} />
      <Tee x={36} y={116} />
      {/* the tee shot cutting the corner, then the approach to the sliver */}
      <path d="M36 116 L120 92" {...line} />
      <path d="M120 92 L128 62" {...line} />
      <circle cx={128} cy={60} r={2.4} fill={GOLD} />
    </>
  ),
  alps: (
    <>
      {/* the blind ridge, with the green hidden behind and the Sahara in front */}
      <path
        d="M56 78 L84 44 L112 70 L140 40 L162 74"
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
      />
      <path
        d="M100 30 L150 30 L150 42 L100 42 Z"
        fill={FAIRWAY_WASH}
        stroke={FAIRWAY}
        strokeWidth={1.4}
      />
      <Bunker cx={108} cy={82} rx={16} ry={6} />
      <Tee x={40} y={112} />
      <path d="M40 112 Q92 96 112 62" {...line} />
      <circle cx={122} cy={40} r={2.4} fill={GOLD} />
    </>
  ),
  cape: (
    <>
      {/* the diagonal hazard; green thrust out over it; a bold and a safe line */}
      <path
        d="M20 96 L120 40 L164 40 L164 118 L20 118 Z"
        fill={SAND}
        opacity={0.5}
      />
      <path
        d="M118 34 L150 34 L150 56 L110 56 Z"
        fill={FAIRWAY_WASH}
        stroke={FAIRWAY}
        strokeWidth={1.4}
      />
      <Tee x={36} y={120} />
      {/* bold line: bite off more of the carry */}
      <path d="M36 120 L128 46" stroke={GOLD} strokeWidth={1.8} fill="none" />
      {/* safe line: dashed, longer way round */}
      <path
        d="M36 120 Q60 92 122 52"
        {...line}
        stroke={INK}
        opacity={0.55}
      />
      <circle cx={128} cy={46} r={2.4} fill={GOLD} />
    </>
  ),
  short: (
    <>
      {/* big green ringed by bunkers, with an internal horseshoe ridge */}
      <circle
        cx={110}
        cy={54}
        r={30}
        fill={FAIRWAY_WASH}
        stroke={FAIRWAY}
        strokeWidth={1.4}
      />
      <path
        d="M92 46 Q110 34 128 46 Q132 58 120 64"
        fill="none"
        stroke={FAIRWAY}
        strokeWidth={1.2}
        opacity={0.7}
      />
      <Bunker cx={110} cy={22} rx={11} ry={4.5} />
      <Bunker cx={148} cy={54} rx={5} ry={11} />
      <Bunker cx={72} cy={54} rx={5} ry={11} />
      <Bunker cx={110} cy={86} rx={11} ry={4.5} />
      <Tee x={110} y={120} />
      <path d="M110 120 L110 64" {...line} />
      <circle cx={118} cy={52} r={2.4} fill={GOLD} />
    </>
  ),
  biarritz: (
    <>
      {/* long narrow green split by a deep swale, bunkers both flanks */}
      <path
        d="M78 34 L142 34 L142 74 L78 74 Z"
        fill={FAIRWAY_WASH}
        stroke={FAIRWAY}
        strokeWidth={1.4}
      />
      {/* the swale across the middle */}
      <rect x={78} y={50} width={64} height={9} fill={SAND} opacity={0.7} />
      <line x1={78} y1={50} x2={142} y2={50} stroke={SAND_LINE} strokeWidth={1} />
      <line x1={78} y1={59} x2={142} y2={59} stroke={SAND_LINE} strokeWidth={1} />
      <Bunker cx={70} cy={54} rx={4.5} ry={13} />
      <Bunker cx={150} cy={54} rx={4.5} ry={13} />
      <Tee x={110} y={118} />
      <path d="M110 118 L110 74" {...line} />
      {/* running through the swale to the back plateau */}
      <path d="M110 74 L110 40" {...line} opacity={0.8} />
      <circle cx={110} cy={40} r={2.4} fill={GOLD} />
    </>
  ),
  punchbowl: (
    <>
      {/* gathering bowl: concentric rings feeding to the center */}
      <ellipse
        cx={110}
        cy={54}
        rx={40}
        ry={26}
        fill={SAND}
        opacity={0.35}
        stroke={SAND_LINE}
        strokeWidth={1}
      />
      <ellipse
        cx={110}
        cy={54}
        rx={27}
        ry={17}
        fill={FAIRWAY_WASH}
        stroke={FAIRWAY}
        strokeWidth={1.4}
      />
      <ellipse cx={110} cy={54} rx={13} ry={8} fill="none" stroke={FAIRWAY} strokeWidth={1} opacity={0.6} />
      <Tee x={110} y={120} />
      {/* semi-blind approach over the fronting rise, gathered to the middle */}
      <path d="M110 120 Q110 92 110 62" {...line} />
      <circle cx={110} cy={54} r={2.4} fill={GOLD} />
    </>
  ),
};

export function SchematicDiagram({
  slug,
  size = "hero",
  className = "",
}: {
  slug: string;
  size?: "thumb" | "hero" | "plate";
  className?: string;
}) {
  const shape = SHAPES[slug as Slug];
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
      aria-label={`Schematic of the ${slug} template`}
      className={`${dims} ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x={0} y={0} width={200} height={140} fill="transparent" />
      {shape ?? (
        <>
          <rect
            x={70}
            y={40}
            width={60}
            height={40}
            rx={4}
            fill={FAIRWAY_WASH}
            stroke={FAIRWAY}
            strokeWidth={1.4}
          />
          <Tee x={100} y={116} />
          <path d="M100 116 L100 80" {...line} />
        </>
      )}
    </svg>
  );
}
