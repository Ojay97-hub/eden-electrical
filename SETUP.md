# Eden Electrical — build

Production implementation of the [handoff design](./README.md): a Next.js
marketing site, a wired pricing calculator, and an authenticated, DB-backed
content editor.

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript**
- **Tailwind CSS** with brand tokens in [`tailwind.config.ts`](./tailwind.config.ts)
- **Prisma + SQLite** for the CMS content store and users (swap the datasource
  to Postgres/Supabase/Neon for production — models are portable)
- **Auth.js / NextAuth v5** credentials auth, guarding `/admin`
- Fonts: IvyJournal (local, licensed), Hanken Grotesk + JetBrains Mono (Google,
  via `next/font`)

## Getting started

```bash
npm install            # also runs `prisma generate` (postinstall)
npm run db:push        # create the SQLite schema (prisma/dev.db)
npm run db:seed        # seed admin user + content defaults
npm run dev            # http://localhost:3000
```

Demo login (seeded): **phil@edenelectrical.co.uk** / **password**
(`prisma/seed.ts`; override with `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Routes

| Route   | What it is                                                        |
| ------- | ---------------------------------------------------------------- |
| `/`     | Public single-page site. Hero/About/Contact copy read from CMS.  |
| `/login`| Client login (real credentials auth; no prefilled secrets).      |
| `/admin`| Content editor. Middleware-guarded; redirects to `/login`.       |
| `/api/contact` | Validated contact handler (logs in dev; Resend if configured). |

## Where things live

- **Calculator logic** — [`src/lib/calculator.ts`](./src/lib/calculator.ts).
  Pure, config-driven (`CALC_CONFIG` exposes every £/kWp, yield, tariff and
  discount constant so the client can tune them). Tested in
  `src/lib/calculator.test.ts` — `npm run test:calc`.
- **Calculator UI** — `src/components/site/Calculator.tsx` (4 tabs, shared
  result panel, live recompute).
- **Editable content** — defaults + read/write in
  [`src/lib/content.ts`](./src/lib/content.ts); the public site falls back to
  defaults when the DB is empty. Hero, About and Contact are wired to the
  editor; extend `CONTENT_DEFAULTS` + the schema in `AdminEditor.tsx` to add
  Services/Testimonials fields.
- **Auth** — `src/auth.ts` (Credentials + bcrypt), `src/auth.config.ts`
  (edge-safe), `src/middleware.ts` (route guard).

## Environment

See [`.env`](./.env). Set a strong `AUTH_SECRET` and a Postgres `DATABASE_URL`
for production; add `RESEND_API_KEY` to actually send contact emails (otherwise
enquiries are logged server-side).

## Notes / parity with the handoff

- Pixel-level styling (colours, spacing, radii, shadows, type scale) ported from
  the prototype into Tailwind tokens.
- Responsive: 2-column grids collapse to single column and the calculator card
  stacks under the `lg`/`md` breakpoints (handoff "Notes for production").
- The accreditation strip is toggleable via `SHOW_ACCREDITATIONS` in
  `src/app/page.tsx`.
- Placeholder content (phone/email/coverage, accreditation names, calculator
  constants) is exactly as flagged in the handoff — confirm with the client
  before launch.
