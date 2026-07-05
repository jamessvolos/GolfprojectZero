/**
 * Serializable course shape passed from the Atlas server page into the client
 * map/timeline views. Kept flat (no Prisma relations) so it crosses the
 * server→client boundary cleanly.
 */
export interface CourseLite {
  id: string;
  slug: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  yearOpened: number | null;
  architectSlug: string | null;
  architectName: string | null;
  era: string | null;
  school: string | null;
}

export interface ArchitectLite {
  slug: string;
  name: string;
  born: number | null;
  died: number | null;
  era: string;
  school: string;
  courseCount: number;
}

export interface AtlasFilters {
  architect: string; // slug or ""
  era: string;
  school: string;
}

export function matchesFilters(
  c: CourseLite,
  f: AtlasFilters,
): boolean {
  if (f.architect && c.architectSlug !== f.architect) return false;
  if (f.era && c.era !== f.era) return false;
  if (f.school && c.school !== f.school) return false;
  return true;
}
