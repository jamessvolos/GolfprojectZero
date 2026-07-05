---
# ─────────────────────────────────────────────────────────────────────
# ADD A TEMPLATE (a classification-system entry, Page 1)
# Copy to content/templates/<slug>.md and fill in.
# Loop: draft → add diagram → link ≥2 instances → publish.
# ─────────────────────────────────────────────────────────────────────
slug: template-slug           # kebab-case, unique, stable (used in URLs)
name: Template Name            # e.g. "Redan", "Cape", "Short"
originCourse: Course, Hole — Country   # free text: the canonical origin
diagramUrl: /diagrams/template-slug.svg   # optional; schematic of the archetype
strategicIdea: |              # REQUIRED — the spine of the whole site.
  The DECISION this template poses, in markdown. This is the single most
  important field on the page: it is rendered prominently, not as body text.
  State the fork the template offers the golfer — risk against reward, the
  route it invites, why the "correct" shot is what it is. If you cannot
  articulate the decision, the template is not ready to publish.
---

Write the template description here as markdown (this body becomes the
`description` field). Explain what physically *defines* this template — the
green shape, the hazards, the angles — and its place in the Macdonald/Raynor
vocabulary. The body describes the form; the `strategicIdea` above states the
decision. Keep them distinct.

<!--
CHECKLIST
[ ] slug is unique and kebab-case
[ ] originCourse names the canonical origin (free text is fine)
[ ] strategicIdea is filled and actually states a DECISION (required)
[ ] description explains the physical form, distinct from the strategic idea
[ ] at least 2 holes link to this template via their `templates:` list

DONE means:
- The template renders at /templates/<slug> with the strategic idea featured.
- The instances table shows ≥2 holes (draft the holes if they don't exist yet).
- A schematic diagram is attached, or diagramUrl is intentionally left blank.
-->
