/**
 * Pricing calculator logic. All formulas mirror the handoff README and the
 * prototype. Constants are UK estimates — exposed here as `CALC_CONFIG` so the
 * client can tune them without touching the maths.
 *
 * All figures are INDICATIVE estimates for guidance only.
 */

export const CALC_CONFIG = {
  solar: {
    bedKwp: [3, 4, 5, 6.5], // '1–2 bed', '3 bed', '4 bed', '5+ bed'
    bedLabels: ["1–2 bed", "3 bed", "4 bed", "5+ bed"],
    orientFactor: [1.0, 0.85, 0.62], // South, East/West, North
    orientLabels: ["South", "East / West", "North"],
    panelKw: 0.43, // ~430 W panels
    costLoPerKwp: 1500,
    costHiPerKwp: 1900,
    yieldPerKwp: 950, // kWh/yr per kWp (Kent ~950)
    tariff: 0.22, // £/kWh value of generation
    billSavingCap: 0.9, // cap saving at 90% of bill
  },
  battery: {
    costLoPerKwh: 750,
    costHiPerKwh: 950,
    savePerKwhSolar: 70, // £/yr when paired with solar
    savePerKwhNoSolar: 45, // £/yr standalone
  },
  ev: {
    base: [899, 1499], // 7 kW, 22 kW
    powerKw: [7, 22],
    untetheredAdd: 60,
    smartAdd: 170,
    longRunAdd: 220,
  },
  bundle: {
    discountRate: 0.08, // when 2+ services selected
    discountMinItems: 2,
  },
} as const;

// ---- formatting helpers (README) ----
export const fmt = (n: number): string =>
  "£" + Math.round(n).toLocaleString("en-GB");
export const r50 = (n: number): number => Math.round(n / 50) * 50;
export const range = (lo: number, hi: number): string =>
  `${fmt(r50(lo))} – ${fmt(r50(hi))}`;

export type Stat = { label: string; value: string };
export type CalcResult = {
  priceLabel: string;
  price: string;
  stats: Stat[];
  note: string;
  cta: string;
};

// ---- Solar ----
export type SolarInput = { beds: number; orient: number; bill: number };
/** Raw numeric figures for a solar config — shared by the solar tab and the bundle. */
export function solarFigures({ beds, orient, bill }: SolarInput) {
  const c = CALC_CONFIG.solar;
  const kwp = c.bedKwp[beds];
  const panels = Math.round(kwp / c.panelKw);
  const gen = Math.round(kwp * c.yieldPerKwp * c.orientFactor[orient]);
  const save = Math.min(
    Math.round(gen * c.tariff),
    Math.round(bill * c.billSavingCap)
  );
  const costLo = kwp * c.costLoPerKwp;
  const costHi = kwp * c.costHiPerKwp;
  return { kwp, panels, gen, save, costLo, costHi };
}
export function solar(input: SolarInput): CalcResult {
  const { kwp, panels, gen, save, costLo, costHi } = solarFigures(input);
  const payback = (costLo + costHi) / 2 / save;
  return {
    priceLabel: "Estimated installed cost",
    price: range(costLo, costHi),
    stats: [
      { label: "Recommended system", value: `${kwp} kWp · ~${panels} panels` },
      { label: "Annual generation", value: `${gen.toLocaleString("en-GB")} kWh` },
      { label: "Estimated saving", value: `${fmt(save)} / yr` },
      { label: "Indicative payback", value: `${payback.toFixed(1)} years` },
    ],
    note: "Based on a typical Kent roof at current tariffs. Final price confirmed after a free survey.",
    cta: "Book a free survey",
  };
}

// ---- Battery ----
export type BatteryInput = { cap: number; hasSolar: boolean };
/** Raw numeric figures for a battery config — shared by the battery tab and the bundle. */
export function batteryFigures({ cap, hasSolar }: BatteryInput) {
  const c = CALC_CONFIG.battery;
  const costLo = cap * c.costLoPerKwh;
  const costHi = cap * c.costHiPerKwh;
  const save = hasSolar ? cap * c.savePerKwhSolar : cap * c.savePerKwhNoSolar;
  return { costLo, costHi, save };
}
export function battery({ cap, hasSolar }: BatteryInput): CalcResult {
  const { costLo, costHi, save } = batteryFigures({ cap, hasSolar });
  const payback = (costLo + costHi) / 2 / save;
  return {
    priceLabel: "Estimated installed cost",
    price: range(costLo, costHi),
    stats: [
      { label: "Usable capacity", value: `${cap} kWh` },
      { label: "Paired with solar", value: hasSolar ? "Yes" : "No" },
      { label: "Estimated saving", value: `${fmt(save)} / yr` },
      { label: "Indicative payback", value: `${payback.toFixed(1)} years` },
    ],
    note: "Savings assume off-peak charging and typical evening usage. Confirmed after survey.",
    cta: "Book a free survey",
  };
}

