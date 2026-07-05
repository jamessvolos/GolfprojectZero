---
# ─────────────────────────────────────────────────────────────────────
# ADD A COURSE
# Copy to content/courses/<slug>.md and fill in.
# Loop: draft → geocode → link architect → publish.
# Adding a course makes it appear on the Atlas map immediately.
# ─────────────────────────────────────────────────────────────────────
slug: course-slug             # kebab-case, unique, stable (used in URLs)
name: Course Name
location: Town, Region         # human-readable place, shown on the profile
country: Country
lat: 0.0000                    # decimal degrees — geocode manually (OSM), no paid service
lng: 0.0000                    # decimal degrees
yearOpened: 1900               # optional
architect: architect-slug      # optional; must match an existing architect's slug
restorations: |                # optional; markdown. Attribution nuance lives here.
  Notable restorations and their attributions. Be careful and cite the
  contested points rather than smoothing them over — this is curation, not
  a data dump.
---

Write the course summary here as markdown (this body becomes the `summary`
field). Say why the course belongs on the map: its place in the strategic
story, the one or two holes that carry its argument, and how it connects to the
templates or the decision holes featured elsewhere on the site.

<!--
CHECKLIST
[ ] slug is unique and kebab-case
[ ] lat/lng are real decimal-degree coordinates (verify the pin lands on the course)
[ ] architect slug matches an existing architect file (create it first if not)
[ ] restorations field holds any contested attribution honestly
[ ] summary connects the course to the site's thesis, not just a description

DONE means:
- A pin appears at the right spot on /atlas.
- The profile renders at /courses/<slug> with architect cross-link working.
- Any holes you add for this course reference this exact slug.
-->
