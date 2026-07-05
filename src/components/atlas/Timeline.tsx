"use client";

import Link from "next/link";
import { eraLabel } from "@/lib/taxonomy";
import type { ArchitectLite, CourseLite } from "./types";

/**
 * The Atlas timeline view. A horizontal time axis; one row per architect
 * showing their lifespan as a bar and their (filtered) course openings as
 * dots. The selected architect's row and dots highlight in gold — the same
 * highlight the map uses, driven by the same URL filter state.
 *
 * The axis is fixed to the strategic era of interest (1820→present) and
 * positions are clamped, so the rare pre-1820 origin (St Andrews) pins to the
 * left edge rather than compressing everything else into a sliver.
 */
const DOMAIN_START = 1820;
const DOMAIN_END = 2020;

function pct(year: number): number {
  const clamped = Math.max(DOMAIN_START, Math.min(DOMAIN_END, year));
  return ((clamped - DOMAIN_START) / (DOMAIN_END - DOMAIN_START)) * 100;
}

const DECADES = Array.from(
  { length: (DOMAIN_END - DOMAIN_START) / 20 + 1 },
  (_, i) => DOMAIN_START + i * 20,
);

export function Timeline({
  architects,
  courses,
  highlightArchitect,
}: {
  architects: ArchitectLite[];
  courses: CourseLite[];
  highlightArchitect: string;
}) {
  // Only architects that have at least one visible course, plus any explicitly
  // selected one. Sort by birth year (undated architects to the end).
  const visible = architects
    .filter(
      (a) =>
        courses.some((c) => c.architectSlug === a.slug) ||
        a.slug === highlightArchitect,
    )
    .sort((a, b) => (a.born ?? 9999) - (b.born ?? 9999));

  if (visible.length === 0) {
    return (
      <p className="rounded-sm border border-paper-edge bg-paper-deep/40 p-8 text-center text-ink-faint">
        No architects match these filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-paper-edge bg-paper">
      <div className="min-w-[44rem] p-5">
        {/* Axis */}
        <div className="relative mb-4 ml-40 h-5 border-b border-paper-edge">
          {DECADES.map((d) => (
            <div
              key={d}
              className="absolute top-0 -translate-x-1/2 text-[0.7rem] text-ink-faint"
              style={{ left: `${pct(d)}%` }}
            >
              {d}
            </div>
          ))}
          {/* Golden Age band, 1900–1937 */}
          <div
            className="absolute bottom-0 top-0 border-x border-gold/30 bg-gold-wash/40"
            style={{
              left: `${pct(1900)}%`,
              width: `${pct(1937) - pct(1900)}%`,
            }}
            aria-hidden
          />
        </div>

        <ul className="space-y-2">
          {visible.map((a) => {
            const isHi = a.slug === highlightArchitect;
            const theirCourses = courses.filter(
              (c) => c.architectSlug === a.slug,
            );
            const bornPct = a.born ? pct(a.born) : null;
            const diedPct = pct(a.died ?? DOMAIN_END);
            return (
              <li
                key={a.slug}
                className={[
                  "flex items-center rounded-sm py-1.5 pr-2",
                  isHi ? "bg-gold-wash/60" : "",
                ].join(" ")}
              >
                <Link
                  href={`/architects/${a.slug}`}
                  className={[
                    "w-40 shrink-0 truncate pr-3 text-sm",
                    isHi
                      ? "font-medium text-gold-deep"
                      : "text-ink-soft hover:text-fairway",
                  ].join(" ")}
                  title={a.name}
                >
                  {a.name}
                </Link>
                <div className="relative h-6 flex-1">
                  {/* Lifespan bar */}
                  {bornPct !== null && (
                    <div
                      className={[
                        "absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full",
                        isHi ? "bg-gold/60" : "bg-paper-edge",
                      ].join(" ")}
                      style={{
                        left: `${bornPct}%`,
                        width: `${Math.max(diedPct - bornPct, 0.5)}%`,
                      }}
                    />
                  )}
                  {/* Course opening dots */}
                  {theirCourses.map((c) =>
                    c.yearOpened ? (
                      <Link
                        key={c.id}
                        href={`/courses/${c.slug}`}
                        title={`${c.name} · ${c.yearOpened}`}
                        className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${pct(c.yearOpened)}%` }}
                      >
                        <span
                          className={[
                            "block h-2.5 w-2.5 rounded-full border transition-transform group-hover:scale-150",
                            isHi
                              ? "border-gold-deep bg-gold"
                              : "border-fairway-deep bg-fairway",
                          ].join(" ")}
                        />
                      </Link>
                    ) : null,
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-paper-edge pt-3 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-fairway-deep bg-fairway" />
            Course opening
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-4 border border-gold/30 bg-gold-wash/60" />
            {eraLabel("GOLDEN_AGE")} (1900–1937)
          </span>
          <span>Bars show each architect&rsquo;s lifespan.</span>
        </div>
      </div>
    </div>
  );
}
