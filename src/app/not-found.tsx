import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-prose px-5 py-28 text-center">
      <p className="eyebrow mb-4">Off the fairway</p>
      <h1 className="font-serif text-4xl text-ink">Nothing here</h1>
      <p className="mt-4 text-ink-soft">
        This page isn&rsquo;t on the card. Play back to safe ground.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm bg-fairway px-5 py-2.5 text-paper transition-colors hover:bg-fairway-deep"
        >
          Home
        </Link>
        <Link
          href="/templates"
          className="rounded-sm border border-paper-edge px-5 py-2.5 text-ink-soft transition-colors hover:border-fairway hover:text-fairway"
        >
          Templates
        </Link>
      </div>
    </div>
  );
}
