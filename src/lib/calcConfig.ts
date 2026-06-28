/**
 * Maps the Sanity "Pricing calculator settings" document onto the calculator's
 * runtime config. Shared by the public site (live data) and the Studio preview
 * so both price with exactly the same numbers. Any value the editor hasn't set
 * falls back to the built-in CALC_CONFIG default.
 */
import { CALC_CONFIG, type CalcConfig } from "./calculator";

export type CalculatorSettings = {
  solar?: {
    costLoPerKwp?: number;
    costHiPerKwp?: number;
    yieldPerKwp?: number;
    tariff?: number;
    billSavingCap?: number;
  };
  battery?: {
    costLoPerKwh?: number;
    costHiPerKwh?: number;
    savePerKwhSolar?: number;
    savePerKwhNoSolar?: number;
  };
  ev?: {
    base7kw?: number;
    base22kw?: number;
    untetheredAdd?: number;
    smartAdd?: number;
    longRunAdd?: number;
  };
  bundle?: {
    discountRate?: number;
    discountMinItems?: number;
  };
};

const num = (value: number | undefined | null, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export function buildCalcConfig(
  doc: CalculatorSettings | null | undefined
): CalcConfig {
  const s = doc?.solar ?? {};
  const b = doc?.battery ?? {};
  const e = doc?.ev ?? {};
  const bun = doc?.bundle ?? {};
  return {
    solar: {
      ...CALC_CONFIG.solar,
      costLoPerKwp: num(s.costLoPerKwp, CALC_CONFIG.solar.costLoPerKwp),
      costHiPerKwp: num(s.costHiPerKwp, CALC_CONFIG.solar.costHiPerKwp),
      yieldPerKwp: num(s.yieldPerKwp, CALC_CONFIG.solar.yieldPerKwp),
      tariff: num(s.tariff, CALC_CONFIG.solar.tariff),
      billSavingCap: num(s.billSavingCap, CALC_CONFIG.solar.billSavingCap),
    },
    battery: {
      costLoPerKwh: num(b.costLoPerKwh, CALC_CONFIG.battery.costLoPerKwh),
      costHiPerKwh: num(b.costHiPerKwh, CALC_CONFIG.battery.costHiPerKwh),
      savePerKwhSolar: num(b.savePerKwhSolar, CALC_CONFIG.battery.savePerKwhSolar),
      savePerKwhNoSolar: num(
        b.savePerKwhNoSolar,
        CALC_CONFIG.battery.savePerKwhNoSolar
      ),
    },
    ev: {
      ...CALC_CONFIG.ev,
      base: [
        num(e.base7kw, CALC_CONFIG.ev.base[0]),
        num(e.base22kw, CALC_CONFIG.ev.base[1]),
      ],
      untetheredAdd: num(e.untetheredAdd, CALC_CONFIG.ev.untetheredAdd),
      smartAdd: num(e.smartAdd, CALC_CONFIG.ev.smartAdd),
      longRunAdd: num(e.longRunAdd, CALC_CONFIG.ev.longRunAdd),
    },
    bundle: {
      discountRate: num(bun.discountRate, CALC_CONFIG.bundle.discountRate),
      discountMinItems: num(
        bun.discountMinItems,
        CALC_CONFIG.bundle.discountMinItems
      ),
    },
  };
}
