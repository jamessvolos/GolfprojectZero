# Deploying The Strategic Line

The site is designed to deploy as a **fully static build**: the SQLite database
exists only during `next build` (validated → seeded from `/content` → prerendered),
so production needs **no database, no env vars, no server state**. Every page is
static HTML + client JS.

## Vercel (recommended, ~2 minutes)

1. Go to [vercel.com/new](https://vercel.com/new) and import the
   `jamessvolos/GolfprojectZero` GitHub repository.
2. Accept the defaults — `vercel.json` in the repo already pins the framework
   and sets the build-time `DATABASE_URL` (`file:./dev.db`). No environment
   variables to add.
3. Deploy. Every push to `main` redeploys automatically.

That's it. The build runs `npm run build`, which does:
`validate content → prisma generate → db push (SQLite) → seed from /content → next build`.

### Custom domain

Project → Settings → Domains → add your domain (e.g. a subdomain of
`jamessvolos.com`) and follow the DNS instructions.

## Anywhere else (Netlify, Cloudflare Pages, a VPS)

Any host that can run a Node build works the same way:

- **Build command:** `npm run build`
- **Env at build time only:** `DATABASE_URL=file:./dev.db`
- **Serve:** `npm run start` (Node) — or use `next build` output with the
  host's Next.js adapter.

## Requirements & gotchas

- **Map tiles:** the Atlas loads tiles from `tile.openstreetmap.org` in the
  visitor's browser — nothing needed server-side, but corporate proxies that
  block OSM will show a blank map background (pins still render).
- **Content updates:** edit markdown in `/content`, push to `main`; the next
  build reseeds and re-renders everything. No CMS, no migrations.
- **Postgres (optional, later):** only needed if the site ever grows
  runtime-written data. Switch `provider` to `"postgresql"` in
  `prisma/schema.prisma`, set `DATABASE_URL` accordingly, and promote
  `era`/`school` to real enums if desired (`src/lib/taxonomy.ts` holds the
  value sets).
- **Photos:** licensed images dropped into `/public/photos` + a
  `photoUrl`/`photoCredit` line in content frontmatter deploy like any other
  static asset (see `public/photos/README.md`).
