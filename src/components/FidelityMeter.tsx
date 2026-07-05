/**
 * How faithful a template instance is to the archetype, 1–5. Five small marks;
 * filled marks in gold. Purely presentational.
 */
export function FidelityMeter({
  value,
  showLabel = true,
}: {
  value: number;
  showLabel?: boolean;
}) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <span
      className="inline-flex items-center gap-2"
      title={`Fidelity to the archetype: ${v} of 5`}
    >
      <span className="flex items-center gap-1" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={[
              "h-1.5 w-4 rounded-full",
              i < v ? "bg-gold" : "bg-paper-edge",
            ].join(" ")}
          />
        ))}
      </span>
      {showLabel && (
        <span className="text-xs text-ink-faint">
          <span className="sr-only">Fidelity </span>
          {v}/5
        </span>
      )}
    </span>
  );
}
