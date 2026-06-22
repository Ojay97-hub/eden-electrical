import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// IvyJournal SemiBold is licensed by the client; files live in src/fonts.
export const ivy = localFont({
  src: [
    { path: "../fonts/IvyJournal-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/IvyJournal-SemiBold.woff", weight: "600", style: "normal" },
  ],
  variable: "--font-ivy",
  display: "swap",
});
