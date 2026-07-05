import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossLinkChip } from "@/components/CrossLinkChip";
import { FidelityMeter } from "@/components/FidelityMeter";
import { MarkdownProse } from "@/components/MarkdownProse";
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
  const decisionHoles = course.holes.filter((h) => h.decisionBrief);

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <nav className="mb-6 text-sm text-ink-faint">
        <Link href="/atlas" className="hover:text-fairway">
          Atlas
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-soft">{course.name}</span>
      </nav>

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

          {/* Decision breakdowns on this course */}
          {decisionHoles.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 font-serif text-2xl text-ink">
                Modelled decisions here
              </h2>
              <ul className="space-y-3">
                {decisionHoles.map((h) => (
                  <li key={h.id}>
                    <Link
                      href={`/decisions/${h.slug}`}
                      className="group flex items-baseline justify-between gap-4 rounded-sm border border-paper-edge bg-paper p-4 hover:border-gold"
                    >
                      <span className="font-serif text-lg text-ink group-hover:text-fairway">
                        Hole {h.number}
                        <span className="ml-2 text-sm text-ink-faint">
                          Par {h.par}
                          {h.yardage ? ` · ${h.yardage} yds` : ""}
                        </span>
                      </span>
                      <span className="text-sm text-fairway-deep">
                        Model the choice →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
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
                    <li
                      key={inst.id}
                      className="rounded-sm border border-paper-edge bg-paper p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/templates/${inst.template.slug}`}
                          className="font-serif text-lg text-ink hover:text-fairway"
                        >
                          {inst.template.name}
                        </Link>
                        <FidelityMeter value={inst.fidelity} />
                      </div>
                      <p className="mt-1 text-sm text-ink-faint">
                        Hole {h.number} · Par {h.par}
                      </p>
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
                      {h.decisionBrief && (
                        <span className="rounded-full bg-fairway-wash px-2 py-0.5 text-xs text-fairway-deep">
                          Decision
                        </span>
                      )}
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
