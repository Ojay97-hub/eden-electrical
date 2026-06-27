import { prisma } from "@/lib/db";

/**
 * Editable content with code-level defaults. Each field maps to a card in the
 * admin content editor. The Hero section is fully wired; the other sections'
 * defaults are defined here so they can be exposed in the editor next.
 */
export const CONTENT_DEFAULTS = {
  hero: {
    headline: "Clean energy, expertly installed.",
    intro:
      "Eden Electrical designs and fits solar panels, battery storage and EV charging across Kent & the South East — MCS-certified work, honest advice and a price you can see up front.",
    image: "/assets/webp-eden-electrical/solar-panels-dramatic-low-angle.webp",
    ctaPrimary: "Try the cost calculator",
    ctaSecondary: "Get a free quote",
  },
  about: {
    eyebrow: "About us",
    heading: "Renewable energy, done properly.",
    body1:
      "Eden Electrical is a Kent-based renewable energy specialist. We help homeowners and businesses across the South East cut their bills and their carbon with solar, battery storage and EV charging that's designed around how you actually live.",
    body2:
      "Our mission is simple: deliver workmanship we'd be proud to put our name on, explain every option in plain English, and give you a clear price before any work begins.",
  },
  contact: {
    phone: "01892 000 000",
    email: "contact@eden-electrical.com",
    coverage: "Kent & the South East",
  },
} as const;

export type Section = keyof typeof CONTENT_DEFAULTS;
export type SectionContent<S extends Section> = Record<
  keyof (typeof CONTENT_DEFAULTS)[S],
  string
>;

/** Read one section's content, merging stored overrides over the defaults. */
export async function getSectionContent<S extends Section>(
  section: S
): Promise<SectionContent<S>> {
  const defaults = CONTENT_DEFAULTS[section];
  const merged: Record<string, string> = { ...defaults };
  try {
    const rows = await prisma.content.findMany({ where: { section } });
    for (const row of rows) {
      if (row.field in merged) merged[row.field] = row.value;
    }
  } catch {
    // Database not reachable (e.g. first run before `db push`) — fall back to
    // defaults so the public site still renders.
  }
  return merged as SectionContent<S>;
}

/** Persist a section's fields (upsert one row per field). */
export async function saveSectionContent<S extends Section>(
  section: S,
  fields: Partial<SectionContent<S>>
): Promise<void> {
  const allowed = Object.keys(CONTENT_DEFAULTS[section]);
  const entries = Object.entries(fields).filter(([k]) => allowed.includes(k));
  await prisma.$transaction(
    entries.map(([field, value]) =>
      prisma.content.upsert({
        where: { section_field: { section, field } },
        update: { value: String(value) },
        create: { section, field, value: String(value) },
      })
    )
  );
}
