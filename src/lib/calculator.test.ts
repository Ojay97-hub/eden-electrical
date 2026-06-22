/**
 * Lightweight assertions for the calculator formulas — run with `npm run test:calc`.
 * Verifies the worked examples implied by the README defaults.
 */
import assert from "node:assert";
import { solar, battery, ev, bundle, fmt, r50, range } from "./calculator";

// helpers
assert.equal(fmt(1234.4), "£1,234");
assert.equal(r50(1234), 1250);
assert.equal(range(1000, 2000), "£1,000 – £2,000");

// Solar: default 3-bed (kwp 4), South (1.0), bill £1400
{
  const r = solar({ beds: 1, orient: 0, bill: 1400 });
  assert.equal(r.price, range(4 * 1500, 4 * 1900)); // £6,000 – £7,600
  // gen = round(4*950*1.0) = 3800; save = min(round(3800*0.22)=836, round(1400*0.9)=1260) = 836
  assert.equal(r.stats[1].value, "3,800 kWh");
  assert.equal(r.stats[2].value, "£836 / yr");
  assert.equal(r.stats[0].value, "4 kWp · ~9 panels");
}

// Solar saving capped at 90% of a small bill
{
  const r = solar({ beds: 3, orient: 0, bill: 500 }); // kwp 6.5, gen big
  assert.equal(r.stats[2].value, `${fmt(Math.round(500 * 0.9))} / yr`); // £450 / yr
}

// Battery: 10 kWh paired with solar
{
  const r = battery({ cap: 10, hasSolar: true });
  assert.equal(r.price, range(7500, 9500));
  assert.equal(r.stats[2].value, "£700 / yr"); // 10 * 70
}

// EV: 7kW tethered, smart on, no long run → 899 + 170 = 1069 → r50 = 1050
{
  const r = ev({ power: 0, mount: 0, smart: true, longRun: false });
  assert.equal(r.price, fmt(r50(1069)));
  assert.equal(r.stats[0].value, "7 kW · Tethered");
}

// Default per-tab inputs the bundle prices against.
const solarInput = { beds: 1, orient: 0, bill: 1400 }; // 4 kWp, South
const batteryInput = { cap: 10, hasSolar: true };
const evInput = { power: 0, mount: 0, smart: true, longRun: false };

// Bundle: solar + battery (2 selected → 8% off), pricing the configured tabs
{
  const r = bundle({
    solar: true,
    battery: true,
    ev: false,
    solarInput,
    batteryInput,
    evInput,
  });
  const lo = 4 * 1500 + 10 * 750; // 13500
  const hi = 4 * 1900 + 10 * 950; // 17100
  assert.equal(r.priceLabel, "Bundle price (−8%)");
  assert.equal(r.price, range(lo * 0.92, hi * 0.92));
  const save = Math.round(4 * 950 * 0.22) + 700; // 836 + 700 = 1536
  assert.equal(r.stats[2].value, `${fmt(save)} / yr`);
}

// Bundle reflects a changed solar config (5+ bed → 6.5 kWp)
{
  const r = bundle({
    solar: true,
    battery: false,
    ev: true,
    solarInput: { beds: 3, orient: 0, bill: 4000 },
    batteryInput,
    evInput,
  });
  assert.equal(r.stats[0].value, "6.5 kWp Solar + 7 kW EV Charger");
}

// Bundle: nothing selected
{
  const r = bundle({
    solar: false,
    battery: false,
    ev: false,
    solarInput,
    batteryInput,
    evInput,
  });
  assert.equal(r.price, "—");
  assert.equal(r.priceLabel, "Estimated total");
}

console.log("✓ calculator.test.ts — all assertions passed");
