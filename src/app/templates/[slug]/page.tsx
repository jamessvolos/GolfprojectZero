import Link from "next/link";
import { notFound } from "next/navigation";
import { CompareTray, type InstanceData } from "@/components/CompareTray";
import { CrossLinkChip } from "@/components/CrossLinkChip";
import { MarkdownProse } from "@/components/MarkdownProse";
import { SchematicDiagram } from "@/components/SchematicDiagram";
import { getAllTemplates, getTemplateBySlug } from "@/lib/queries";
import { excerpt } from "@/lib/site";

export async function generateStaticParams() {
  const templates = await getAllTemplates();
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const t = await getTemplateBySlug(params.slug);
  if (!t) return { title: "Template" };
  const description = excerpt(t.strategicIdea);
  return {
    title: `${t.name} — Template`,
    description,
    openGraph: { title: `${t.name} — Template`, description },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [template, all] = await Promise.all([
    getTemplateBySlug(params.slug),
    getAllTemplates(),
  ]);
  if (!template) notFound();

  // Architects who used this template (unique, from the instances' courses).
  const architects = new Map<
    string,
    { slug: string; name: string }
  >();
  for (const inst of template.instances) {
    const a = inst.hole.course.architect;
    if (a) architects.set(a.slug, { slug: a.slug, name: a.name });
  }

  // Related templates: those sharing at least one architect with this one.
  const myArchitectSlugs = new Set([...architects.keys()]);
  const related = all
    .filter((t) => t.slug !== template.slug)
    .map((t) => {
      const shared = new Set<string>();
      for (const inst of t.instances) {
        const s = inst.hole.course.architect?.slug;
        if (s && myArchitectSlugs.has(s)) shared.add(s);
      }
      return { template: t, sharedCount: shared.size };
    })
    .filter((x) => x.sharedCount > 0)
    .sort((a, b) => b.sharedCount - a.sharedCount)
    .slice(0, 4);

  const instances: InstanceData[] = template.instances.map((inst) => ({
    id: inst.id,
    courseName: inst.hole.course.name,
    courseSlug: inst.hole.course.slug,
    holeNumber: inst.hole.number,
    holeSlug: inst.hole.slug,
    par: inst.hole.par,
    yardage: inst.hole.yardage,
    architectName: inst.hole.course.architect?.name ?? null,
    fidelity: inst.fidelity,
    notes: inst.notes,
  }));

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <Breadcrumb name={template.name} />

      {/* Hero */}
      <header className="grid items-start gap-8 border-b border-paper-edge pb-12 md:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow mb-4">Template</p>
          <h1 className="font-serif text-5xl leading-none text-ink">
            {template.name}
          </h1>
          <p className="mt-4 text-ink-faint">
            <span className="uppercase tracking-label text-xs">Origin</span>
            <br />
            {template.originCourse}
          </p>
          <MarkdownProse className="prose-strategic mt-6">
            {template.description}
          </MarkdownProse>
        </div>
        <div className="rounded-sm border border-paper-edge bg-paper-deep/30 p-6">
          <SchematicDiagram slug={template.slug} size="hero" className="mx-auto" />
          <p className="mt-3 text-center text-xs text-ink-faint">
            Schematic of the archetype. Gold marks the intended line of play.
          </p>
        </div>
      </header>

      {/* The strategic idea — the spine. Rendered prominently. */}
      <section className="my-14 rounded-sm border-l-2 border-gold bg-gold-wash/40 px-6 py-8 sm:px-10 sm:py-10">
        <p className="eyebrow mb-3 text-gold-deep">The strategic idea</p>
        <MarkdownProse className="prose-strategic max-w-3xl text-lg leading-relaxed text-ink [&_strong]:text-fairway-deep">
          {template.strategicIdea}
        </MarkdownProse>
      </section>

      {/* Cross-links */}
      {(architects.size > 0 || related.length > 0) && (
        <section className="mb-12 grid gap-8 sm:grid-cols-2">
          {architects.size > 0 && (
            <div>
              <p className="eyebrow mb-3">Architects who used this template</p>
              <div className="flex flex-wrap gap-2">
                {[...architects.values()].map((a) => (
                  <CrossLinkChip
                    key={a.slug}
                    href={`/architects/${a.slug}`}
                    label={a.name}
                    tone="architect"
                  />
                ))}
              </div>
            </div>
          )}
          {related.length > 0 && (
            <div>
              <p className="eyebrow mb-3">Related templates</p>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <CrossLinkChip
                    key={r.template.slug}
                    href={`/templates/${r.template.slug}`}
                    label={r.template.name}
                    tone="template"
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Instances + compare mode */}
      <section>
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-ink">
            Instances
            <span className="ml-2 text-base text-ink-faint">
              {template.instances.length}
            </span>
          </h2>
          <p className="text-sm text-ink-faint">
            Add 2–3 to compare their notes side by side.
          </p>
        </div>
        {instances.length > 0 ? (
          <CompareTray instances={instances} />
        ) : (
          <p className="rounded-sm border border-paper-edge bg-paper-deep/40 p-8 text-ink-faint">
            No instances mapped yet. The origin of this template may be lost or
            its versions still to be authored — see the note on the origin
            course.
          </p>
        )}
      </section>
    </div>
  );
}

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav className="mb-6 text-sm text-ink-faint">
      <Link href="/templates" className="hover:text-fairway">
        Templates
      </Link>
      <span className="mx-2">/</span>
      <span className="text-ink-soft">{name}</span>
    </nav>
  );
}
