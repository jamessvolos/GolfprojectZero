import Link from "next/link";
import { PillarNav } from "./PillarNav";

/**
 * The one shared shell: a light, ruled masthead (site title + 2-pillar nav)
 * and a deep-green footer. Every page renders between them — the constant that
 * makes Templates and the Atlas feel like one study.
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
      <header className="sticky top-0 z-30 border-b border-paper-edge bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-5 py-3.5">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="font-serif text-xl leading-none text-ink transition-colors group-hover:text-fairway">
              The Strategic Line
            </span>
            <span className="hidden text-[0.62rem] uppercase tracking-label text-ink-faint sm:inline">
              Golf course architecture
            </span>
          </Link>
          <PillarNav />
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-24 bg-clubhouse-deep text-paper">
        <div className="mx-auto max-w-shell px-5 py-14">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
            <div className="max-w-prose">
              <p className="font-serif text-xl text-paper">The Strategic Line</p>
              <p className="mt-3 text-sm leading-relaxed text-paper/60">
                Working notes on golf course architecture — the template holes of
                the Golden Age and the architects and courses that made them.
              </p>
            </div>
            <nav className="flex flex-col gap-2 text-sm sm:items-end">
              <span className="text-[0.62rem] uppercase tracking-label text-gold-bright/80">
                The two pillars
              </span>
              <Link href="/templates" className="text-paper/70 hover:text-gold-bright">
                Templates
              </Link>
              <Link href="/atlas" className="text-paper/70 hover:text-gold-bright">
                Atlas
              </Link>
              <Link href="/architects" className="text-paper/70 hover:text-gold-bright">
                Architects
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
