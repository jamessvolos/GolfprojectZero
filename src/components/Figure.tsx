import type { ReactNode } from "react";

/**
 * A photo-or-diagram figure. If a real photo URL is present, render it with a
 * required credit line; otherwise fall back to the drawn schematic (`fallback`).
 *
 * This is the seam for real photography: drop a licensed image URL (a local
 * `/photos/…` path or a remote URL) and a credit into the content frontmatter,
 * and the photo replaces the diagram everywhere the figure is used. Plain
 * <img> (not next/image) so any URL or bundled file works without config.
 */
export function Figure({
  photoUrl,
  photoCredit,
  alt,
  fallback,
  rounded = true,
  className = "",
}: {
  photoUrl?: string | null;
  photoCredit?: string | null;
  alt: string;
  fallback: ReactNode;
  rounded?: boolean;
  className?: string;
}) {
  if (!photoUrl) return <>{fallback}</>;
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={alt}
        loading="lazy"
        className={`w-full object-cover ${rounded ? "rounded-sm" : ""}`}
      />
      {photoCredit && (
        <figcaption className="mt-1.5 text-[0.68rem] text-ink-faint">
          {photoCredit}
        </figcaption>
      )}
    </figure>
  );
}