// ---- EV charging ----
export type EvInput = {
  power: number; // 0 = 7kW, 1 = 22kW
  mount: number; // 0 = tethered, 1 = untethered
  smart: boolean;
  longRun: boolean;
};
/** Raw numeric figures for an EV charger config — shared by the EV tab and the bundle. */
export function evFigures({ power, mount, smart, longRun }: EvInput) {
  const c = CALC_CONFIG.ev;
  const total =
    c.base[power] +
    (mount === 1 ? c.untetheredAdd : 0) +
    (smart ? c.smartAdd : 0) +
    (longRun ? c.longRunAdd : 0);
  return { total };
}
export function ev({ power, mount, smart, longRun }: EvInput): CalcResult {
  const c = CALC_CONFIG.ev;
  const { total } = evFigures({ power, mount, smart, longRun });
  return {
    priceLabel: "Fully installed from",
    price: fmt(r50(total)),
    stats: [
      {
        label: "Charge point",
        value: `${c.powerKw[power]} kW · ${mount === 1 ? "Untethered" : "Tethered"}`,
      },
      { label: "Smart charging", value: smart ? "Included" : "Not included" },
      {
        label: "Cable run",
        value: longRun ? "Extended (>10m)" : "Standard (<10m)",
      },
      { label: "Install time", value: "Typically half a day" },
    ],
    note: "Price includes standard fitting & certification. Grants applied where eligible.",
    cta: "Book my install",
  };
}

// ---- Bundle ----
// The bundle prices the exact configurations the visitor set on the Solar,
// Battery and EV tabs, so the package total always reflects their choices.
export type BundleInput = {
  solar: boolean;
  battery: boolean;
  ev: boolean;
  solarInput: SolarInput;
  batteryInput: BatteryInput;
  evInput: EvInput;
};
export function bundle({
  solar: useSolar,
  battery: useBattery,
  ev: useEv,
  solarInput,
  batteryInput,
  evInput,
}: BundleInput): CalcResult {
  const c = CALC_CONFIG.bundle;
  let lo = 0;
  let hi = 0;
  let save = 0;
  const inc: string[] = [];
  if (useSolar) {
    const f = solarFigures(solarInput);
    lo += f.costLo;
    hi += f.costHi;
    save += f.save;
    inc.push(`${f.kwp} kWp Solar`);
  }
  if (useBattery) {
    // Battery is "paired with solar" whenever solar is part of the bundle,
    // which boosts its annual saving.
    const f = batteryFigures({ cap: batteryInput.cap, hasSolar: useSolar });
    lo += f.costLo;
    hi += f.costHi;
    save += f.save;
    inc.push(`${batteryInput.cap} kWh Battery`);
  }
  if (useEv) {
    const f = evFigures(evInput);
    lo += f.total;
    hi += f.total;
    inc.push(`${CALC_CONFIG.ev.powerKw[evInput.power]} kW EV Charger`);
  }
  const nSel = [useSolar, useBattery, useEv].filter(Boolean).length;
  const disc = nSel >= c.discountMinItems ? c.discountRate : 0;
  const loD = lo * (1 - disc);
  const hiD = hi * (1 - disc);
  const saved = ((lo + hi) / 2) * disc;
  const payback = save > 0 ? (loD + hiD) / 2 / save : 0;
  return {
    priceLabel: disc
      ? `Bundle price (−${Math.round(disc * 100)}%)`
      : "Estimated total",
    price: nSel ? range(loD, hiD) : "—",
    stats: [
      { label: "Included", value: inc.length ? inc.join(" + ") : "Nothing selected" },
      { label: "You save", value: saved > 0 ? fmt(saved) : "—" },
      { label: "Annual saving", value: save > 0 ? `${fmt(save)} / yr` : "—" },
      {
        label: "Indicative payback",
        value: payback > 0 ? `${payback.toFixed(1)} years` : "—",
      },
    ],
    note: "Bundle two or more services for an 8% discount on the combined installation.",
    cta: "Book a free survey",
  };
}
