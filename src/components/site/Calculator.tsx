"use client";

import { useState } from "react";
import {
  solar,
  battery,
  ev,
  bundle,
  fmt,
  CALC_CONFIG,
  type CalcResult,
} from "@/lib/calculator";
import {
  CALCULATOR_LEAD_EVENT,
  CALCULATOR_LEAD_STORAGE_KEY,
  CALCULATOR_SERVICE_LABELS,
  formatCalculatorLead,
} from "@/lib/calculatorLead";

type Tab = "solar" | "battery" | "ev" | "bundle";

const TABS: { key: Tab; label: string }[] = [
  { key: "solar", label: "Solar Panels" },
  { key: "battery", label: "Battery Storage" },
  { key: "ev", label: "EV Charging" },
  { key: "bundle", label: "Bundle & Save" },
];

// Decorative background photo per tab. Each crossfades in when its tab is active.
const TAB_BACKGROUNDS: Record<Tab, string> = {
  solar: "/assets/calc-solar.jpg",
  battery: "/assets/calc-battery.jpg",
  ev: "/assets/calc-ev.jpg",
  bundle: "/assets/calc-bundle.jpg",
};

const DEFAULT_CALCULATOR_STATE = {
  tab: "solar" as Tab,
  beds: 1,
  orient: 0,
  bill: 1400,
  cap: 10,
  hasSolar: true,
  evPower: 0,
  evMount: 0,
  evSmart: true,
  evLongRun: false,
  bSolar: true,
  bBattery: true,
  bEv: false,
};

