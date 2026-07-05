"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Shared filter/sort UI. State lives in the URL search params so views stay in
 * sync and links are shareable (the Atlas relies on this to keep map and
 * timeline aligned). Reused by Page 1 (Templates) and Page 3 (Atlas).
 *
 * Config-driven: pass any number of select groups and an optional sort group.
 * A group with the current value cleared removes the param entirely.
 */
export interface FilterGroup {
  param: string;
  label: string;
  options: { value: string; label: string }[];
  allLabel?: string; // label for the "no filter" option (default "All")
}

export function FilterBar({
  groups,
  sort,
  className = "",
}: {
  groups: FilterGroup[];
  sort?: FilterGroup; // a select whose param is conventionally "sort"
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (param: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set(param, value);
      else next.delete(param);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const hasActiveFilter = groups.some((g) => searchParams.get(g.param));

  return (
    <div
      className={`flex flex-wrap items-end gap-x-5 gap-y-3 ${className}`}
      role="group"
      aria-label="Filter and sort"
    >
      {groups.map((g) => (
        <Select
          key={g.param}
          group={g}
          value={searchParams.get(g.param) ?? ""}
          onChange={(v) => setParam(g.param, v)}
        />
      ))}

      {sort && (
        <Select
          group={sort}
          value={searchParams.get(sort.param) ?? ""}
          onChange={(v) => setParam(sort.param, v)}
          isSort
        />
      )}

      {hasActiveFilter && (
        <button
          type="button"
          onClick={() => {
            const next = new URLSearchParams(searchParams.toString());
            groups.forEach((g) => next.delete(g.param));
            const qs = next.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname, {
              scroll: false,
            });
          }}
          className="pb-1.5 text-sm text-ink-faint underline decoration-paper-edge underline-offset-4 hover:text-fairway"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function Select({
  group,
  value,
  onChange,
  isSort = false,
}: {
  group: FilterGroup;
  value: string;
  onChange: (value: string) => void;
  isSort?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="eyebrow">{group.label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[10rem] rounded-sm border border-paper-edge bg-paper px-3 py-1.5 text-sm text-ink focus:border-fairway focus:outline-none"
      >
        {!isSort && <option value="">{group.allLabel ?? "All"}</option>}
        {group.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
