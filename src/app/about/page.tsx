import Link from "next/link";

export const metadata = {
  title: "Colophon",
  description:
    "The thesis, the sources, and the method behind The Strategic Line — and a note on curation, attribution, and why the expected-value figures stay qualitative.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-prose px-5 py-16">
      <p className="eyebrow mb-4">Colophon</p>
      <h1 className="font-serif text-4xl leading-tight text-ink">
        The thesis, the sources, the method
      </h1>

      <div className="prose-strategic mt-8">
        <h2>The thesis</h2>
        <p>
          This site is built on a single idea: <strong>every great hole is a
          decision problem.</strong> Strategic golf architecture — the tradition
          of Macdonald, MacKenzie, Ross, Thomas, and their modern heirs — does
          not punish the golfer. It offers a well-formed choice between risk and
          reward. The bold line and the safe line are both playable; the design
          simply prices each honestly and lets the ground reward whoever reads
          it best.
        </p>
        <p>
          The three pillars are three lenses on that one idea.{" "}
          <Link href="/templates">Templates</Link> treat holes as a
          classification system — portable arguments about risk and reward.{" "}
          <Link href="/decisions">Decisions</Link> model the fork a specific
          hole poses, option by option. The{" "}
          <Link href="/atlas">Atlas</Link> places the architects and courses of
          the golden age on a map and a timeline. All three read from the same
          graph of architects, courses, and holes.
        </p>

        <h2>Method</h2>
        <p>
          Content is authored as markdown in the repository and seeded into the
          database at build — there is no CMS. Each content type follows a fixed
          authoring loop (documented in <code>/content/_templates</code>) so
          that adding to the site is mechanical rather than inventive each time.
        </p>
        <p>
          Where the site models the expected value of a decision, the notes are{" "}
          <strong>qualitative</strong> — the shape of the tradeoff, not
          fabricated strokes-gained figures. The PGA Tour&rsquo;s strokes-gained
          baseline is public and could support real numbers later; until then,
          the intuition stands on its own rather than borrowing false precision.
        </p>

        <h2>On attribution</h2>
        <p>
          Which course has which template, and who deserves restoration credit,
          are genuinely contested in enthusiast sources. Rather than smooth those
          disputes over, the site holds them: the <em>notes</em> and{" "}
          <em>restorations</em> fields exist to record nuance and uncertainty
          honestly. This careful curation — not the software — is the point.
        </p>

        <h2>Colophon</h2>
        <p>
          Set in <strong>Fraunces</strong> (display) and{" "}
          <strong>Inter</strong> (text). Built with Next.js, TypeScript,
          Tailwind, and Prisma. Maps use OpenStreetMap tiles via Leaflet, with
          coordinates entered by hand. A personal project by James Svolos.
        </p>
        <p>
          The three working titles considered were <em>The Strategic Line</em>,{" "}
          <em>Redan</em>, and <em>The Ideal Hole</em>. The first won: it names
          exactly what the site is about — the line of play a strategic hole
          invites you to find.
        </p>
      </div>
    </div>
  );
}
