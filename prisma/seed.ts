/**
 * Seed the database from the git-based markdown corpus under /content.
 *
 * Order matters — relations resolve by slug, so we create the thing being
 * linked to before the thing that links to it:
 *   architects → courses → templates → holes → template instances → options
 *
 * Idempotent-ish for dev: wipes the tables first, then reseeds. Run via
 * `npm run db:seed` (or `npm run db:reset` to force-reset the schema too).
 */
import { PrismaClient } from "@prisma/client";
import {
  getArchitects,
  getCourses,
  getTemplates,
  getHoles,
} from "../src/lib/content";

const prisma = new PrismaClient();

async function wipe() {
  // Delete in FK-safe order (children first).
  await prisma.decisionOption.deleteMany();
  await prisma.templateInstance.deleteMany();
  await prisma.hole.deleteMany();
  await prisma.template.deleteMany();
  await prisma.course.deleteMany();
  await prisma.architect.deleteMany();
}

async function main() {
  console.log("🌱 Seeding The Strategic Line…\n");
  await wipe();

  // 1. Architects
  const architects = getArchitects();
  const architectIdBySlug = new Map<string, string>();
  for (const a of architects) {
    const rec = await prisma.architect.create({
      data: {
        slug: a.slug,
        name: a.name,
        born: a.born ?? null,
        died: a.died ?? null,
        era: a.era,
        school: a.school,
        bio: a.bio,
        photoUrl: a.photoUrl ?? null,
      },
    });
    architectIdBySlug.set(a.slug, rec.id);
  }
  console.log(`  ✓ ${architects.length} architects`);

  // 2. Courses (link architect by slug)
  const courses = getCourses();
  const courseIdBySlug = new Map<string, string>();
  for (const c of courses) {
    const architectId = c.architect
      ? architectIdBySlug.get(c.architect) ?? null
      : null;
    if (c.architect && !architectId) {
      console.warn(
        `  ! course "${c.slug}" references unknown architect "${c.architect}"`,
      );
    }
    const rec = await prisma.course.create({
      data: {
        slug: c.slug,
        name: c.name,
        location: c.location,
        country: c.country,
        lat: c.lat,
        lng: c.lng,
        yearOpened: c.yearOpened ?? null,
        architectId,
        restorations: c.restorations ?? null,
        summary: c.summary,
        photoUrl: c.photoUrl ?? null,
        photoCredit: c.photoCredit ?? null,
      },
    });
    courseIdBySlug.set(c.slug, rec.id);
  }
  console.log(`  ✓ ${courses.length} courses`);

  // 3. Templates
  const templates = getTemplates();
  const templateIdBySlug = new Map<string, string>();
  for (const t of templates) {
    const rec = await prisma.template.create({
      data: {
        slug: t.slug,
        name: t.name,
        originCourse: t.originCourse,
        description: t.description,
        strategicIdea: t.strategicIdea,
        diagramUrl: t.diagramUrl ?? null,
        photoUrl: t.photoUrl ?? null,
        photoCredit: t.photoCredit ?? null,
      },
    });
    templateIdBySlug.set(t.slug, rec.id);
  }
  console.log(`  ✓ ${templates.length} templates`);

  // 4. Holes (link course by slug) + 5. template instances + 6. options
  const holes = getHoles();
  let instanceCount = 0;
  let optionCount = 0;
  for (const h of holes) {
    const courseId = courseIdBySlug.get(h.course);
    if (!courseId) {
      console.warn(
        `  ! hole "${h.slug}" references unknown course "${h.course}" — skipping`,
      );
      continue;
    }

    const hole = await prisma.hole.create({
      data: {
        slug: h.slug,
        courseId,
        number: h.number,
        par: h.par,
        yardage: h.yardage ?? null,
        summary: h.summary,
        decisionBrief: h.decisionBrief ?? null,
      },
    });

    for (const ref of h.templates) {
      const templateId = templateIdBySlug.get(ref.template);
      if (!templateId) {
        console.warn(
          `  ! hole "${h.slug}" references unknown template "${ref.template}"`,
        );
        continue;
      }
      await prisma.templateInstance.create({
        data: {
          templateId,
          holeId: hole.id,
          fidelity: ref.fidelity,
          notes: ref.notes,
        },
      });
      instanceCount++;
    }

    for (const opt of h.options) {
      await prisma.decisionOption.create({
        data: {
          holeId: hole.id,
          label: opt.label,
          reward: opt.reward,
          risk: opt.risk,
          expectedNote: opt.expectedNote,
          order: opt.order,
        },
      });
      optionCount++;
    }
  }
  console.log(`  ✓ ${holes.length} holes`);
  console.log(`  ✓ ${instanceCount} template instances`);
  console.log(`  ✓ ${optionCount} decision options`);

  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("\n❌ Seed failed:\n", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
