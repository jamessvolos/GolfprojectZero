"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { eraLabel, schoolLabel } from "@/lib/taxonomy";
import type { CourseLite } from "./types";

/**
 * The Atlas map. OpenStreetMap tiles (no paid key), a custom on-palette pin
 * per course, and a CoursePopover on click. Highlighted courses (the selected
 * architect's) get a gold pin; the rest fairway green. Rendered client-only —
 * imported via next/dynamic with ssr:false from AtlasClient.
 */

// Custom divIcon avoids Leaflet's broken default-marker asset paths in bundlers
// and keeps the pins in the editorial palette.
function pinIcon(highlighted: boolean): L.DivIcon {
  const fill = highlighted ? "#B08D4C" : "#3A5A40";
  return L.divIcon({
    className: "",
    html: `<svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0C5 0 0 4.8 0 10.8 0 18.9 11 30 11 30S22 18.9 22 10.8C22 4.8 17 0 11 0Z" fill="${fill}"/>
      <circle cx="11" cy="10.8" r="4" fill="#F7F4EC"/>
    </svg>`,
    iconSize: [22, 30],
    iconAnchor: [11, 30],
    popupAnchor: [0, -28],
  });
}

// Refit the map to the currently-visible pins whenever the filtered set changes.
function FitBounds({ courses }: { courses: CourseLite[] }) {
  const map = useMap();
  useMemo(() => {
    if (courses.length === 0) return;
    if (courses.length === 1) {
      map.setView([courses[0].lat, courses[0].lng], 6);
      return;
    }
    const bounds = L.latLngBounds(
      courses.map((c) => [c.lat, c.lng] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 7 });
  }, [courses, map]);
  return null;
}

export default function CourseMap({
  courses,
  highlightArchitect,
}: {
  courses: CourseLite[];
  highlightArchitect: string; // slug or ""
}) {
  return (
    <MapContainer
      center={[40, -40]}
      zoom={2}
      scrollWheelZoom={false}
      className="h-[32rem] w-full rounded-sm border border-paper-edge"
      worldCopyJump
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds courses={courses} />
      {courses.map((c) => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          icon={pinIcon(
            Boolean(highlightArchitect) &&
              c.architectSlug === highlightArchitect,
          )}
        >
          <Popup>
            <CoursePopover course={c} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

/**
 * CoursePopover — the pin popover: name, architect, year, era/school, and a
 * link into the shared course profile.
 */
function CoursePopover({ course }: { course: CourseLite }) {
  return (
    <div className="min-w-[12rem] font-sans">
      <Link
        href={`/courses/${course.slug}`}
        className="font-serif text-base text-ink hover:text-fairway"
      >
        {course.name}
      </Link>
      <div className="mt-0.5 text-xs text-ink-faint">
        {course.location}
        {course.yearOpened ? ` · ${course.yearOpened}` : ""}
      </div>
      {course.architectName && (
        <div className="mt-1 text-sm text-ink-soft">
          {course.architectSlug ? (
            <Link
              href={`/architects/${course.architectSlug}`}
              className="text-fairway hover:underline"
            >
              {course.architectName}
            </Link>
          ) : (
            course.architectName
          )}
        </div>
      )}
      {(course.era || course.school) && (
        <div className="mt-1 text-xs text-ink-faint">
          {[course.era && eraLabel(course.era), course.school && schoolLabel(course.school)]
            .filter(Boolean)
            .join(" · ")}
        </div>
      )}
      <Link
        href={`/courses/${course.slug}`}
        className="mt-2 inline-block text-xs text-fairway underline underline-offset-2"
      >
        View profile →
      </Link>
    </div>
  );
}
