# The Strategic Line

A site about golf course architecture, built on one thesis: **every great hole
is a decision problem.** Strategic design — Macdonald, MacKenzie, Ross — doesn't
punish the golfer; it offers a well-formed choice between risk and reward. This
is a study of the holes that idea produced.

Two pillars over one shared graph of architects, courses, and holes:

- **Templates** (`/templates`) — the Macdonald/Raynor classification, presented
  as a gallery of hand-drawn hole plates. Each template states the decision it
  poses, opens with an at-a-glance facts strip and a legend for reading the
  diagram, and maps every course with a version of it (compare instances side
  by side).
- **Atlas** (`/atlas`) — an interactive map + timeline of the golden age
  (1900–1937) and the minimalist revival, plus a scannable course index. Filter
  by architect, era, or school; state lives in the URL so map and timeline stay
  in sync and links are shareable. A browsable [`/architects`](/) index groups
  the designers by era.

Courses (`/courses/[slug]`) and architects (`/architects/[slug]`) are shared
entities both pillars link into — the graph is the point.

> **Scope note.** An earlier build also carried a **Decisions** page (holes
> modelled option-by-option). It has been retired to focus the site on the
> templates and the atlas. The data model still keeps each hole's optional
> `decisionBrief`, so the page can return without a migration.

**Design language.** Aged-paper ground, forest green as the lead accent, flat
ochre brass as the quiet second, a deep-green footer. Playfair Display
(display) + EB Garamond (reading serif) + Inter (UI labels), via `next/font`.

## Stack

Next.js (App Router) · TypeScript · Tailwind · Prisma · SQLite (dev) /
Postgres (prod) · Leaflet + OpenStreetMap · react-markdown.

## Getting started

```bash
npm install
npm run setup     # prisma generate + db push + seed from /content
npm run dev       # http://localhost:3000
```

`npm run setup` is `generate → db push → seed`. To reseed after editing content:

```bash
npm run db:reset  # force-reset schema + reseed
```

## Content model

Content is **git-based markdown**, not a CMS. Files live under `/content`:

```
content/
  architects/*.md   frontmatter + bio
  courses/*.md      frontmatter (incl. lat/lng, architect slug) + summary
  templates/*.md    frontmatter (incl. strategicIdea) + description
  holes/*.md        frontmatter (templates, decisionBrief, options) + summary
  _templates/       the four authoring loops (how to add each content type)
```

At build (and on `db:seed`), `prisma/seed.ts` reads the corpus via
`src/lib/content.ts` and populates the database. Records link by **slug**;
create the thing you link *to* first (architect → course → hole).

To add anything, copy the matching file from `content/_templates/` and follow
its checklist and "Done" definition. See `content/_templates/README.md`.

## Design system

A small, strict component vocabulary reused across all three pages
(`src/components/`): `PageShell`, `PillarNav`, `EntityCard` (the one card
primitive), `FilterBar` (URL-param state), `CrossLinkChip`, `MarkdownProse`,
`FidelityMeter`, `SchematicDiagram` (template archetypes drawn as inline SVG),
`CompareTray`, `DecisionOptions`, and the Atlas map/timeline. The rule: extend
an existing component with a variant before adding a new one.

Design tokens (Tailwind theme): warm paper `#F7F4EC`, ink `#1C1A17`, fairway
green `#3A5A40`, restrained gold `#B08D4C`. Fraunces (display) + Inter (text)
via `next/font`.

## Notes

- **Expected-value figures are qualitative** — the shape of the tradeoff, never
  fabricated strokes-gained numbers.
- **Attribution is curated, not auto-filled.** Contested template and
  restoration credits are held honestly in the `notes` / `restorations` fields.
- **Prod database:** switch `provider` to `postgresql` in
  `prisma/schema.prisma` and set `DATABASE_URL`. `era`/`school` are stored as
  strings (SQLite has no native enums) with values enforced in
  `src/lib/taxonomy.ts`; they can be promoted to real enums on Postgres.
- **Map tiles** use OpenStreetMap directly (no paid key); the deploy
  environment must allow outbound requests to `tile.openstreetmap.org`.

## Out of scope (v1)

No AI "architecture critic" (a clean seam is left for v2), no auth/accounts/
comments, no CMS/admin UI, no paid map or geocoding services.
