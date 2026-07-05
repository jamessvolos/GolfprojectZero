---
# ─────────────────────────────────────────────────────────────────────
# ADD AN ARCHITECT
# Copy to content/architects/<slug>.md and fill in.
# Loop: draft → set era/school → link courses → publish.
# ─────────────────────────────────────────────────────────────────────
slug: architect-slug          # kebab-case, unique, stable (used in URLs)
name: Full Name
born: 1900                     # optional; omit or leave blank if unknown
died: 1980                     # optional; omit or leave blank if living/unknown
era: GOLDEN_AGE                # GOLDEN_AGE | MODERN_REVIVAL | OTHER
school: STRATEGIC              # STRATEGIC | PENAL | HEROIC | MINIMALIST
photoUrl:                      # optional; path under /public or leave blank
---

Write the bio here as markdown (this body becomes the `bio` field). Two or
three tight paragraphs. Lead with what makes this architect matter to the
site's thesis — their relationship to the *decision*, to strategy, to giving
the golfer a choice rather than a sentence. Avoid an encyclopedia recital of
every course; name the two or three that carry the argument.

<!--
CHECKLIST
[ ] slug is unique and kebab-case
[ ] era and school are valid enum values (see above)
[ ] bio is 2–3 paragraphs and connects the architect to strategic design
[ ] every course you plan to link back to this architect uses this exact slug

DONE means:
- The architect page renders at /architects/<slug>.
- era and school are set (they drive the Atlas filters).
- At least one course links to this architect (or you have noted why none do).
-->
