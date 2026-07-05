import Link from "next/link";
import { PillarNav } from "./PillarNav";

/**
 * The one shared shell: header (site title + 3-pillar nav) and footer
 * (colophon link), with a consistent max-width and vertical rhythm. Every page
 * renders inside this — it is what makes three different pages feel like one
 * site.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-fairway focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-paper-edge bg-paper/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="font-serif text-lg leading-none text-ink transition-colors group-hover:text-fairway">
              The Strategic Line
            </span>
            <span className="hidden text-xs text-ink-faint sm:inline">
              golf course architecture
            </span>
          </Link>
          <PillarNav />
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-24 border-t border-paper-edge bg-paper-deep/40">
        <div className="mx-auto max-w-shell px-5 py-12">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-prose">
              <p className="font-serif text-lg text-ink">The Strategic Line</p>
              <p className="mt-2 text-sm text-ink-faint">
                Every great hole is a decision problem. Strategic design offers
                a well-formed choice between risk and reward — this site makes
                that idea explicit.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/templates" className="text-ink-soft hover:text-fairway">
                Templates
              </Link>
              <Link href="/decisions" className="text-ink-soft hover:text-fairway">
                Decisions
              </Link>
              <Link href="/atlas" className="text-ink-soft hover:text-fairway">
                Atlas
              </Link>
              <Link href="/about" className="text-ink-soft hover:text-fairway">
                Colophon
              </Link>
            </nav>
          </div>
          <p className="mt-10 text-xs text-ink-faint">
            A personal project by James Svolos. Content is curated and, where
            attribution is contested, said to be so.
          </p>
        </div>
      </footer>
    </div>
  );
}
