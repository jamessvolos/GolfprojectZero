"use client";

import Link from "next/link";
import { useState } from "react";
import { FidelityMeter } from "./FidelityMeter";
import { MarkdownProse } from "./MarkdownProse";

/**
 * Page 1 instances view + compare mode in one client component (selection state
 * has to live somewhere). Every TemplateInstance is a selectable card; picking
 * 2–3 opens a tray that lays their "how this differs" notes side by side.
 */
export interface InstanceData {
  id: string;
  courseName: string;
  courseSlug: string;
  holeNumber: number;
  holeSlug: string;
  par: number;
  yardage: number | null;
  architectName: string | null;
  fidelity: number;
  notes: string;
}

const MAX = 3;

export function CompareTray({ instances }: { instances: InstanceData[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX) return prev; // cap at 3
      return [...prev, id];
    });
  }

  const chosen = selected
    .map((id) => instances.find((i) => i.id === id))
    .filter((x): x is InstanceData => Boolean(x));

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {instances.map((inst) => {
          const isSelected = selected.includes(inst.id);
          const atCap = selected.length >= MAX && !isSelected;
          return (
            <div
              key={inst.id}
              className={[
                "flex flex-col rounded-sm border bg-paper p-4 transition-colors",
                isSelected ? "border-gold ring-1 ring-gold/40" : "border-paper-edge",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/courses/${inst.courseSlug}`}
                    className="font-serif text-lg leading-tight text-ink hover:text-fairway"
                  >
                    {inst.courseName}
                  </Link>
                  <p className="mt-0.5 text-sm text-ink-faint">
                    Hole {inst.holeNumber} · Par {inst.par}
                    {inst.yardage ? ` · ${inst.yardage} yds` : ""}
                  </p>
                  {inst.architectName && (
                    <p className="text-xs text-ink-faint">
                      {inst.architectName}
                    </p>
                  )}
                </div>
                <FidelityMeter value={inst.fidelity} showLabel={false} />
              </div>

              <div className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-soft">
                {plain(inst.notes)}
              </div>

              <div className="mt-auto pt-3">
                <button
                  type="button"
                  onClick={() => toggle(inst.id)}
                  disabled={atCap}
                  className={[
                    "text-sm underline underline-offset-4",
                    isSelected
                      ? "text-gold-deep decoration-gold"
                      : atCap
                        ? "cursor-not-allowed text-ink-faint/50 decoration-transparent"
                        : "text-fairway decoration-fairway/30 hover:decoration-fairway",
                  ].join(" ")}
                >
                  {isSelected ? "Remove from compare" : "Add to compare"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {chosen.length > 0 && (
        <div className="sticky bottom-0 z-20 mt-8 rounded-t-sm border border-b-0 border-paper-edge bg-paper/95 p-5 shadow-[0_-8px_24px_rgba(28,26,23,0.08)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="eyebrow">
              Comparing {chosen.length} instance
              {chosen.length > 1 ? "s" : ""}
            </h3>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-sm text-ink-faint underline decoration-paper-edge underline-offset-4 hover:text-fairway"
            >
              Clear
            </button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {chosen.map((inst) => (
              <div key={inst.id}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Link
                    href={`/courses/${inst.courseSlug}`}
                    className="font-serif text-ink hover:text-fairway"
                  >
                    {inst.courseName}
                  </Link>
                  <FidelityMeter value={inst.fidelity} />
                </div>
                <p className="mb-2 text-xs text-ink-faint">
                  Hole {inst.holeNumber} · Par {inst.par}
                </p>
                <MarkdownProse className="text-sm leading-relaxed text-ink-soft">
                  {inst.notes}
                </MarkdownProse>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Strip markdown emphasis markers for the truncated preview.
function plain(md: string): string {
  return md.replace(/[*_`>#]/g, "").replace(/\s+/g, " ").trim();
}
