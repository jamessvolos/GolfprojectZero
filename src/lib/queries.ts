/**
 * Data access layer. All page-level reads go through here so the query shape
 * lives in one place. Server-only (imports the Prisma client).
 */
import { db } from "./db";

// ── Architects ────────────────────────────────────────────────────────
export function getAllArchitects() {
  return db.architect.findMany({
    orderBy: { name: "asc" },
    include: { courses: { orderBy: { name: "asc" } } },
  });
}

export function getArchitectBySlug(slug: string) {
  return db.architect.findUnique({
    where: { slug },
    include: {
      courses: {
        orderBy: { name: "asc" },
        include: {
          holes: {
            include: { templateInstances: { include: { template: true } } },
          },
        },
      },
    },
  });
}

// ── Courses ───────────────────────────────────────────────────────────
export function getAllCourses() {
  return db.course.findMany({
    orderBy: { name: "asc" },
    include: { architect: true },
  });
}

export function getCourseBySlug(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: {
      architect: true,
      holes: {
        orderBy: { number: "asc" },
        include: {
          templateInstances: { include: { template: true } },
          options: true,
        },
      },
    },
  });
}

// ── Templates ─────────────────────────────────────────────────────────
export function getAllTemplates() {
  return db.template.findMany({
    orderBy: { name: "asc" },
    include: {
      instances: {
        include: {
          hole: { include: { course: { include: { architect: true } } } },
        },
      },
    },
  });
}

export function getTemplateBySlug(slug: string) {
  return db.template.findUnique({
    where: { slug },
    include: {
      instances: {
        orderBy: { fidelity: "desc" },
        include: {
          hole: { include: { course: { include: { architect: true } } } },
        },
      },
    },
  });
}

// ── Holes / Decisions ─────────────────────────────────────────────────
export function getDecisionHoles() {
  return db.hole.findMany({
    where: { decisionBrief: { not: null } },
    orderBy: [{ course: { name: "asc" } }, { number: "asc" }],
    include: {
      course: { include: { architect: true } },
      options: { orderBy: { order: "asc" } },
      templateInstances: { include: { template: true } },
    },
  });
}

export function getHoleBySlug(slug: string) {
  return db.hole.findUnique({
    where: { slug },
    include: {
      course: { include: { architect: true } },
      options: { orderBy: { order: "asc" } },
      templateInstances: { include: { template: true } },
    },
  });
}
