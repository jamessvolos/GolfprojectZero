import { EntityCard } from "@/components/EntityCard";
import { FilterBar, type FilterGroup } from "@/components/FilterBar";
import { SchematicDiagram } from "@/components/SchematicDiagram";
import { getAllTemplates } from "@/lib/queries";
import { ERAS } from "@/lib/taxonomy";

export const metadata = { title: "Templates" };

type Search = { sort?: string; era?: string };

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const templates = await getAllTemplates();

  // Filter by era of instances (an instance's era = its course's architect's).
  const era = searchParams.era ?? "";
  let list = templates;
  if (era) {
    list = list.filter((t) =>
      t.instances.some((i) => i.hole.course.architect?.era === era),
    );
  }

  // Sort by name (default) or by number of instances.
  const sort = searchParams.sort ?? "name";
  list = [...list].sort((a, b) =>
    sort === "instances"
      ? b.instances.length - a.instances.length ||
        a.name.localeCompare(b.name)
      : a.name.localeCompare(b.name),
  );

  const groups: FilterGroup[] = [
    {
      param: "era",
      label: "Era of instances",
      allLabel: "All eras",
      options: ERAS.map((e) => ({ value: e.value, label: e.label })),
    },
  ];
  const sortGroup: FilterGroup = {
    param: "sort",
    label: "Sort by",
    options: [
      { value: "name", label: "Name (A–Z)" },
      { value: "instances", label: "Most instances" },
    ],
  };

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

      <div className="py-8">
        <FilterBar groups={groups} sort={sortGroup} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <EntityCard
            key={t.id}
            href={`/templates/${t.slug}`}
            media={
              <div className="p-3">
                <SchematicDiagram slug={t.slug} size="thumb" />
              </div>
            }
            eyebrow="Template"
            title={t.name}
            subtitle={t.originCourse}
            footer={
              <span>
                {t.instances.length}{" "}
                {t.instances.length === 1 ? "instance" : "instances"} mapped
              </span>
            }
          />
        ))}
      </div>

      {list.length === 0 && (
        <p className="rounded-sm border border-paper-edge bg-paper-deep/40 p-8 text-center text-ink-faint">
          No templates match this filter.
        </p>
      )}
    </div>
  );
}
