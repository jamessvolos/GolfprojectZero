import Link from "next/link";

/**
 * The connective tissue that makes the graph feel linked: "This is a Redan",
 * "Used by MacKenzie", "Golden Age". A single pill primitive, variant-driven.
 *
 * - tone "template"  → gold (a template lineage)
 * - tone "architect" → fairway (a person)
 * - tone "neutral"   → ink (era, school, plain metadata)
 */
type Tone = "template" | "architect" | "neutral";

const TONES: Record<Tone, string> = {
  template:
    "border-gold/40 bg-gold-wash text-gold-deep hover:border-gold hover:bg-gold/15",
  architect:
    "border-fairway/30 bg-fairway-wash text-fairway-deep hover:border-fairway hover:bg-fairway/15",
  neutral:
    "border-paper-edge bg-paper-deep/50 text-ink-soft hover:border-ink-faint",
};

export function CrossLinkChip({
  href,
  label,
  prefix,
  tone = "neutral",
}: {
  href?: string;
  label: string;
  prefix?: string;
  tone?: Tone;
}) {
  const inner = (
    <>
      {prefix && (
        <span className="text-[0.68rem] uppercase tracking-label opacity-70">
          {prefix}
        </span>
      )}
      <span>{label}</span>
    </>
  );

  const cls = [
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
    TONES[tone],
    href ? "cursor-pointer" : "cursor-default",
  ].join(" ");

  if (!href) return <span className={cls}>{inner}</span>;
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
