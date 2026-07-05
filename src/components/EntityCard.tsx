import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The one card primitive. TemplateCard, HoleBreakdownCard, and the course /
 * architect cards are all thin configurations of this — per the build spec's
 * rule: extend, don't multiply. New card components only for genuinely new
 * shapes.
 *
 * Slots:
 *   media    — optional visual (schematic thumbnail, etc.) shown at the top
 *   eyebrow  — small-caps label ("Template", "Par 3 · 192 yds")
 *   title    — the card heading
 *   subtitle — one line under the title (origin course, location)
 *   children — body / teaser text
 *   footer   — meta row at the bottom (instance count, chips)
 */
export function EntityCard({
  href,
  media,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  href: string;
  media?: ReactNode;
  eyebrow?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-paper-edge bg-paper transition-colors hover:border-gold"
    >
      {media && (
        <div className="border-b border-paper-edge bg-paper-deep/40">
          {media}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h3 className="font-serif text-xl leading-tight text-ink transition-colors group-hover:text-fairway">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-faint">{subtitle}</p>
        )}
        {children && (
          <div className="mt-3 text-sm leading-relaxed text-ink-soft">
            {children}
          </div>
        )}
        {footer && (
          <div className="mt-auto pt-4 text-sm text-ink-faint">{footer}</div>
        )}
      </div>
    </Link>
  );
}
