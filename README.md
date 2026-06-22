# Handoff: Eden Electrical website

## Overview
Marketing website + lightweight CMS for **Eden Electrical**, a Kent-based renewable-energy
installer (solar panels, battery storage, EV charging, and O&M for solar). The site is a
single scrolling public page plus a **multi-tab pricing calculator**, and a **client login +
content editor** so the owner can edit page content. The login/editor in the prototype is a
front-end mockup — the real build needs authentication and a database/CMS behind it.

## About the design files
The files in this bundle are **design references created in HTML** — a prototype showing the
intended look, layout, and behaviour. They are **not production code to copy directly**. The
task is to **recreate this design in a real codebase** using its established patterns and
libraries. If no codebase exists yet, a sensible stack is:

- **Next.js (App Router) + React + TypeScript**, styled with Tailwind or CSS modules
- **A database + CMS** for editable content — e.g. Postgres (Supabase/Neon) with a small
  admin, or a headless CMS (Sanity / Payload / Strapi). The "Content editor" screen maps
  directly onto CMS fields.
- **Auth** for the client login (NextAuth / Supabase Auth / Clerk)
- **A form/email handler** for the contact form (Resend / a serverless function)

`Eden Electrical (standalone preview).html` opens in any browser to view the design (no server
needed). `Eden Electrical.dc.html` is the editable source prototype but requires the original
authoring environment to run — use it for reference, not as a build target.

## Fidelity
**High-fidelity.** Final brand colours, typography, spacing, copy, and interactions are all
intentional. Recreate the UI closely, then wire up real data, auth, and the calculator logic.

---

## Brand / Design tokens

### Colours
| Token | Hex | Use |
|---|---|---|
| Primary Green | `#19372D` | Header, hero, dark sections, result panel, primary text on light |
| Deep Green | `#11261F` | Accreditation strip, footer |
| Panel Green (alt) | `#1F4035` / `#234539` | Placeholder stripe fills |
| Primary Gold | `#D5B044` | CTAs, accents, numerals, logo |
| Secondary/Light Gold | `#FCE893` | Text on green buttons, highlight headings on dark |
| Gold (text on light) | `#A8842A` | Eyebrow labels on cream backgrounds (darkened gold for contrast) |
| Cream / Paper | `#F6F3EC` | Page background, light sections |
| Off-white field | `#FBFAF6` | Input backgrounds |
| Ink | `#23211C` | Body text on light |
| Body muted | `#4A463D` | Paragraph text |
| Muted | `#6B665A` / `#8A8576` | Secondary/labels |
| Hairline | `rgba(25,55,45,0.10–0.18)` | Borders/dividers on light |

### Typography
- **Display / headings:** `IvyJournal SemiBold` (weight 600). Files provided in `/assets/fonts`.
  Used for H1/H2, service titles, testimonial quotes, big calculator price, logotype feel.
  Headings use `letter-spacing:-0.01em`.
- **Body / UI:** `Hanken Grotesk` (Google Fonts; 400/500/600/700).
- **Mono (labels, numerals, eyebrows):** `JetBrains Mono` (Google Fonts; 400/500), uppercase,
  `letter-spacing:0.12–0.14em`.
- Hero H1 ≈ 62px/1.05; Section H2 ≈ 44–46px/1.08; service titles ≈ 31px; body ≈ 17–19px/1.6.

### Spacing / shape
- Content max-width **1240px** (calculator section 1100px), horizontal padding **32px**.
- Section vertical padding **110–120px**.
- Radii: buttons/inputs **9–10px**, cards **16px**, large panels **18px**.
- Card shadow (light on cream): `0 30px 60px -30px rgba(25,55,45,0.3)`.
- Result/calculator card shadow (on green): `0 40px 80px -40px rgba(0,0,0,0.5)`.
- Sticky header height **78px**; sections use `scroll-margin-top:96px` for anchor offset.

---

## Screens / Views

### 1. Public site (single scrolling page)
Sticky header (green, blurred, gold hairline): logo left; nav links **About · Services · Cost
calculator · Testimonials · Contact**; gold **"Get a free quote"** button right. Nav links are
in-page anchors (`#about`, `#services`, `#calculator`, `#testimonials`, `#contact`) with smooth
scroll.

