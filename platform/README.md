# RRPL Platform

This is the production app behind RRPL's shipper tools: LR tracking, the book-by clock, the e-way bill check, the hazardous pre-check, pickup and quote requests, the 3D load planner, route and monsoon alerts, problem reports and the Ask RRPL chatbot.
It also includes an admin panel where RRPL staff keep all of this up to date without a developer.

| Layer | Choice | Why |
|---|---|---|
| Web app | **Next.js 15** (App Router, React 19, TypeScript) | Fast on phones, SEO, one codebase for the site and its API |
| CMS and admin | **Payload 3** (runs inside the same Next.js app) | Staff edit branches, cut-offs, alerts and the hazmat list at `/admin` |
| Database | **PostgreSQL 16** | Managed options in Mumbai (AWS RDS, Supabase, Neon) |
| Files | Local disk, or **S3-compatible** storage (`ap-south-1`) | Complaint photos stay private; news images are public |
| Languages | **next-intl**: EN, मराठी, ગુજરાતી, हिन्दी, कोंकणी | URLs like `/mr/track` |
| 3D | **react-three-fiber** (three.js) | Load planner |
| Messaging | **WhatsApp Business** (Meta Cloud API) | Alerts the ops desk and confirms to customers |
| Chatbot | **Claude API** | Answers only from CMS data, in the customer's language |

## What's in here

```
src/
  app/(site)/[locale]/     shipper pages: /, /track, /book-by, /e-way-bill, /hazardous,
                           /pickup, /load-planner, /branches, /updates, /report
  app/(payload)/           admin panel at /admin and Payload's REST API at /api/<collection>
  app/api/public/          public API used by these pages and by the one-page website:
                           track, enquiries, complaints, updates, chat
  collections/             CMS data model and who may read or edit each part
  globals/SiteSettings.ts  phone, WhatsApp, e-way bill limits, refused hazard classes, chatbot
  lib/                     business logic: ewaybill, bookby, pack, hazmat, tracking adapters,
                           whatsapp, rate limiting and CORS
  components/              forms, clock, planner, chat widget
messages/                  translations (en complete; others cover navigation, the rest falls back to English)
scripts/seed.ts            first-run data (32 branches from rajeshrpl.in, plus starter lanes, trucks and hazmat list)
tests/                     unit tests for the business rules
```

## Staff roles (admin at `/admin`)

| Role | Can do |
|---|---|
| Admin | Everything, including users and site settings |
| Editor | Branches, lanes and cut-offs, trucks, hazardous goods, news and alerts |
| Operations | Work quote and pickup requests and problem reports: assign, set status, add notes |

**Keeping the site current.** To post a monsoon or ghat alert, go to Updates and alerts → New. Pick the kind and severity, write a one-line summary and set an end time; the alert disappears on its own when it ends.
It appears straight away in four places: the shipper desk, `/updates`, the one-page website's News section and the chatbot's knowledge.

## Run it locally

```bash
cp .env.example .env               # set PAYLOAD_SECRET (openssl rand -hex 32), SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD
npm install
npm run docker:db                  # Postgres in Docker (or point DATABASE_URL at your own)
npm run dev                        # http://localhost:3000, admin at /admin
npm run seed                       # in a second terminal, once the dev server has created the tables
npm test                           # business-rule tests
```

For local tracking without RRPL's LR system, set `TRACKING_PROVIDER=mock` and try LR `245831`.

## Deploy (Mumbai region)

**Option A: one server with Docker.** This is the simplest; an AWS Lightsail or EC2 instance in `ap-south-1` with 2 vCPU and 4 GB is enough to start.

```bash
docker compose --profile full up -d --build
```

Put Caddy or nginx in front for HTTPS on `app.rajeshrpl.in`. Use RDS Postgres instead of the bundled `db` service once you have real data, and turn on daily snapshots.

**Option B: managed.** Run the app on Vercel and the database on Neon or Supabase, both in the Mumbai region, with files on S3 (`ap-south-1`).

For production in either case:

1. Set `NODE_ENV=production`. Schema changes then go through migrations: `npm run migrate:create` locally, commit the migration, then `npm run migrate` on deploy.
2. Set `ALLOWED_ORIGINS=https://rajeshrpl.in,https://www.rajeshrpl.in` so the one-page website can call the API.
3. In `website/assets/config.js`, point `trackingEndpoint`, `enquiryEndpoint` and `updatesEndpoint` at `https://app.rajeshrpl.in/api/public/...`.
4. Optional: add Sentry for error alerts and Cloudflare Turnstile (`TURNSTILE_*`) if forms attract spam. A honeypot field is already in place.

## Needs input from RRPL before launch

| Item | Where | Status |
|---|---|---|
| **LR system access.** The URL, auth and field names of the system behind today's `rajeshrpl.in/tracking` lookup | `TRACKING_URL`, `TRACKING_FIELD_MAP`; see `src/lib/tracking/http.ts` | **Blocking for tracking.** Ask Felnix or the LR software vendor. The current page already shows the same 10 fields this adapter expects. |
| Cut-off times and transit days for each lane | Admin → Lanes | Seeded as *unverified* starting points; tick "verified" after operations checks them |
| Truck body sizes and payloads | Admin → Trucks | Seeded with typical market sizes for the listed fleet types |
| Hazardous goods accept/refuse list | Admin → Hazardous goods | Seeded with 16 common chemicals as placeholders; the hazmat desk must confirm |
| WhatsApp Business number and two approved templates | `.env` + Meta Business Manager | Templates are described in `src/lib/whatsapp.ts` |
| Claude API key | `.env` (`ANTHROPIC_API_KEY`) | Without it the chat button answers "not available" |
| Translations | `messages/*.json` | A native speaker should check them, especially Konkani |
| Branch codes on LRs | Admin → Branches → Branch code | Lets the tracking form validate codes |

## Security and data

- Public forms go only through `/api/public/*`. These routes validate with zod, rate-limit by IP and include a honeypot. Payload's own REST API refuses public writes to enquiries and complaints.
- Complaint photos live in a staff-only collection. Uploads are limited to images and PDF, 8 MB each, 5 per report.
- Admin logins lock for 15 minutes after 5 failures, and sessions last 8 hours. Security headers are set in `next.config.mjs`.
- Customer data stays in India if you deploy to `ap-south-1`. Under the DPDP Act, add a privacy notice to the forms, and keep personal data only as long as it is needed.
- The in-memory rate limiter fits a single server. For several servers, back it with Redis (`src/lib/http.ts`).

## Testing status

- `npm test` runs 22 unit tests covering the e-way bill rules, the IST book-by clock (cut-off roll-over, Sundays, door-step days), the load packer (no overlaps, weight limits, stacking, oversize items) and the hazmat lookup. **All pass.**
- The rest of the code (pages, CMS config, API routes, components) is written against the Payload 3, Next.js 15, next-intl 4 and react-three-fiber 9 APIs. It was **not compiled** in the environment where it was written, because packages could not be installed there.
- Expect the first `npm install && npm run generate:types && npm run typecheck && npm run build` to turn up a few version-specific type fixes. CI (`.github/workflows/ci.yml`) runs these same steps on every push.
