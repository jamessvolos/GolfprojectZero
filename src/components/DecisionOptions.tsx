import { MarkdownProse } from "./MarkdownProse";

/**
 * Page 2's centerpiece. Each option is a parallel panel with Reward / Risk /
 * Expected-value intuition. The parallel layout IS the argument — a golfer
 * should see the tradeoff at a glance — so the panels sit side by side on wide
 * screens and share aligned section rows.
 */
export interface DecisionOptionData {
  id: string;
  label: string;
  reward: string;
  risk: string;
  expectedNote: string;
  order: number;
}

function Row({
  heading,
  tone,
  children,
}: {
  heading: string;
  tone: "reward" | "risk" | "expected";
  children: string;
}) {
  // Reward in club green, risk in the oxblood of the club tie, the reckoning
  // in brass — the ledger reads at a glance.
  const accent =
    tone === "reward"
      ? "text-fairway-deep"
      : tone === "risk"
        ? "text-claret-deep"
        : "text-gold-deep";
  return (
    <div className="border-t border-paper-edge px-5 py-4">
      <div className={`eyebrow mb-1.5 ${accent}`}>{heading}</div>
      <MarkdownProse className="text-sm leading-relaxed text-ink-soft [&_strong]:text-ink [&_strong]:font-semibold">
        {children}
      </MarkdownProse>
    </div>
  );
}

export function DecisionOptions({
  options,
}: {
  options: DecisionOptionData[];
}) {
  const sorted = [...options].sort((a, b) => a.order - b.order);

  return (
    <div
      className="grid gap-5"
      style={{
        // Responsive by design: panels sit side by side on wide screens and
        // stack on narrow ones, so the parallel argument survives on mobile.
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
      }}
    >
      {sorted.map((o, i) => (
        <section
          key={o.id}
          className="flex flex-col overflow-hidden rounded-sm border border-paper-edge bg-paper"
        >
          <header className="border-b border-gold/30 bg-paper-deep/60 px-5 py-4">
            <div className="eyebrow text-ink-faint">
              Option {["A", "B", "C", "D"][i] ?? i + 1}
            </div>
            <h3 className="mt-1 font-serif text-lg leading-snug text-ink">
              {o.label}
            </h3>
          </header>
          <Row heading="Reward" tone="reward">
            {o.reward}
          </Row>
          <Row heading="Risk" tone="risk">
            {o.risk}
          </Row>
          <Row heading="Expected value" tone="expected">
            {o.expectedNote}
          </Row>
        </section>
      ))}
    </div>
  );
}
