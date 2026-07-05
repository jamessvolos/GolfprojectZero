/**
 * Content integrity check. Validates the /content markdown corpus WITHOUT
 * touching the database — the guardrail for the git-based authoring workflow
 * (build spec §8). Run via `npm run validate`; it exits non-zero on any error
 * so it can gate a build or CI.
 *
 * Checks:
 *  - slugs unique within each content type, kebab-case
 *  - every relation resolves (course→architect, hole→course, hole→template)
 *  - required fields present (template.strategicIdea, etc.)
 *  - fidelity in 1–5; lat/lng in range; era/school in the allowed sets
 *  - a hole with a decisionBrief has ≥2 well-formed options
 */
import {
  getArchitects,
  getCourses,
  getHoles,
  getTemplates,
} from "../src/lib/content";

const ERAS = new Set(["GOLDEN_AGE", "MODERN_REVIVAL", "OTHER"]);
const SCHOOLS = new Set(["STRATEGIC", "PENAL", "HEROIC", "MINIMALIST"]);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

function checkUniqueSlugs(kind: string, slugs: string[]) {
  const seen = new Set<string>();
  for (const s of slugs) {
    if (!s) {
      err(`${kind}: an entry is missing a slug`);
      continue;
    }
    if (!SLUG_RE.test(s)) err(`${kind} "${s}": slug is not kebab-case`);
    if (seen.has(s)) err(`${kind}: duplicate slug "${s}"`);
    seen.add(s);
  }
}

function main() {
  const architects = getArchitects();
  const courses = getCourses();
  const templates = getTemplates();
  const holes = getHoles();

  const architectSlugs = new Set(architects.map((a) => a.slug));
  const courseSlugs = new Set(courses.map((c) => c.slug));
  const templateSlugs = new Set(templates.map((t) => t.slug));

  checkUniqueSlugs("architect", architects.map((a) => a.slug));
  checkUniqueSlugs("course", courses.map((c) => c.slug));
  checkUniqueSlugs("template", templates.map((t) => t.slug));
  checkUniqueSlugs("hole", holes.map((h) => h.slug));

  // Architects
  for (const a of architects) {
    if (!a.name) err(`architect "${a.slug}": missing name`);
    if (!a.bio) err(`architect "${a.slug}": missing bio`);
    if (!ERAS.has(a.era)) err(`architect "${a.slug}": invalid era "${a.era}"`);
    if (!SCHOOLS.has(a.school))
      err(`architect "${a.slug}": invalid school "${a.school}"`);
    if (a.born && a.died && a.died < a.born)
      err(`architect "${a.slug}": died (${a.died}) before born (${a.born})`);
  }

  // Courses
  for (const c of courses) {
    if (!c.name) err(`course "${c.slug}": missing name`);
    if (!c.summary) err(`course "${c.slug}": missing summary`);
    if (typeof c.lat !== "number" || c.lat < -90 || c.lat > 90)
      err(`course "${c.slug}": lat out of range (${c.lat})`);
    if (typeof c.lng !== "number" || c.lng < -180 || c.lng > 180)
      err(`course "${c.slug}": lng out of range (${c.lng})`);
    if (c.architect && !architectSlugs.has(c.architect))
      err(`course "${c.slug}": unknown architect "${c.architect}"`);
    if (!c.architect) warn(`course "${c.slug}": no architect linked`);
  }

  // Templates
  for (const t of templates) {
    if (!t.name) err(`template "${t.slug}": missing name`);
    if (!t.originCourse) err(`template "${t.slug}": missing originCourse`);
    if (!t.strategicIdea)
      err(`template "${t.slug}": missing strategicIdea (required — the spine)`);
    if (!t.description) warn(`template "${t.slug}": empty description body`);
  }

  // Holes + relations + decision options
  const templateInstanceCount = new Map<string, number>();
  for (const h of holes) {
    if (!courseSlugs.has(h.course))
      err(`hole "${h.slug}": unknown course "${h.course}"`);
    if (!Number.isInteger(h.number) || h.number < 1)
      err(`hole "${h.slug}": invalid hole number (${h.number})`);
    if (!Number.isInteger(h.par) || h.par < 3 || h.par > 6)
      err(`hole "${h.slug}": unusual par (${h.par})`);
    if (!h.summary) warn(`hole "${h.slug}": empty summary body`);

    for (const ref of h.templates) {
      if (!templateSlugs.has(ref.template))
        err(`hole "${h.slug}": unknown template "${ref.template}"`);
      else
        templateInstanceCount.set(
          ref.template,
          (templateInstanceCount.get(ref.template) ?? 0) + 1,
        );
      if (!Number.isInteger(ref.fidelity) || ref.fidelity < 1 || ref.fidelity > 5)
        err(`hole "${h.slug}": fidelity for "${ref.template}" must be 1–5 (got ${ref.fidelity})`);
      if (!ref.notes)
        warn(`hole "${h.slug}": empty notes for template "${ref.template}"`);
    }

    // A decision breakdown must have ≥2 well-formed options.
    if (h.decisionBrief) {
      if (h.options.length < 2)
        err(`hole "${h.slug}": has a decisionBrief but < 2 options`);
      const orders = new Set<number>();
      for (const o of h.options) {
        if (!o.label) err(`hole "${h.slug}": an option is missing a label`);
        if (!o.reward) err(`hole "${h.slug}": option "${o.label}" missing reward`);
        if (!o.risk) err(`hole "${h.slug}": option "${o.label}" missing risk`);
        if (!o.expectedNote)
          err(`hole "${h.slug}": option "${o.label}" missing expectedNote`);
        if (orders.has(o.order))
          err(`hole "${h.slug}": duplicate option order ${o.order}`);
        orders.add(o.order);
      }
    } else if (h.options.length > 0) {
      warn(`hole "${h.slug}": has options but no decisionBrief`);
    }
  }

  // Templates with fewer than 2 instances (spec authoring loop wants ≥2).
  for (const t of templates) {
    const n = templateInstanceCount.get(t.slug) ?? 0;
    if (n < 2)
      warn(`template "${t.slug}": only ${n} instance(s) — authoring loop suggests ≥2`);
  }

  // Report
  console.log(
    `Content: ${architects.length} architects · ${courses.length} courses · ${templates.length} templates · ${holes.length} holes`,
  );
  if (warnings.length) {
    console.log(`\n⚠  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`   - ${w}`));
  }
  if (errors.length) {
    console.error(`\n❌ ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`   - ${e}`));
    process.exit(1);
  }
  console.log("\n✅ Content is valid.");
}

main();
