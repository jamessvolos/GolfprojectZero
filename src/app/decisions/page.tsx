import { EntityCard } from "@/components/EntityCard";
import { getDecisionHoles } from "@/lib/queries";

export const metadata = { title: "Decisions" };

// Pull the "the choice" line out of the decision brief for the card teaser:
// prefer a sentence that names the fork, else the first sentence.
function teaser(brief: string): string {
  const clean = brief.replace(/[*_`>#]/g, "").replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.?!])\s+/);
  const choice = sentences.find((s) => /choice|fork|decision/i.test(s));
  return (choice ?? sentences[0] ?? clean).trim();
}

export default async function DecisionsPage() {
  const holes = await getDecisionHoles();

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <header className="max-w-prose border-b border-paper-edge pb-10">
        <p className="eyebrow mb-4">Pillar II · The choice each hole poses</p>
        <h1 className="font-serif text-4xl leading-tight text-ink">
          Decision architecture
        </h1>
        <div className="mt-5 space-y-4 text-ink-soft">
          <p>
            Everyone <em>describes</em> holes. This page <em>models the
            decision.</em> Each breakdown takes a famous strategic hole and lays
            out the actual choice it poses — option by option, with the reward,
            the risk, and the strokes-gained intuition set in parallel.
          </p>
          <p>
            The parallel layout is the argument: a golfer should see the trade
            at a glance. A small, carefully authored set — quality over
            coverage.
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {holes.map((h) => {
          const isTemplate = h.templateInstances[0]?.template;
          return (
            <EntityCard
              key={h.id}
              href={`/decisions/${h.slug}`}
              eyebrow={
                <span>
                  {h.course.name} · Hole {h.number}
                </span>
              }
              title={`Par ${h.par}${h.yardage ? ` · ${h.yardage} yds` : ""}`}
              subtitle={
                isTemplate ? `A ${isTemplate.name} template` : undefined
              }
              footer={
                <span className="text-fairway-deep">
                  {h.options.length} options laid out in parallel →
                </span>
              }
            >
              <p className="italic text-ink-soft">
                The choice: {h.decisionBrief ? teaser(h.decisionBrief) : ""}
              </p>
            </EntityCard>
          );
        })}
      </div>

      {holes.length === 0 && (
        <p className="mt-10 rounded-sm border border-paper-edge bg-paper-deep/40 p-8 text-center text-ink-faint">
          No decision breakdowns authored yet.
        </p>
      )}
    </div>
  );
}
