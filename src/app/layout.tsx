import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { PageShell } from "@/components/PageShell";

// Serif for display/headings — Fraunces, an "old style" serif with the
// bookish, slightly idiosyncratic warmth the subject calls for.
const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  axes: ["opsz", "SOFT", "WONK"],
});

// Clean sans for UI/body.
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const SITE_NAME = "The Strategic Line";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Golf Course Architecture`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "A site about golf course architecture, built on one thesis: every great hole is a decision problem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
