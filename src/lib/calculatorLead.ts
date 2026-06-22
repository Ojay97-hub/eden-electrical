import type { CalcResult } from "@/lib/calculator";

export const CONTACT_SERVICE_OPTIONS = [
  "Solar Panels",
  "Battery Storage",
  "EV Charging",
  "Bundle & Save",
  "O&M for Solar",
  "Not sure yet",
] as const;

export const CALCULATOR_SERVICE_LABELS = {
  solar: "Solar Panels",
  battery: "Battery Storage",
  ev: "EV Charging",
  bundle: "Bundle & Save",
} as const;

export const CALCULATOR_LEAD_EVENT = "eden:calculator-lead";
export const CALCULATOR_LEAD_STORAGE_KEY = "eden:calculator-lead";

export type CalculatorLeadDetail = {
  service: string;
  estimate: string;
};

function isContactServiceOption(value: string): boolean {
  return (CONTACT_SERVICE_OPTIONS as readonly string[]).includes(value);
}

/**
 * Validates an unknown value (e.g. parsed sessionStorage JSON) as a calculator
 * lead. Returns null when the shape is wrong so callers can fail safe.
 */
export function parseCalculatorLead(value: unknown): CalculatorLeadDetail | null {
  if (!value || typeof value !== "object") return null;
  const { service, estimate } = value as Record<string, unknown>;
  if (typeof service !== "string" || typeof estimate !== "string") return null;
  if (!estimate.trim()) return null;
  return { service, estimate };
}

/**
 * Maps a calculator service label onto a Contact form option. Falls back to
 * "Not sure yet" so the select is always left on a valid choice.
 */
export function serviceToContactOption(service: string): string {
  return isContactServiceOption(service) ? service : "Not sure yet";
}

export function formatCalculatorLead(
  service: string,
  result: CalcResult
): string {
  return [
    "Calculator estimate",
    `Service: ${service}`,
    `${result.priceLabel}: ${result.price}`,
    ...result.stats.map((stat) => `${stat.label}: ${stat.value}`),
  ].join("\n");
}
