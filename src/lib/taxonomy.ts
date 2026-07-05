/**
 * Canonical value sets for the `era` and `school` string fields (see the note
 * in prisma/schema.prisma on why these are strings, not DB enums). This is the
 * single source of truth for labels and ordering used across filters and pages.
 */

export type Era = "GOLDEN_AGE" | "MODERN_REVIVAL" | "OTHER";
export type School = "STRATEGIC" | "PENAL" | "HEROIC" | "MINIMALIST";

export const ERAS: { value: Era; label: string; blurb: string }[] = [
  {
    value: "GOLDEN_AGE",
    label: "Golden Age",
    blurb: "The classical era, roughly 1900–1937.",
  },
  {
    value: "MODERN_REVIVAL",
    label: "Modern Revival",
    blurb: "The minimalist return to strategic first principles.",
  },
  { value: "OTHER", label: "Other", blurb: "Before or outside the two eras." },
];

export const SCHOOLS: { value: School; label: string; blurb: string }[] = [
  {
    value: "STRATEGIC",
    label: "Strategic",
    blurb: "Offers a choice between risk and reward.",
  },
  {
    value: "PENAL",
    label: "Penal",
    blurb: "Punishes the imperfect shot directly.",
  },
  {
    value: "HEROIC",
    label: "Heroic",
    blurb: "Rewards the bold carry taken on.",
  },
  {
    value: "MINIMALIST",
    label: "Minimalist",
    blurb: "Finds the holes latent in the land.",
  },
];

const ERA_LABELS = Object.fromEntries(ERAS.map((e) => [e.value, e.label]));
const SCHOOL_LABELS = Object.fromEntries(
  SCHOOLS.map((s) => [s.value, s.label]),
);

export function eraLabel(value: string): string {
  return ERA_LABELS[value] ?? value;
}

export function schoolLabel(value: string): string {
  return SCHOOL_LABELS[value] ?? value;
}
