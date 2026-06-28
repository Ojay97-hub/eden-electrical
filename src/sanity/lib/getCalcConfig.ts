import { buildCalcConfig, type CalculatorSettings } from "@/lib/calcConfig";
import { type CalcConfig } from "@/lib/calculator";
import { sanityFetch } from "./live";

const SETTINGS_QUERY = `*[_type == "pricingCalculatorSettings"][0]{
  solar, battery, ev, bundle
}`;

/**
 * Reads the pricing calculator settings from Sanity and merges them onto the
 * built-in defaults. Used by the homepage so the live calculator reflects the
 * editor's values — and updates live in the Presentation tool. Falls back to
 * defaults if Sanity is unreachable or no settings document exists yet.
 */
export async function getCalcConfig(): Promise<CalcConfig> {
  try {
    const { data } = await sanityFetch({ query: SETTINGS_QUERY });
    return buildCalcConfig(data as CalculatorSettings | null);
  } catch {
    return buildCalcConfig(null);
  }
}
