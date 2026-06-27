import { Inter, Poppins, IBM_Plex_Mono } from "next/font/google";

// Matches the typography used by the NovaInstall quote builder, for an A/B
// comparison against the site's original Hanken Grotesk / Ivy Journal pairing.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
