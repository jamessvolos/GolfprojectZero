import { Suspense } from "react";
import { AtlasClient } from "@/components/atlas/AtlasClient";
import type { ArchitectLite, CourseLite } from "@/components/atlas/types";
import { getAllArchitects, getAllCourses } from "@/lib/queries";

export const metadata = { title: "Atlas" };

export default async function AtlasPage() {
  const [courses, architects] = await Promise.all([
    getAllCourses(),
    getAllArchitects(),
  ]);

  const courseData: CourseLite[] = courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    location: c.location,
    country: c.country,
    lat: c.lat,
    lng: c.lng,
    yearOpened: c.yearOpened,
    architectSlug: c.architect?.slug ?? null,
    architectName: c.architect?.name ?? null,
    era: c.architect?.era ?? null,
    school: c.architect?.school ?? null,
  }));

  const architectData: ArchitectLite[] = architects.map((a) => ({
    slug: a.slug,
    name: a.name,
    born: a.born,
    died: a.died,
    era: a.era,
    school: a.school,
    courseCount: a.courses.length,
  }));

  return (
    <div className="mx-auto max-w-shell px-5 py-14">
      <header className="max-w-prose">
        <p className="eyebrow mb-4">Pillar III · The golden age, mapped</p>
        <h1 className="font-serif text-4xl leading-tight text-ink">
          The Golden Age Atlas
        </h1>
        <div className="mt-5 space-y-4 text-ink-soft">
          <p>
            The classical era of course design, roughly 1900–1937, and the
            minimalist revival that returned to its principles — placed on a
            map and a timeline. Filter by architect, era, or design school;
            selecting an architect highlights their courses across both views.
          </p>
          <p className="text-sm text-ink-faint">
            Every pin links into the same course profile the other two pillars
            use. Coordinates are entered by hand — no paid geocoding — so a pin
            marks the course, roughly, not a survey point.
          </p>
        </div>
      </header>

      <div className="mt-10">
        {/* Suspense boundary: AtlasClient reads useSearchParams. */}
        <Suspense fallback={<div className="h-[32rem]" />}>
          <AtlasClient courses={courseData} architects={architectData} />
        </Suspense>
      </div>
    </div>
  );
}
