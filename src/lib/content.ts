/**
 * Content loader — reads the git-based markdown corpus under /content and
 * returns typed records for the Prisma seed. This is the ONLY reader of the
 * markdown files; at runtime the app queries the seeded database, not disk.
 *
 * See build spec §8 (RECURRING CONTENT LOOPS). Each content type is a flat
 * markdown file with YAML frontmatter for metadata/relations and the body
 * reserved for the primary long-form field.
 *
 * Node-only (uses `fs`). Never import this from a client component.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Era = "GOLDEN_AGE" | "MODERN_REVIVAL" | "OTHER";
export type School = "STRATEGIC" | "PENAL" | "HEROIC" | "MINIMALIST";

export interface ArchitectContent {
  slug: string;
  name: string;
  born?: number;
  died?: number;
  era: Era;
  school: School;
  photoUrl?: string;
  bio: string;
}

export interface CourseContent {
  slug: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  yearOpened?: number;
  architect?: string; // architect slug
  restorations?: string;
  summary: string;
  photoUrl?: string;
  photoCredit?: string;
}

export interface TemplateContent {
  slug: string;
  name: string;
  originCourse: string;
  diagramUrl?: string;
  strategicIdea: string;
  description: string;
  photoUrl?: string;
  photoCredit?: string;
}

export interface HoleTemplateRef {
  template: string; // template slug
  fidelity: number;
  notes: string;
}

export interface DecisionOptionContent {
  label: string;
  reward: string;
  risk: string;
  expectedNote: string;
  order: number;
}

export interface HoleContent {
  slug: string;
  course: string; // course slug
  number: number;
  par: number;
  yardage?: number;
  templates: HoleTemplateRef[];
  decisionBrief?: string;
  options: DecisionOptionContent[];
  summary: string;
}

function readDir(sub: string): { file: string; raw: string }[] {
  const dir = path.join(CONTENT_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .sort()
    .map((f) => ({
      file: f,
      raw: fs.readFileSync(path.join(dir, f), "utf8"),
    }));
}

function trim(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
}

export function getArchitects(): ArchitectContent[] {
  return readDir("architects").map(({ raw }) => {
    const { data, content } = matter(raw);
    return {
      slug: data.slug,
      name: data.name,
      born: data.born ?? undefined,
      died: data.died ?? undefined,
      era: data.era,
      school: data.school,
      photoUrl: data.photoUrl ?? undefined,
      bio: content.trim(),
    };
  });
}

export function getCourses(): CourseContent[] {
  return readDir("courses").map(({ raw }) => {
    const { data, content } = matter(raw);
    return {
      slug: data.slug,
      name: data.name,
      location: data.location,
      country: data.country,
      lat: data.lat,
      lng: data.lng,
      yearOpened: data.yearOpened ?? undefined,
      architect: data.architect ?? undefined,
      restorations: trim(data.restorations) || undefined,
      summary: content.trim(),
      photoUrl: data.photoUrl ?? undefined,
      photoCredit: trim(data.photoCredit) || undefined,
    };
  });
}

export function getTemplates(): TemplateContent[] {
  return readDir("templates").map(({ raw }) => {
    const { data, content } = matter(raw);
    return {
      slug: data.slug,
      name: data.name,
      originCourse: data.originCourse,
      diagramUrl: data.diagramUrl ?? undefined,
      strategicIdea: trim(data.strategicIdea),
      description: content.trim(),
      photoUrl: data.photoUrl ?? undefined,
      photoCredit: trim(data.photoCredit) || undefined,
    };
  });
}

export function getHoles(): HoleContent[] {
  return readDir("holes").map(({ raw }) => {
    const { data, content } = matter(raw);
    return {
      slug: data.slug,
      course: data.course,
      number: data.number,
      par: data.par,
      yardage: data.yardage ?? undefined,
      templates: Array.isArray(data.templates)
        ? data.templates.map((t: any) => ({
            template: t.template,
            fidelity: t.fidelity,
            notes: trim(t.notes),
          }))
        : [],
      decisionBrief: trim(data.decisionBrief) || undefined,
      options: Array.isArray(data.options)
        ? data.options.map((o: any) => ({
            label: o.label,
            reward: trim(o.reward),
            risk: trim(o.risk),
            expectedNote: trim(o.expectedNote),
            order: o.order,
          }))
        : [],
      summary: content.trim(),
    };
  });
}
