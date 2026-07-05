/**
 * Shared site constants. `SITE_URL` is read from NEXT_PUBLIC_SITE_URL in prod
 * (for absolute sitemap/OG URLs) and falls back to localhost in dev.
 */
export const SITE_NAME = "The Strategic Line";

export const SITE_DESCRIPTION =
  "A site about golf course architecture, built on one thesis: every great hole is a decision problem.";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Flatten markdown to a plain, single-line excerpt for meta descriptions.
 * Strips emphasis/heading/link syntax; trims to `len` on a word boundary.
 */
export function excerpt(md: string, len = 160): string {
  const plain = md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= len) return plain;
  const cut = plain.slice(0, len);
  return cut.slice(0, cut.lastIndexOf(" ")).trimEnd() + "…";
}
