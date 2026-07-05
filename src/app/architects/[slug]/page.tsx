import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossLinkChip } from "@/components/CrossLinkChip";
import { MarkdownProse } from "@/components/MarkdownProse";
import { SchematicDiagram } from "@/components/SchematicDiagram";
import { getAllArchitects, getArchitectBySlug } from "@/lib/queries";
import { excerpt } from "@/lib/site";
import { eraLabel, schoolLabel } from "@/lib/taxonomy";

export async function generateStaticParams() {
  const architects = await getAllArchitects();
  return architects.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const a = await getArchitectBySlug(params.slug);
  if (!a) return { title: "Architect" };
  const description = excerpt(a.bio);
  return { title: a.name, description, openGraph: { title: a.name, description } };
}

export default async function ArchitectPage({
  params,
}: {
  params: { slug: string };
}) {
  const architect = await getArchitectBySlug(params.slug);
  if (!architect) notFound();

  const dates =
    architect.born || architect.died
      ? `${architect.born ?? "?"}–${architect.died ?? "present"}`
      : null;

  // Templates this architect favored (unique, across all their courses' holes).
  const templates = new Map<
    string,
    { slug: string; name: string; count: number }
  >();
  for (const c of architect.courses) {
    for (const h of c.holes) {
      for (const inst of h.templateInstances) {
        const prev = templates.get(inst.template.slug);
        templates.set(inst.template.slug, {
          slug: inst.template.slug,
          name: inst.template.name,
          count: (prev?.count ?? 0) + 1,
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/atlas" className="hover:text-fairway">
          Atlas
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-soft">{architect.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <header className="border-b border-paper-edge pb-8">
            <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
              {architect.name}
            </h1>
            {dates && (
              <p className="mt-3 text-lg text-ink-soft">{dates}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <CrossLinkChip
                href={`/atlas?era=${architect.era}`}
                prefix="Era"
                label={eraLabel(architect.era)}
                tone="neutral"
              />
              <CrossLinkChip
                href={`/atlas?school=${architect.school}`}
                prefix="School"
                label={schoolLabel(architect.school)}
                tone="neutral"
              />
            </div>
          </header>

          <section className="py-8">
            <MarkdownProse>{architect.bio}</MarkdownProse>
          </section>

          {templates.size > 0 && (
            <section className="border-t border-paper-edge pt-8">
              <p className="eyebrow mb-4">Templates favored</p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[...templates.values()]
                  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
                  .map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/templates/${t.slug}`}
                        className="group flex items-center gap-3 rounded-sm border border-paper-edge bg-paper-card p-3 transition-colors hover:border-fairway"
                      >
                        <span className="w-14 shrink-0">
                          <SchematicDiagram slug={t.slug} size="plate" />
                        </span>
                        <span>
                          <span className="block font-serif text-base leading-tight text-ink group-hover:text-fairway">
                            {t.name}
                          </span>
                          <span className="text-xs text-ink-faint">
                            {t.count}{" "}
                            {t.count === 1 ? "hole" : "holes"}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </div>

        <aside>
          <p className="eyebrow mb-3">
            Courses ({architect.courses.length})
          </p>
          {architect.courses.length > 0 ? (
            <ul className="space-y-2">
              {architect.courses.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/courses/${c.slug}`}
                    className="group block rounded-sm border border-paper-edge bg-paper p-4 hover:border-gold"
                  >
                    <span className="font-serif text-lg text-ink group-hover:text-fairway">
                      {c.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-faint">
                      {c.location}
                      {c.yearOpened ? ` · ${c.yearOpened}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-faint">
              No courses catalogued for this architect yet.
            </p>
          )}
          <Link
            href={`/atlas?architect=${architect.slug}`}
            className="mt-4 inline-block text-sm text-fairway underline decoration-fairway/30 underline-offset-4 hover:decoration-fairway"
          >
            Highlight on the atlas →
          </Link>
        </aside>
      </div>
    </div>
  );
}
