import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossLinkChip } from "@/components/CrossLinkChip";
import { DecisionOptions } from "@/components/DecisionOptions";
import { MarkdownProse } from "@/components/MarkdownProse";
import { getDecisionHoles, getHoleBySlug } from "@/lib/queries";

export async function generateStaticParams() {
  const holes = await getDecisionHoles();
  return holes.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const h = await getHoleBySlug(params.slug);
  return {
    title: h ? `${h.course.name}, Hole ${h.number} — Decision` : "Decision",
  };
}

export default async function DecisionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const hole = await getHoleBySlug(params.slug);
  if (!hole || !hole.decisionBrief) notFound();

  const templateInstance = hole.templateInstances[0];

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/decisions" className="hover:text-fairway">
          Decisions
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-soft">
          {hole.course.name}, {hole.number}
        </span>
      </nav>

      {/* Hero */}
      <header className="border-b border-paper-edge pb-10">
        <p className="eyebrow mb-3">Decision architecture</p>
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          <Link
            href={`/courses/${hole.course.slug}`}
            className="hover:text-fairway"
          >
            {hole.course.name}
          </Link>
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          Hole {hole.number} · Par {hole.par}
          {hole.yardage ? ` · ${hole.yardage} yards` : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {hole.course.architect && (
            <CrossLinkChip
              href={`/architects/${hole.course.architect.slug}`}
              prefix="Design"
              label={hole.course.architect.name}
              tone="architect"
            />
          )}
          {templateInstance && (
            <CrossLinkChip
              href={`/templates/${templateInstance.template.slug}`}
              prefix="This is a"
              label={templateInstance.template.name}
              tone="template"
            />
          )}
        </div>
      </header>

      {/* Decision brief — framing the fork */}
      <section className="my-12 max-w-3xl">
        <p className="eyebrow mb-3">The fork</p>
        <MarkdownProse className="prose-strategic text-xl leading-relaxed text-ink [&_strong]:text-fairway-deep">
          {hole.decisionBrief}
        </MarkdownProse>
      </section>

      {/* Options laid out in parallel — the argument */}
      <section>
        <h2 className="mb-5 font-serif text-2xl text-ink">The options</h2>
        <DecisionOptions options={hole.options} />
        <p className="mt-4 max-w-prose text-sm text-ink-faint">
          Expected-value notes are qualitative — the shape of the tradeoff, not
          fabricated strokes-gained figures. Where a defensible number exists it
          is cited; otherwise the intuition stands on its own.
        </p>
      </section>

      {/* The point of the hole */}
      {hole.summary && (
        <section className="mt-14 max-w-prose border-t border-paper-edge pt-10">
          <MarkdownProse>{hole.summary}</MarkdownProse>
        </section>
      )}

      <div className="mt-12">
        <Link
          href="/decisions"
          className="text-sm text-fairway underline decoration-fairway/30 underline-offset-4 hover:decoration-fairway"
        >
          ← All decision breakdowns
        </Link>
      </div>
    </div>
  );
}