Section order:
1. **Hero** — green, radial gold glow top-right. Eyebrow pill ("Solar · Battery · EV — Kent &
   the South East"), H1 "Clean energy, expertly installed.", intro paragraph, two CTAs ("Try the
   cost calculator" → `#calculator`, "Get a free quote" → `#contact`), a 5-star trust row.
   Right column: image placeholder (1200×1040-ish), `border-radius:18px`.
2. **Accreditations strip** — deep green; label "Certified & accredited" + names: MCS Certified,
   NICEIC Approved, TrustMark, RECC, OZEV (set in IvyJournal). *Toggleable (see props).*
3. **About** — cream; left image placeholder, right: eyebrow "About us", H2 "Renewable energy,
   done properly.", two paragraphs (company + mission), 2×2 feature grid (Fully certified /
   Transparent pricing / Local to Kent / Aftercare included).
4. **Services** — white; **expandable accordion** of 4 services (see Interactions). Each row:
   2-digit gold number, IvyJournal title, mono tag, circular +/– toggle. Expanded body: blurb,
   checklist of 4 points, "Estimate the cost →" link to `#calculator`, image placeholder.
5. **Pricing calculator** — green; see dedicated section below.
6. **Testimonials** — cream; 3 cards (middle card inverted to green), 5 gold stars, IvyJournal
   quote, avatar initial + name + "Town · service".
7. **Contact** — white; left: heading + phone/email/coverage rows; right: form (name, phone,
   email, service `<select>`, message, submit "Request my free survey"). Submit shows a toast.
8. **Footer** — deep green; logo + blurb, Explore + Contact link columns, copyright, and a
   **"Client login"** button that opens the login view.

### 2. Client login
Full-screen green with radial glow. Centered white card (max-width 420px, radius 18px): logo
above, H1 "Client login", email + password fields (prefilled in the mock), Remember me +
Forgot password, green **"Sign in"** button. Below card: "← Back to website". Sign in → Admin.
**In production:** real auth; do not prefill credentials.