// ---- small presentational helpers for the calculator controls ----
function Segmented({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(132px,1fr))] gap-2">
      {options.map((label, i) => {
        const on = active === i;
        return (
          <button
            type="button"
            key={label}
            onClick={() => onChange(i)}
            className={`min-h-[52px] min-w-0 rounded-[12px] border px-3 py-3 text-center text-[14px] font-semibold leading-[1.2] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
              on
                ? "border-primary bg-primary text-gold-light shadow-[0_14px_26px_-20px_rgba(25,55,45,0.8)]"
                : "border-primary/[0.12] bg-white text-body hover:border-primary/[0.28] hover:bg-cream"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function TogglePill({
  on,
  onClick,
  title,
  desc,
}: {
  on: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="checkbox"
      aria-checked={on}
      className={`flex w-full items-start gap-[14px] rounded-[13px] border px-4 py-[15px] text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        on
          ? "border-gold/70 bg-gold/[0.12] shadow-[0_16px_30px_-26px_rgba(168,132,42,0.8)]"
          : "border-primary/[0.12] bg-white hover:border-primary/[0.28] hover:bg-cream"
      }`}
    >
      <span
        className={`mt-[1px] flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] border text-[13px] font-extrabold text-primary transition ${
          on ? "border-gold bg-gold" : "border-primary/25 bg-field"
        }`}
      >
        {on ? "✓" : ""}
      </span>
      <div>
        <div className="font-semibold text-[15px] text-primary">{title}</div>
        <div className="text-[13.5px] text-muted">{desc}</div>
      </div>
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[12px] text-[13px] font-semibold uppercase tracking-[0.08em] text-primary/75">
      {children}
    </div>
  );
}

export function Calculator() {
  const [tab, setTab] = useState<Tab>(DEFAULT_CALCULATOR_STATE.tab);

  // Solar state
  const [beds, setBeds] = useState(DEFAULT_CALCULATOR_STATE.beds); // default "3 bed"
  const [orient, setOrient] = useState(DEFAULT_CALCULATOR_STATE.orient); // South
  const [bill, setBill] = useState(DEFAULT_CALCULATOR_STATE.bill);

  // Battery state
  const [cap, setCap] = useState(DEFAULT_CALCULATOR_STATE.cap);
  const [hasSolar, setHasSolar] = useState(DEFAULT_CALCULATOR_STATE.hasSolar);

  // EV state
  const [evPower, setEvPower] = useState(DEFAULT_CALCULATOR_STATE.evPower);
  const [evMount, setEvMount] = useState(DEFAULT_CALCULATOR_STATE.evMount);
  const [evSmart, setEvSmart] = useState(DEFAULT_CALCULATOR_STATE.evSmart);
  const [evLongRun, setEvLongRun] = useState(DEFAULT_CALCULATOR_STATE.evLongRun);

  // Bundle state
  const [bSolar, setBSolar] = useState(DEFAULT_CALCULATOR_STATE.bSolar);
  const [bBattery, setBBattery] = useState(DEFAULT_CALCULATOR_STATE.bBattery);
  const [bEv, setBEv] = useState(DEFAULT_CALCULATOR_STATE.bEv);

  const solarInput = { beds, orient, bill };
  const batteryInput = { cap, hasSolar };
  const evInput = { power: evPower, mount: evMount, smart: evSmart, longRun: evLongRun };

  let result: CalcResult;
  if (tab === "solar") result = solar(solarInput);
  else if (tab === "battery") result = battery(batteryInput);
  else if (tab === "ev") result = ev(evInput);
  else
    result = bundle({
      solar: bSolar,
      battery: bBattery,
      ev: bEv,
      // The bundle prices whatever the visitor configured on the other tabs.
      solarInput,
      batteryInput,
      evInput,
    });

  function resetCalculator() {
    setTab(DEFAULT_CALCULATOR_STATE.tab);
    setBeds(DEFAULT_CALCULATOR_STATE.beds);
    setOrient(DEFAULT_CALCULATOR_STATE.orient);
    setBill(DEFAULT_CALCULATOR_STATE.bill);
    setCap(DEFAULT_CALCULATOR_STATE.cap);
    setHasSolar(DEFAULT_CALCULATOR_STATE.hasSolar);
    setEvPower(DEFAULT_CALCULATOR_STATE.evPower);
    setEvMount(DEFAULT_CALCULATOR_STATE.evMount);
    setEvSmart(DEFAULT_CALCULATOR_STATE.evSmart);
    setEvLongRun(DEFAULT_CALCULATOR_STATE.evLongRun);
    setBSolar(DEFAULT_CALCULATOR_STATE.bSolar);
    setBBattery(DEFAULT_CALCULATOR_STATE.bBattery);
    setBEv(DEFAULT_CALCULATOR_STATE.bEv);
  }

  function handleContactClick() {
    const service = CALCULATOR_SERVICE_LABELS[tab];
    const detail = {
      service,
      estimate: formatCalculatorLead(service, result),
    };

    try {
      window.sessionStorage.setItem(
        CALCULATOR_LEAD_STORAGE_KEY,
        JSON.stringify(detail)
      );
    } catch {
      // Session storage can be unavailable in strict browser modes.
    }

    window.dispatchEvent(
      new CustomEvent(CALCULATOR_LEAD_EVENT, { detail })
    );
  }

  return (
    <section
      id="calculator"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#19372d_0%,#11261f_100%)]"
    >
      {/* Per-tab background photos, crossfading behind a dark overlay so content stays legible */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {TABS.map((t) => (
          <div
            key={t.key}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out ${
              tab === t.key ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${TAB_BACKGROUNDS[t.key]}')` }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,55,45,0.84)_0%,rgba(17,38,31,0.94)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-calc px-5 py-[92px] sm:px-8 sm:py-[110px]">
        <div className="mx-auto mb-9 max-w-[640px] text-center sm:mb-11">
          <div className="mb-[16px] font-mono text-[12px] uppercase tracking-eyebrow text-gold">
            Instant estimate
          </div>
          <h2 className="m-0 mb-4 font-display text-[40px] font-semibold leading-[1.05] tracking-tightish text-white sm:text-[50px]">
            Pricing calculator
          </h2>
          <p className="mx-auto max-w-[540px] text-[17px] leading-[1.65] text-white/[0.84] sm:text-[18px]">
            Pick a service, set your details and get an indicative price in
            seconds. No email required.
          </p>
        </div>

        {/* tabs */}
        <div className="mb-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <div className="grid w-full max-w-[720px] grid-cols-2 gap-1 rounded-[16px] border border-white/[0.28] bg-deep/75 p-1 shadow-[0_22px_50px_-40px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:grid-cols-4">
            {TABS.map((t) => {
              const on = tab === t.key;
              return (
                <button
                  type="button"
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`min-h-[48px] rounded-[12px] border-none px-3 py-3 text-[14px] font-semibold leading-[1.2] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    on
                      ? "bg-white text-primary shadow-[0_12px_28px_-24px_rgba(0,0,0,0.75)]"
                      : "bg-transparent text-white/[0.88] hover:bg-white/[0.1] hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={resetCalculator}
            aria-label="Reset calculator to default values"
            title="Reset calculator"
            className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-white/[0.28] bg-deep/75 text-[24px] font-semibold leading-none text-white/[0.9] shadow-[0_18px_40px_-32px_rgba(0,0,0,0.75)] transition hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            ↻
          </button>
        </div>

        {/* card */}
        <div className="grid grid-cols-1 overflow-hidden rounded-[22px] border border-white/[0.24] bg-field/95 shadow-[0_38px_90px_-52px_rgba(0,0,0,0.75)] backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="flex p-6 sm:p-8 lg:min-h-[560px] lg:p-11">
            {tab === "solar" && (
              <div className="flex w-full flex-1 flex-col justify-center gap-8 sm:gap-10 lg:gap-12">
                <div className="w-full">
                  <Label>Property size</Label>
                  <Segmented
                    options={CALC_CONFIG.solar.bedLabels as unknown as string[]}
                    active={beds}
                    onChange={setBeds}
                  />
                </div>
                <div className="w-full">
                  <Label>Roof orientation</Label>
                  <Segmented
                    options={CALC_CONFIG.solar.orientLabels as unknown as string[]}
                    active={orient}
                    onChange={setOrient}
                  />
                </div>
                <div className="w-full rounded-[16px] border border-primary/[0.1] bg-white p-5 sm:p-6">
                  <div className="mb-[14px] flex items-baseline justify-between gap-4">
                    <span className="font-semibold text-[15px] text-primary">
                      Average annual electricity bill
                    </span>
                    <span className="font-mono font-medium text-[18px] text-primary">
                      {fmt(bill)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={400}
                    max={4000}
                    step={50}
                    value={bill}
                    onChange={(e) => setBill(+e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {tab === "battery" && (
              <div className="flex w-full flex-1 flex-col justify-center gap-8 sm:gap-10 lg:gap-12">
                <div className="w-full rounded-[16px] border border-primary/[0.1] bg-white p-5 sm:p-6">
                  <div className="mb-[14px] flex items-baseline justify-between gap-4">
                    <span className="font-semibold text-[15px] text-primary">
                      Battery capacity
                    </span>
                    <span className="font-mono font-medium text-[18px] text-primary">
                      {cap} kWh
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={20}
                    step={1}
                    value={cap}
                    onChange={(e) => setCap(+e.target.value)}
                    className="w-full"
                  />
                  <div className="mt-2 flex justify-between font-mono text-[12px] text-muted-2">
                    <span>5 kWh</span>
                    <span>20 kWh</span>
                  </div>
                </div>
                <div className="w-full">
                  <Label>Pairing with solar?</Label>
                  <TogglePill
                    on={hasSolar}
                    onClick={() => setHasSolar((v) => !v)}
                    title="Yes, alongside solar panels"
                    desc="Boosts savings by storing daytime generation."
                  />
                </div>
              </div>
            )}

            {tab === "ev" && (
              <div className="flex w-full flex-1 flex-col justify-center gap-8 sm:gap-10 lg:gap-12">
                <div className="w-full">
                  <Label>Charger power</Label>
                  <Segmented
                    options={["7 kW", "22 kW"]}
                    active={evPower}
                    onChange={setEvPower}
                  />
                </div>
                <div className="w-full">
                  <Label>Cable type</Label>
                  <Segmented
                    options={["Tethered", "Untethered"]}
                    active={evMount}
                    onChange={setEvMount}
                  />
                </div>
                <div className="grid w-full gap-3">
                  <TogglePill
                    on={evSmart}
                    onClick={() => setEvSmart((v) => !v)}
                    title="Smart, solar-aware charging"
                    desc="Charge from your own solar & off-peak rates."
                  />
                  <TogglePill
                    on={evLongRun}
                    onClick={() => setEvLongRun((v) => !v)}
                    title="Extended cable run (over 10m)"
                    desc="For chargers far from the consumer unit."
                  />
                </div>
              </div>
            )}

            {tab === "bundle" && (
              <div className="flex w-full flex-1 flex-col justify-center gap-8 sm:gap-10 lg:gap-12">
                <div className="w-full">
                  <div className="mb-[6px] text-[15px] font-semibold text-primary">
                    Build your package
                  </div>
                  <p className="text-[14px] text-muted m-0">
                    Uses the options you set on the Solar, Battery and EV tabs.
                    Select two or more for an 8% bundle discount.
                  </p>
                </div>
                <div className="grid w-full gap-3">
                  <TogglePill
                    on={bSolar}
                    onClick={() => setBSolar((v) => !v)}
                    title="Solar Panels"
                    desc={`${CALC_CONFIG.solar.bedKwp[beds]} kWp · ${CALC_CONFIG.solar.bedLabels[beds]} · ${CALC_CONFIG.solar.orientLabels[orient]} facing`}
                  />
                  <TogglePill
                    on={bBattery}
                    onClick={() => setBBattery((v) => !v)}
                    title="Battery Storage"
                    desc={`${cap} kWh usable capacity`}
                  />
                  <TogglePill
                    on={bEv}
                    onClick={() => setBEv((v) => !v)}
                    title="EV Charger"
                    desc={`${CALC_CONFIG.ev.powerKw[evPower]} kW · ${evMount === 1 ? "Untethered" : "Tethered"}${evSmart ? " · smart" : ""}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* result panel */}
          <div className="flex flex-col border-t border-white/[0.2] bg-[#10251f]/95 p-6 backdrop-blur-xl sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="mb-[10px] font-mono text-[11.5px] uppercase tracking-label text-gold-light/90">
              {result.priceLabel}
            </div>
            <div className="mb-7 break-words font-display text-[36px] leading-[1.05] tracking-tightish text-gold-light sm:text-[42px] lg:text-[38px]">
              {result.price}
            </div>
            <div className="grid border-t border-white/[0.24]">
              {result.stats.map((st) => (
                <div
                  key={st.label}
                  className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start gap-4 border-b border-white/[0.18] py-4"
                >
                  <span className="min-w-0 text-[14px] font-medium text-white/[0.88]">
                    {st.label}
                  </span>
                  <span className="min-w-0 break-words text-right text-[14.5px] font-bold text-white">
                    {st.value}
                  </span>
                </div>
              ))}
            </div>
            <p className="my-5 mb-6 text-[13px] leading-[1.6] text-white/[0.78]">
              {result.note}
            </p>
            <a
              href="#contact"
              onClick={handleContactClick}
              className="mt-auto block rounded-[12px] bg-gold p-4 text-center text-base font-semibold text-primary shadow-[0_18px_34px_-26px_rgba(213,176,68,0.95)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
            >
              {result.cta}
            </a>
          </div>
        </div>
        <p className="mt-[22px] text-center text-[13px] leading-[1.6] text-white/[0.76]">
          Estimates are indicative and for guidance only. Your final quote
          follows a free site survey.
        </p>
      </div>
    </section>
  );
}
