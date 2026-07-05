import Link from "next/link";
import { PillarNav } from "./PillarNav";

/**
 * The one shared shell, in the clubhouse idiom: the header is a painted
 * racing-green entrance sign with a brass fitting-line; the footer is a walnut
 * honour board with gold lettering. Every page renders between them, which is
 * what makes three different pages feel like one clubhouse.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:text-walnut-deep"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 bg-clubhouse shadow-[0_1px_0_rgba(174,138,70,0.55),0_2px_0_rgba(0,0,0,0.25)]">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="engraved font-serif text-lg leading-none transition-colors group-hover:text-gold-bright">
              The Strategic Line
            </span>
            <span className="hidden text-xs uppercase tracking-label text-paper/45 sm:inline">
              Golf Course Architecture
            </span>
          </Link>
          <PillarNav />
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="honor-board mt-24 border-t-2 border-gold/40">
        <div className="mx-auto max-w-shell px-5 py-14">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
            <div className="max-w-prose">
              <p className="engraved font-serif text-xl">The Strategic Line</p>
              <p className="mt-3 text-sm leading-relaxed text-paper/55">
                Every great hole is a decision problem. Strategic design offers
                a well-formed choice between risk and reward — this site makes
                that idea explicit.
              </p>
            </div>
            <nav className="flex flex-col gap-2 text-sm sm:items-end">
              <span className="text-xs uppercase tracking-label text-gold-bright/70">
                The three pillars
              </span>
              <Link href="/templates" className="text-paper/70 hover:text-gold-bright">
                Templates
              </Link>
              <Link href="/decisions" className="text-paper/70 hover:text-gold-bright">
                Decisions
              </Link>
              <Link href="/atlas" className="text-paper/70 hover:text-gold-bright">
                Atlas
              </Link>
              <Link href="/about" className="text-paper/70 hover:text-gold-bright">
                Colophon
              </Link>
            </nav>
          </div>
          <div className="mt-12 border-t border-white/10 pt-6">
            <p className="text-xs text-paper/45">
              A personal project by James Svolos. Content is curated and, where
              attribution is contested, said to be so.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
