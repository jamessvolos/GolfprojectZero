import type { MetadataRoute } from "next";
import {
  getAllArchitects,
  getAllCourses,
  getAllTemplates,
} from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [templates, courses, architects] = await Promise.all([
    getAllTemplates(),
    getAllCourses(),
    getAllArchitects(),
  ]);

  const staticRoutes = ["", "/templates", "/atlas", "/architects", "/about"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const dynamicRoutes = [
    ...templates.map((t) => `/templates/${t.slug}`),
    ...courses.map((c) => `/courses/${c.slug}`),
    ...architects.map((a) => `/architects/${a.slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
