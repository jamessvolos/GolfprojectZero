import Link from "next/link";
import { PillarNav } from "@/components/PillarNav";
import { getAllArchitects, getAllCourses, getAllTemplates } from "@/lib/queries";

export default async function HomePage() {
  const [templates, courses, architects] = await Promise.all([
    getAllTemplates(),
    getAllCourses(),
    getAllArchitects(),
  ]);

  // Feature the most-reproduced template — the clearest way in.
  const featured = [...templates].sort(
    (a, b) => b.instances.length - a.instances.length,
  )[0];

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
            This is a study of the holes that idea produced. Two lenses over one
            graph of architects, courses, and holes: a{" "}
            <em>classification</em> of the Golden Age template holes, and a{" "}
            <em>map</em> of the architects and courses that made them.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/templates"
            className="rounded-sm bg-fairway px-5 py-2.5 text-paper transition-colors hover:bg-fairway-deep"
          >
            Explore the templates →
          </Link>
          <Link
            href="/atlas"
            className="rounded-sm border border-paper-edge px-5 py-2.5 text-ink-soft transition-colors hover:border-fairway hover:text-fairway"
          >
            Open the atlas
          </Link>
        </div>
      </section>

      {/* Two pillars */}
      <section className="py-16">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-ink">Two lenses, one game</h2>
        </div>
        <PillarNav variant="cards" />
      </section>

      {/* At a glance */}
      <section className="grid gap-px overflow-hidden rounded-sm border border-paper-edge bg-paper-edge sm:grid-cols-3">
        <Stat n={templates.length} label="Template holes classified" href="/templates" />
        <Stat n={architects.length} label="Architects on the atlas" href="/atlas" />
        <Stat n={courses.length} label="Courses mapped" href="/atlas" />
      </section>

      {/* Featured template — deep appreciation for the archetypes */}
      {featured && (
        <section className="py-20">
          <p className="eyebrow mb-3">Start here</p>
          <h2 className="max-w-3xl font-serif text-3xl leading-tight text-ink">
            A template hole is a portable argument about risk and reward.
          </h2>
          <p className="mt-4 max-w-prose text-ink-soft">
            Macdonald and Raynor realized the great British holes were not
            accidents but <em>ideas</em> — the Redan, the Cape, the Biarritz —
            that could be abstracted and rebuilt anywhere. Each template states
            the decision it poses, then maps every course known to carry a
            version of it.
          </p>
          <Link
            href={`/templates/${featured.slug}`}
            className="mt-6 inline-block font-serif text-lg text-fairway underline decoration-fairway/30 underline-offset-4 hover:decoration-fairway"
          >
            Begin with the {featured.name} — {featured.instances.length} instances
            mapped →
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
