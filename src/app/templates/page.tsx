import { Suspense } from "react";
import {
  TemplatesGallery,
  type TemplateLite,
} from "@/components/TemplatesGallery";
import { getAllTemplates } from "@/lib/queries";

export const metadata = {
  title: "Templates",
  description:
    "The Macdonald/Raynor template holes as a classification system — each stating the decision it poses, with every course known to have a version of it.",
};

// Fully static: the database is only read at build time; filtering and
// sorting happen client-side from the serialized data (see TemplatesGallery).
export default async function TemplatesPage() {
  const templates = await getAllTemplates();

  const data: TemplateLite[] = templates.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    originCourse: t.originCourse,
    photoUrl: t.photoUrl,
    photoCredit: t.photoCredit,
    instances: t.instances.map((i) => ({
      era: i.hole.course.architect?.era ?? null,
      architectSlug: i.hole.course.architect?.slug ?? null,
    })),
  }));

  // Architect options — everyone with at least one mapped instance.
  const architectMap = new Map<string, string>();
  for (const t of templates) {
    for (const i of t.instances) {
      const a = i.hole.course.architect;
      if (a) architectMap.set(a.slug, a.name);
    }
  }
  const architectOptions = [...architectMap.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <header className="max-w-prose border-b border-paper-edge pb-10">
        <p className="eyebrow mb-4">Pillar I · The classification system</p>
        <h1 className="font-serif text-4xl leading-tight text-ink">
          Template holes
        </h1>
        <div className="mt-5 space-y-4 text-ink-soft">
          <p>
            A <strong>template hole</strong> is a design idea abstracted from a
            great original and rebuilt elsewhere — the Redan from North Berwick,
            the Road from St Andrews, the Alps from Prestwick. C.B. Macdonald
            realized these holes were not accidents but portable{" "}
            <em>arguments about risk and reward</em>, and set out to reproduce
            them across America.
          </p>
          <p>
            Each template below states the decision it poses, then maps every
            course known to have a version of it. The concept matters because it
            is the clearest proof of this site&rsquo;s thesis: a hole is
            fundamentally a choice, and a good choice travels.
          </p>
        </div>
      </header>

      {/* Suspense boundary: the gallery reads useSearchParams. */}
      <Suspense fallback={<div className="py-8" />}>
        <TemplatesGallery templates={data} architectOptions={architectOptions} />
      </Suspense>
    </div>
  );
}
