---
# ─────────────────────────────────────────────────────────────────────
# ADD A HOLE  (and, optionally, a HOLE BREAKDOWN for Page 2)
# Copy to content/holes/<slug>.md and fill in.
#
# Two kinds of hole live in this one file:
#  (a) a plain hole / template instance — fill the top block, skip the
#      decisionBrief + options.
#  (b) a full Decision Architecture breakdown (Page 2) — ALSO fill
#      decisionBrief + options. This is the site's HIGHEST-CRAFT loop.
#      Cap output to protect quality: a few great breakdowns beat many weak ones.
#
# Loop: pick hole → write the fork → write options in parallel → optional
#       diagram → publish.
# ─────────────────────────────────────────────────────────────────────
slug: course-slug-number      # kebab-case, unique, stable (used in URLs)
course: course-slug            # must match an existing course's slug
number: 1
par: 4
yardage: 400                   # optional

# Template instances — how this specific hole relates to templates (Page 1).
# Omit or leave empty ([]) if the hole is not a version of any template.
templates:
  - template: template-slug    # must match an existing template's slug
    fidelity: 3                 # 1–5, how faithful this instance is to the archetype
    notes: |
      How THIS instance differs from the archetype. Nuance and honest
      uncertainty belong here — this is curation.

# ── Page 2 (Decision Architecture) fields — OPTIONAL ──
# Fill these ONLY for an authored breakdown. Leave them out for a plain hole.
decisionBrief: |               # markdown: 2–3 sentences framing the fork.
  Frame the choice the hole poses. Name the fork in the golfer's decision so
  that everything below hangs off it. This is the thesis of the hole.
options:                       # 2–4 options, each a parallel panel on the page.
  - label: The bold line
    order: 1
    reward: |                  # markdown: what you gain if it comes off.
      What the aggressive choice earns.
    risk: |                    # markdown: what it costs when it fails.
      What goes wrong, and how badly.
    expectedNote: |            # markdown: the EV / strokes-gained intuition.
      Qualitative unless you have a defensible strokes-gained source.
      DO NOT invent EV numbers. Describe the shape of the tradeoff instead.
  - label: The safe line
    order: 2
    reward: |
      What the conservative choice earns.
    risk: |
      What you concede, and why "safe" is rarely free.
    expectedNote: |
      The lower-variance side of the tradeoff, qualitatively.
---

Write the hole summary here as markdown (this body becomes the `summary`
field). For a plain instance, a short paragraph on the hole and its template
relationship is enough. For a Page 2 breakdown, use the summary to land the
*point* of the decision — what this hole teaches about strategy.

<!--
CHECKLIST
[ ] slug is unique and kebab-case
[ ] course slug matches an existing course file
[ ] any template slugs in `templates:` match existing template files
[ ] fidelity is 1–5; notes hold honest nuance
[ ] (breakdown only) decisionBrief states a real fork in 2–3 sentences
[ ] (breakdown only) 2–4 options, each with reward / risk / expectedNote
[ ] NO fabricated strokes-gained numbers anywhere — qualitative unless sourced

DONE means:
- The hole appears on its course profile at /courses/<course-slug>.
- If it's a template instance, it appears in that template's instances table.
- If it has a decisionBrief, it renders at /decisions/<slug> with options laid
  out in parallel, and the "the choice: …" teaser reads well on the index.
-->
