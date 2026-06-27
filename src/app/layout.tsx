import type { Metadata, Viewport } from "next";
import { inter, poppins, plexMono } from "@/lib/fonts";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${plexMono.variable}`}
    >
      <body className="font-sans bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
