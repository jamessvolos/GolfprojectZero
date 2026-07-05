/**
 * A key to the schematic vocabulary — so the hole diagrams read at a glance.
 * Mirrors the marks drawn in SchematicDiagram: the putting surface, bunkers,
 * the tee, and the gold dashed line of intended play.
 */
const ITEMS: { label: string; swatch: React.ReactNode }[] = [
  {
    label: "Putting surface",
    swatch: (
      <span className="block h-3 w-4 rounded-[1px] border border-fairway bg-fairway/20" />
    ),
  },
  {
    label: "Bunker",
    swatch: (
      <span className="block h-3 w-4 rounded-full border border-[#a08a5f] bg-[#c9b98a]/50" />
    ),
  },
  {
    label: "Tee",
    swatch: <span className="block h-2.5 w-2.5 rounded-full bg-ink" />,
  },
  {
    label: "Intended line of play",
    swatch: (
      <span
        className="block h-0 w-5 border-t-2 border-dashed border-gold"
        aria-hidden
      />
    ),
  },
];

export function SchematicLegend({ className = "" }: { className?: string }) {
  return (
    <dl
      className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}
      aria-label="Key to the hole diagram"
    >
      {ITEMS.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <dt className="flex items-center" aria-hidden>
            {it.swatch}
          </dt>
          <dd className="font-sans text-[0.7rem] uppercase tracking-wider text-ink-faint">
            {it.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
