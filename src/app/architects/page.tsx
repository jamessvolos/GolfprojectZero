import Link from "next/link";
import { getAllArchitects } from "@/lib/queries";
import { ERAS, eraLabel, schoolLabel } from "@/lib/taxonomy";

export const metadata = {
  title: "Architects",
  description:
    "The architects of the Golden Age and the minimalist revival — grouped by era, with their design school, dates, and the courses they left behind.",
};

export default async function ArchitectsIndexPage() {
  const architects = await getAllArchitects();

  // Group by era, in canonical era order.
  const byEra = ERAS.map((e) => ({
    era: e,
    people: architects
      .filter((a) => a.era === e.value)
      .sort((a, b) => (a.born ?? 9999) - (b.born ?? 9999)),
  })).filter((g) => g.people.length > 0);

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/atlas" className="hover:text-fairway">
          Atlas
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-soft">Architects</span>
      </nav>

      <header className="max-w-prose border-b border-paper-edge pb-10">
        <p className="eyebrow mb-4">Pillar II · The people</p>
        <h1 className="font-serif text-4xl leading-tight text-ink">Architects</h1>
        <p className="mt-5 text-ink-soft">
          The hands behind the holes — the Golden Age masters who built the
          strategic tradition, and the modern minimalists who returned to it.
          Grouped by era; select any name for their courses and the templates
          they favored.
        </p>
      </header>

      <div className="mt-12 space-y-14">
        {byEra.map((g) => (
          <section key={g.era.value}>
            <div className="mb-5 flex items-baseline gap-3">
              <h2 className="font-serif text-2xl text-ink">{g.era.label}</h2>
              <span className="text-sm text-ink-faint">{g.era.blurb}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.people.map((a) => {
                const dates =
                  a.born || a.died
                    ? `${a.born ?? "?"}–${a.died ?? "present"}`
                    : null;
                return (
                  <Link
                    key={a.id}
                    href={`/architects/${a.slug}`}
                    className="group flex flex-col rounded-sm border border-paper-edge bg-paper-card p-5 transition-colors hover:border-fairway"
                  >
                    <h3 className="font-serif text-xl leading-tight text-ink group-hover:text-fairway">
                      {a.name}
                    </h3>
                    {dates && (
                      <p className="mt-1 text-sm text-ink-faint tabular-nums">
                        {dates}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                      <span className="rounded-full bg-fairway-wash px-2 py-0.5 text-xs text-fairway-deep">
                        {schoolLabel(a.school)}
                      </span>
                      <span className="text-sm text-ink-faint">
                        {a.courses.length}{" "}
                        {a.courses.length === 1 ? "course" : "courses"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
