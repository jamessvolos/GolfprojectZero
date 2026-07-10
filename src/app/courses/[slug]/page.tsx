import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossLinkChip } from "@/components/CrossLinkChip";
import { Figure } from "@/components/Figure";
import { FidelityMeter } from "@/components/FidelityMeter";
import { MarkdownProse } from "@/components/MarkdownProse";
import { SchematicDiagram } from "@/components/SchematicDiagram";
import { getAllCourses, getCourseBySlug } from "@/lib/queries";
import { excerpt } from "@/lib/site";

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const c = await getCourseBySlug(params.slug);
  if (!c) return { title: "Course" };
  const description = excerpt(c.summary);
  return { title: c.name, description, openGraph: { title: c.name, description } };
}

export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  const templateHoles = course.holes.filter(
    (h) => h.templateInstances.length > 0,
  );

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/atlas" className="hover:text-fairway">
          Atlas
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-soft">{course.name}</span>
      </nav>

      {course.photoUrl && (
        <Figure
          photoUrl={course.photoUrl}
          photoCredit={course.photoCredit}
          alt={`${course.name}, ${course.location}`}
          fallback={null}
          className="mb-10 overflow-hidden rounded-sm border border-paper-edge [&_img]:aspect-[21/9]"
        />
      )}

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Main column */}
        <div>
          <header className="border-b border-paper-edge pb-8">
            <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
              {course.name}
            </h1>
            <p className="mt-3 text-lg text-ink-soft">
              {course.location}, {course.country}
              {course.yearOpened ? ` · Opened ${course.yearOpened}` : ""}
            </p>
            {course.architect && (
              <div className="mt-4">
                <CrossLinkChip
                  href={`/architects/${course.architect.slug}`}
                  prefix="Architect"
                  label={course.architect.name}
                  tone="architect"
                />
              </div>
            )}
          </header>

          <section className="py-8">
            <MarkdownProse>{course.summary}</MarkdownProse>
          </section>

          {course.restorations && (
            <section className="rounded-sm border border-paper-edge bg-paper-deep/30 p-6">
              <p className="eyebrow mb-3">Restorations &amp; attribution</p>
              <MarkdownProse className="prose-strategic text-sm">
                {course.restorations}
              </MarkdownProse>
            </section>
          )}
        </div>

        {/* Side column: holes + template instances */}
        <aside className="space-y-8">
          {templateHoles.length > 0 && (
            <div>
              <p className="eyebrow mb-3">Template holes</p>
              <ul className="space-y-2">
                {templateHoles.map((h) =>
                  h.templateInstances.map((inst) => (
                    <li key={inst.id}>
                      <Link
                        href={`/templates/${inst.template.slug}`}
                        className="group flex items-center gap-4 rounded-sm border border-paper-edge bg-paper-card p-4 transition-colors hover:border-fairway"
                      >
                        <span className="w-20 shrink-0">
                          <SchematicDiagram
                            slug={inst.template.slug}
                            size="plate"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-serif text-lg text-ink group-hover:text-fairway">
                              {inst.template.name}
                            </span>
                            <FidelityMeter value={inst.fidelity} />
                          </span>
                          <span className="mt-1 block text-sm text-ink-faint">
                            Hole {h.number} · Par {h.par}
                          </span>
                        </span>
                      </Link>
                    </li>
                  )),
                )}
              </ul>
            </div>
          )}

          <div>
            <p className="eyebrow mb-3">All holes on file</p>
            {course.holes.length > 0 ? (
              <ul className="divide-y divide-paper-edge rounded-sm border border-paper-edge bg-paper">
                {course.holes.map((h) => (
                  <li
                    key={h.id}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                  >
                    <span className="text-ink-soft">
                      Hole {h.number} · Par {h.par}
                    </span>
                    <span className="flex gap-1.5">
                      {h.templateInstances.map((inst) => (
                        <span
                          key={inst.id}
                          className="rounded-full bg-gold-wash px-2 py-0.5 text-xs text-gold-deep"
                        >
                          {inst.template.name}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-faint">
                No individual holes catalogued yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
