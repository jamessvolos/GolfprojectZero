# Content authoring loops

The site is only as good as how easy it is to add to it. Each content type has
a **fixed authoring loop** — a repeatable template so populating the site is
mechanical, not inventive each time. Content lives as markdown files in this
repo (git-based, no CMS in v1) and is seeded into the database at build via
`prisma/seed.ts`.

To add anything to the site:

1. Copy the matching template from this folder into the right content
   directory (`content/architects/`, `content/courses/`, `content/templates/`,
   or `content/holes/`).
2. Rename the file to `<slug>.md`.
3. Fill the frontmatter and body, following the checklist in the template.
4. Run `npm run db:reset` to reseed, then `npm run dev` to preview.
5. Meet the template's **Done** definition before you commit.

## The four loops

| Loop | Directory | Highest-craft field |
|------|-----------|---------------------|
| [Add an Architect](./architect.template.md) | `content/architects/` | `bio` |
| [Add a Course](./course.template.md) | `content/courses/` | `summary` + `restorations` |
| [Add a Template](./template.template.md) | `content/templates/` | **`strategicIdea` (required)** |
| [Add a Hole Breakdown](./hole.template.md) | `content/holes/` | **`decisionBrief` + `options`** |

## Slugs and relations

Records link by **slug**, not by title:

- A course points at its architect via the architect's slug (`architect: donald-ross`).
- A hole points at its course via the course's slug (`course: pinehurst-no2`).
- A hole points at templates via template slugs inside its `templates:` list.

Always create the thing you are linking *to* first (architect → course → hole),
or the seed will warn that a relation could not be resolved.

## A note on curation

Which course has which template, and who deserves restoration credit, are
genuinely contested in enthusiast sources. The `notes` and `restorations`
fields exist to hold that nuance. **Do not auto-fill them from a single
source** — this careful curation is the site's moat. When something is
uncertain, say so in the note rather than asserting false precision.
