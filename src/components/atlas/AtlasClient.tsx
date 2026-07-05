"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FilterBar, type FilterGroup } from "@/components/FilterBar";
import { ERAS, SCHOOLS } from "@/lib/taxonomy";
import { matchesFilters, type ArchitectLite, type CourseLite } from "./types";
import { Timeline } from "./Timeline";

// Leaflet touches `window`, so the map is client-only. Loading fallback keeps
// layout stable while the chunk hydrates.
const CourseMap = dynamic(() => import("./CourseMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[32rem] w-full items-center justify-center rounded-sm border border-paper-edge bg-paper-deep/40 text-ink-faint">
      Loading map…
    </div>
  ),
});

/**
 * Page 3 orchestrator. Owns the shared filter + view state (all in the URL, so
 * links are shareable and map/timeline stay in sync). Filtering is done here on
 * the full dataset passed from the server, then handed to whichever view is
 * active.
 */
export function AtlasClient({
  courses,
  architects,
}: {
  courses: CourseLite[];
  architects: ArchitectLite[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = {
    architect: searchParams.get("architect") ?? "",
    era: searchParams.get("era") ?? "",
    school: searchParams.get("school") ?? "",
  };
  const view = searchParams.get("view") === "timeline" ? "timeline" : "map";

  const filtered = useMemo(
    () => courses.filter((c) => matchesFilters(c, filters)),
    [courses, filters.architect, filters.era, filters.school],
  );

  const groups: FilterGroup[] = [
    {
      param: "architect",
      label: "Architect",
      allLabel: "All architects",
      options: architects
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((a) => ({ value: a.slug, label: a.name })),
    },
    {
      param: "era",
      label: "Era",
      allLabel: "All eras",
      options: ERAS.map((e) => ({ value: e.value, label: e.label })),
    },
    {
      param: "school",
      label: "Design school",
      allLabel: "All schools",
      options: SCHOOLS.map((s) => ({ value: s.value, label: s.label })),
    },
  ];

  function setView(next: "map" | "timeline") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-paper-edge pb-6 sm:flex-row sm:items-end sm:justify-between">
        <FilterBar groups={groups} />
        <ViewToggle view={view} onChange={setView} />
      </div>

      <p className="mt-4 text-sm text-ink-faint">
        Showing {filtered.length} of {courses.length} courses
        {filters.architect &&
          ` · highlighting ${
            architects.find((a) => a.slug === filters.architect)?.name ?? ""
          }`}
        .
      </p>

      <div className="mt-4">
        {view === "map" ? (
          <CourseMap
            courses={filtered}
            highlightArchitect={filters.architect}
          />
        ) : (
          <Timeline
            architects={architects}
            courses={filtered}
            highlightArchitect={filters.architect}
          />
        )}
      </div>
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: "map" | "timeline";
  onChange: (v: "map" | "timeline") => void;
}) {
  return (
    <div className="inline-flex shrink-0 rounded-sm border border-paper-edge bg-paper p-0.5">
      {(["map", "timeline"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={view === v}
          className={[
            "rounded-[3px] px-4 py-1.5 text-sm capitalize transition-colors",
            view === v
              ? "bg-fairway text-paper"
              : "text-ink-soft hover:text-ink",
          ].join(" ")}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
