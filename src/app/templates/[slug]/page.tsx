import Link from "next/link";
import { notFound } from "next/navigation";
import { CompareTray, type InstanceData } from "@/components/CompareTray";
import { CrossLinkChip } from "@/components/CrossLinkChip";
import { Figure } from "@/components/Figure";
import { MarkdownProse } from "@/components/MarkdownProse";
import { SchematicDiagram } from "@/components/SchematicDiagram";
import { SchematicLegend } from "@/components/SchematicLegend";
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

  // At-a-glance facts, computed from the instances.
  const countries = new Set(
    template.instances.map((i) => i.hole.course.country).filter(Boolean),
  );
  const topFidelity = template.instances.reduce(
    (m, i) => Math.max(m, i.fidelity),
    0,
  );
  const facts: { label: string; value: string }[] = [
    { label: "Instances", value: String(template.instances.length) },
    { label: "Architects", value: String(architects.size) },
    { label: "Countries", value: String(countries.size) },
    {
      label: "Truest to type",
      value: topFidelity ? `${topFidelity} / 5` : "—",
    },
  ];

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
        <div className="rounded-sm border border-paper-edge bg-paper-card p-6">
          <Figure
            photoUrl={template.photoUrl}
            photoCredit={template.photoCredit}
            alt={`${template.name} template — ${template.originCourse}`}
            fallback={
              <SchematicDiagram
                slug={template.slug}
                size="hero"
                className="mx-auto"
              />
            }
          />
          {!template.photoUrl && (
            <div className="mt-5 border-t border-paper-edge pt-4">
              <p className="eyebrow mb-2.5">How to read it</p>
              <SchematicLegend />
            </div>
          )}
        </div>
      </header>

      {/* At a glance */}
      <dl className="grid grid-cols-2 divide-x divide-paper-edge border-b border-paper-edge sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="px-5 py-6 first:pl-0">
            <dt className="eyebrow mb-2">{f.label}</dt>
            <dd className="font-serif text-3xl text-fairway">{f.value}</dd>
          </div>
        ))}
      </dl>

      {/* The strategic idea — the spine. An engraved brass plaque. */}
      <section className="plaque my-14 border-l-4 border-l-gold px-6 py-8 sm:px-10 sm:py-10">
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
