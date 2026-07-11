"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FilterBar, type FilterGroup } from "@/components/FilterBar";
import { SchematicDiagram } from "@/components/SchematicDiagram";
import { ERAS } from "@/lib/taxonomy";

/**
 * The templates gallery wall, filtered client-side from prebuilt data so the
 * page can be fully static (no runtime database). Filter/sort state lives in
 * the URL via the shared FilterBar, same as before.
 */
export interface TemplateLite {
  id: string;
  slug: string;
  name: string;
  originCourse: string;
  photoUrl: string | null;
  photoCredit: string | null;
  // one entry per instance — enough to answer the era/architect filters
  instances: { era: string | null; architectSlug: string | null }[];
}

export function TemplatesGallery({
  templates,
  architectOptions,
}: {
  templates: TemplateLite[];
  architectOptions: { value: string; label: string }[];
}) {
  const searchParams = useSearchParams();
  const era = searchParams.get("era") ?? "";
  const architect = searchParams.get("architect") ?? "";
  const sort = searchParams.get("sort") ?? "name";

  let list = templates;
  if (era) {
    list = list.filter((t) => t.instances.some((i) => i.era === era));
  }
  if (architect) {
    list = list.filter((t) =>
      t.instances.some((i) => i.architectSlug === architect),
    );
  }
  list = [...list].sort((a, b) =>
    sort === "instances"
      ? b.instances.length - a.instances.length || a.name.localeCompare(b.name)
      : a.name.localeCompare(b.name),
  );

  const groups: FilterGroup[] = [
    {
      param: "era",
      label: "Era of instances",
      allLabel: "All eras",
      options: ERAS.map((e) => ({ value: e.value, label: e.label })),
    },
    {
      param: "architect",
      label: "Used by architect",
      allLabel: "Any architect",
      options: architectOptions,
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
    <>
      <div className="flex items-end justify-between gap-4 py-8">
        <FilterBar groups={groups} sort={sortGroup} />
        <p className="hidden shrink-0 pb-1.5 text-sm text-ink-faint sm:block">
          {list.length} of {templates.length} templates
        </p>
      </div>

      {/* The gallery wall — each plate leads with its illustration. */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((t, i) => (
          <Link
            key={t.id}
            href={`/templates/${t.slug}`}
            className="group flex flex-col overflow-hidden rounded-sm border border-paper-edge bg-paper-card transition-all hover:-translate-y-1 hover:border-fairway hover:shadow-[0_14px_30px_rgba(35,28,18,0.12)]"
          >
            <div className="relative border-b border-paper-edge">
              <span className="absolute right-3 top-3 z-10 font-sans text-[0.6rem] tracking-wider text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.photoUrl}
                  alt={`${t.name} — ${t.originCourse.split(" — ")[0]}`}
                  title={t.photoCredit ?? undefined}
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover"
                />
              ) : (
                <div className="p-4">
                  <SchematicDiagram slug={t.slug} size="plate" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-fairway">
                {t.name}
              </h3>
              <p className="mt-1 line-clamp-1 font-sans text-[0.68rem] uppercase tracking-wider text-ink-faint">
                {t.originCourse.split(" — ")[0]}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-sm text-fairway">
                  {t.instances.length}{" "}
                  {t.instances.length === 1 ? "instance" : "instances"}
                </span>
                <span className="text-gold transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="rounded-sm border border-paper-edge bg-paper-deep/40 p-8 text-center text-ink-faint">
          No templates match this filter.
        </p>
      )}
    </>
  );
}
