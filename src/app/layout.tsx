import type { Metadata } from "next";
import { EB_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { PageShell } from "@/components/PageShell";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Display serif — Playfair Display, architectural and bookish, for headings.
const serif = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

// Reading serif — EB Garamond, a warm oldstyle face for long-form prose.
const body = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Clean sans for small UI labels, eyebrows, and data.
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Golf Course Architecture`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Golf Course Architecture`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${body.variable} ${sans.variable}`}
    >
      <body>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
