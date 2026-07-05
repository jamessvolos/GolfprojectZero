"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The two pillars, always reachable. The current pillar is marked. Shared by
 * the header (see PageShell) and available for reuse anywhere the two-way
 * choice needs to be surfaced.
 */
export const PILLARS = [
  {
    href: "/templates",
    label: "Templates",
    tagline: "The classification of Golden Age holes",
  },
  {
    href: "/atlas",
    label: "Atlas",
    tagline: "The golden age, mapped",
  },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PillarNav({
  variant = "header",
}: {
  variant?: "header" | "cards";
}) {
  const pathname = usePathname();

  if (variant === "cards") {
    return (
      <nav className="grid gap-4 sm:grid-cols-2">
        {PILLARS.map((p, i) => (
          <Link
            key={p.href}
            href={p.href}
            className="group block rounded-sm border border-paper-edge bg-paper-deep/40 p-6 transition-colors hover:border-gold hover:bg-paper-deep"
          >
            <div className="eyebrow mb-3">Pillar {["I", "II"][i]}</div>
            <div className="font-serif text-2xl text-ink group-hover:text-fairway">
              {p.label}
            </div>
            <div className="mt-1 text-sm text-ink-faint">{p.tagline}</div>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {PILLARS.map((p) => {
        const active = isActive(pathname, p.href);
        return (
          <Link
            key={p.href}
            href={p.href}
            aria-current={active ? "page" : undefined}
            className={[
              "border-b-2 px-3 py-1.5 font-sans text-xs uppercase tracking-wider transition-colors",
              // Sits on the light, ruled masthead.
              active
                ? "border-fairway text-fairway"
                : "border-transparent text-ink-soft hover:text-fairway",
            ].join(" ")}
          >
            {p.label}
          </Link>
        );
      })}
    </nav>
  );
}