### 3. Content editor (admin)
Two-column app. Left **green sidebar**: logo, "Page sections" nav (Hero, About, Services,
Testimonials, Contact — active item highlighted gold), and at the bottom "View live site" +
"Log out". Right **main panel** (cream, scrollable): sticky sub-header ("CONTENT EDITOR /
Hero section", "All changes saved" status, gold **"Save changes"**). Body = stack of white
field cards: Headline (text), Intro paragraph (textarea), Hero image (drag-drop upload zone),
CTA buttons (two text inputs). Save → toast "Changes saved to the live site."
**In production:** each field card is a CMS field bound to the corresponding content record;
Save persists to the DB and the public site reads from it.

---

## Pricing calculator (the important logic)

Tabbed tool with 4 calculators sharing one result panel. Tabs: **Solar Panels · Battery Storage
· EV Charging · Bundle & Save**. Left column = inputs (segmented buttons, sliders, toggle pills);
right green panel = result (price label, big IvyJournal price, 4 stat rows, a note, a CTA).
All amounts formatted as GBP, no decimals; price ranges are rounded to the nearest £50.
**All figures are indicative estimates for guidance only** (state this in the UI).

Helpers: `fmt(n)= "£" + round(n).toLocaleString('en-GB')`; `r50(n)=round(n/50)*50`;
`range(lo,hi)=fmt(r50(lo)) + " – " + fmt(r50(hi))`.

### Solar tab
Inputs: **Property size** segmented → kWp map `['1–2 bed'→3, '3 bed'→4, '4 bed'→5, '5+ bed'→6.5]`
(default "3 bed"); **Roof orientation** segmented → factor `['South'→1.0, 'East/West'→0.85,
'North'→0.62]` (default South); **Average annual electricity bill** slider £400–£4000 step 50
(default £1400).
```
kwp     = bedMap[beds]
panels  = round(kwp / 0.43)                 // ~430 W panels
costLo  = kwp * 1500 ;  costHi = kwp * 1900
gen     = round(kwp * 950 * orientFactor)   // kWh/yr (Kent ~950 kWh/kWp)
save    = min( round(gen * 0.22), round(bill * 0.9) )   // £/yr, capped at 90% of bill
payback = ((kwp*1500 + kwp*1900)/2) / save  // years, 1 dp
```
Result: price = `range(kwp*1500, kwp*1900)`; stats = Recommended system (`{kwp} kWp · ~{panels}
panels`), Annual generation (`{gen} kWh`), Estimated saving (`{fmt(save)} / yr`), Indicative
payback (`{payback} years`). CTA "Book a free survey".

### Battery tab
Inputs: **Capacity** slider 5–20 kWh step 1 (default 10); **Pairing with solar?** toggle (default on).
```
costLo  = cap * 750 ;  costHi = cap * 950
save    = hasSolar ? cap * 70 : cap * 45    // £/yr
payback = ((costLo+costHi)/2) / save
```
Result: price = `range(costLo,costHi)`; stats = Usable capacity, Paired with solar (Yes/No),
Estimated saving `/yr`, Indicative payback.

### EV charging tab
Inputs: **Charger power** segmented `['7 kW'→base 899, '22 kW'→base 1499]` (default 7 kW);
**Cable type** segmented `['Tethered'→+0, 'Untethered'→+60]` (default Tethered);
toggles **Smart solar-aware charging** (+170, default on), **Extended cable run >10m** (+220, default off).
```
total = base + (untethered?60:0) + (smart?170:0) + (longRun?220:0)
```
Result: priceLabel "Fully installed from", price = `fmt(r50(total))`; stats = Charge point
(`{kW} kW · {Tethered|Untethered}`), Smart charging (Included/Not included), Cable run
(Standard <10m / Extended >10m), Install time ("Typically half a day"). CTA "Book my install".

### Bundle tab
Toggle pills: **Solar Panels** (4 kWp), **Battery Storage** (10 kWh), **EV Charger** (7 kW smart).
Defaults: Solar + Battery on, EV off.
```
per-item add to lo/hi/annualSave when selected:
  Solar:   lo+=4*1500, hi+=4*1900, save+=round(4*950*0.22)   // ≈ £836/yr
  Battery: lo+=10*750, hi+=10*950, save+=700
  EV:      lo+=899+170, hi+=899+170                            // no annual saving figure
nSel     = count selected
discount = nSel >= 2 ? 0.08 : 0
loD = lo*(1-discount) ; hiD = hi*(1-discount) ; saved = ((lo+hi)/2)*discount
payback  = save>0 ? ((loD+hiD)/2)/save : 0
```
Result: priceLabel shows "Bundle price (−8%)" when discounted else "Estimated total";
price = `range(loD,hiD)` (or "—" if nothing selected); stats = Included (joined with " + "),
You save (`fmt(saved)`), Annual saving (`/yr`), Indicative payback.

---

## Interactions & behaviour
- **Smooth-scroll anchor nav** (`html{scroll-behavior:smooth}`), header offset via
  `scroll-margin-top`.
- **Services accordion:** click a row toggles it open; opening one **closes the others**
  (single-open). Default: first service (Solar) open. +/– icon and a 0/auto height reveal.
- **Calculator:** active tab is highlighted (green pill); switching tabs swaps the input column
  and recomputes the shared result panel live. Segmented buttons set discrete values; sliders
  update on input; toggle pills flip booleans — all recompute instantly.
- **Toasts:** contact submit and admin save show a centered bottom toast for ~3.8s.
- **View switching (prototype only):** footer "Client login" → login; "Sign in" → admin;
  "View live site"/"Log out" → public site. In production these are real routes
  (`/`, `/login`, `/admin`) with auth guards.
- **Contact form** currently `preventDefault` + toast — wire to a real submit/email endpoint
  with validation (required name, valid email, one of phone/email).

## State (prototype)
`view` (site|login|admin), `openService` (index, -1 = all closed), `calcTab`
(solar|battery|ev|bundle), solar (`beds`, `orient`, `bill`), battery (`cap`, `hasSolar`),
ev (`power`, `mount`, `smart`, `longRun`), bundle (`solar`, `battery`, `ev` booleans),
`adminSection`, `toast`. In production: calculator state stays client-side; content/auth move
server-side.

## Assets
- `/assets/eden-logo-gold.png` — gold logotype on transparent (tightly cropped), used in nav,
  footer, login, admin sidebar. (Original full logos also in `/assets`: `logo-on-green.png`,
  `logo-16x9-transparent.png`.)
- `/assets/fonts/IvyJournal-SemiBold.woff2` + `.woff` — display font (licensed by the client).
- Hanken Grotesk + JetBrains Mono load from Google Fonts.
- All photography is **labelled placeholders** (striped fills with mono captions) — the client
  is supplying real photos: hero install shot, team/van, one per service, etc.

## Files in this bundle
- `Eden Electrical (standalone preview).html` — open in any browser to view the full design.
- `Eden Electrical.dc.html` — editable source prototype (needs original authoring runtime).
- `assets/` — logo variants + IvyJournal font files.

## Notes for production
- Phone `01892 000 000`, email `hello@edenelectrical.co.uk`, area "Kent & the South East",
  and the accreditation list are **placeholders** — confirm with the client before launch.
- Calculator constants (£/kWp, £/kWh, generation yield, tariff %, discount) are reasonable UK
  estimates — expose them as config so the client can tune them.
- Add responsive/mobile layouts: the prototype is desktop-first; collapse the 2-column grids to
  single column, turn the header nav into a menu, and stack the calculator card under ~900px.
