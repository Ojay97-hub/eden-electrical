import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { inter, poppins, plexMono } from "@/lib/fonts";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eden Electrical — Solar, Battery & EV Charging in Kent",
  description:
    "Eden Electrical designs and fits solar panels, battery storage and EV charging across Kent & the South East. MCS-certified work and transparent pricing.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${plexMono.variable}`}
    >
      <body className="font-sans bg-cream text-ink antialiased">
        {children}
        {/* Streams live content updates into the page (e.g. Presentation tool). */}
        <SanityLive />
        {/* Click-to-edit overlays, only while previewing drafts. */}
        {isDraft && <VisualEditing />}
      </body>
    </html>
  );
}
