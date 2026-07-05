import Link from "next/link";
import { PillarNav } from "@/components/PillarNav";
import { getAllCourses, getAllTemplates, getDecisionHoles } from "@/lib/queries";

export default async function HomePage() {
  const [templates, decisions, courses] = await Promise.all([
    getAllTemplates(),
    getDecisionHoles(),
    getAllCourses(),
  ]);

  return (
    <div className="mx-auto max-w-shell px-5">
      {/* Thesis */}
      <section className="border-b border-paper-edge py-20 sm:py-28">
        <p className="eyebrow mb-6">Golf course architecture</p>
        <h1 className="max-w-4xl font-serif text-4xl leading-[1.1] text-ink sm:text-6xl">
          Every great hole is a{" "}
          <span className="text-fairway">decision problem.</span>
        </h1>
        <div className="mt-8 max-w-prose space-y-4 text-lg leading-relaxed text-ink-soft">
          <p>
            Strategic design — Macdonald, MacKenzie, Ross — does not punish the
            golfer. It offers a well-formed choice between risk and reward. The
            bold line and the safe line are both playable; the architecture
            simply makes the trade honest and lets the ground reward whoever
            reads it best.
          </p>
          <p>
            This site makes that idea explicit and interactive. Three lenses
            over one graph of architects, courses, and holes: a{" "}
            <em>classification system</em> of template holes, a{" "}
            <em>model of the decision</em> each famous hole poses, and a{" "}
            <em>map</em> of the golden age that produced them.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/decisions"
            className="rounded-sm bg-fairway px-5 py-2.5 text-paper transition-colors hover:bg-fairway-deep"
          >
            See a hole modelled →
          </Link>
          <Link
            href="/about"
            className="rounded-sm border border-paper-edge px-5 py-2.5 text-ink-soft transition-colors hover:border-fairway hover:text-fairway"
          >
            The thesis in full
          </Link>
        </div>
      </section>

      {/* Three pillars */}
      <section className="py-16">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-ink">Three lenses, one game</h2>
        </div>
        <PillarNav variant="cards" />
      </section>

      {/* At a glance */}
      <section className="grid gap-px overflow-hidden rounded-sm border border-paper-edge bg-paper-edge sm:grid-cols-3">
        <Stat n={templates.length} label="Template holes classified" href="/templates" />
        <Stat n={decisions.length} label="Decisions modelled hole-by-hole" href="/decisions" />
        <Stat n={courses.length} label="Courses on the atlas" href="/atlas" />
      </section>

      {/* Featured decision */}
      {decisions[0] && (
        <section className="py-20">
          <p className="eyebrow mb-3">The site&rsquo;s most distinctive page</p>
          <h2 className="max-w-3xl font-serif text-3xl leading-tight text-ink">
            Everyone describes holes. This models the decision.
          </h2>
          <p className="mt-4 max-w-prose text-ink-soft">
            Take a famous strategic hole and lay out the actual choice it poses —
            option by option, with the risk, the reward, and the strokes-gained
            intuition set side by side. The parallel layout <em>is</em> the
            argument.
          </p>
          <Link
            href={`/decisions/${decisions[0].slug}`}
            className="mt-6 inline-block font-serif text-lg text-fairway underline decoration-fairway/30 underline-offset-4 hover:decoration-fairway"
          >
            Start with the {decisions[0].course.name}, hole{" "}
            {decisions[0].number} →
          </Link>
        </section>
      )}
    </div>
  );
}

function Stat({
  n,
  label,
  href,
}: {
  n: number;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-paper p-8 transition-colors hover:bg-paper-deep/40"
    >
      <div className="font-serif text-5xl text-fairway">{n}</div>
      <div className="mt-2 text-sm text-ink-soft group-hover:text-ink">
        {label}
      </div>
    </Link>
  );
}
