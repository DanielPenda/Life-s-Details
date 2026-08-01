# Life's Details

Mobile-first conversion website for Life's Details, a mobile car-detailing business serving Aalter, Belgium, and nearby areas.

## Current Phase

Phase 3 - Admin Booking Management.

The website accepts structured booking requests and now gives the single owner a protected, mobile-first booking desk for scheduling, lifecycle updates, payment records, internal notes and audited changes.

Customer accounts, online payments, live availability, teams and marketing automation remain intentionally out of scope. Every request still requires manual owner confirmation.

## Local Setup

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local`, then configure a PostgreSQL database:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/lifes_details?sslmode=require
EMAIL_PROVIDER=log
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
ADMIN_EMAIL=owner@example.com
```

Prepare the database:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Create exactly one matching user in Supabase Auth, then run `pnpm db:deploy` during deployment. Set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and a verified `EMAIL_FROM` value when real email delivery is required. The default `log` provider records only recipient and subject metadata.

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Phase 3 Administration

- Auth boundary: `src/lib/admin-auth.ts`
- Admin validation and time conversion: `src/lib/admin-booking.ts`
- Dashboard and filters: `src/app/admin/page.tsx`
- Booking lifecycle actions: `src/app/admin/actions.ts`
- Detail workflow: `src/app/admin/bookings/[reference]/page.tsx`
- Weekly schedule: `src/app/admin/calendar/page.tsx`
- Schema and audit migration: `prisma/schema.prisma` and `prisma/migrations/`

The current package prices, add-on prices, 20 km service radius, payment methods, retention period, social links, and legal-business details must be confirmed by the owner before public launch.

The before/after module uses clearly labelled demonstration imagery. Replace it with consented photographs from a genuine Life's Details job before presenting the section as customer proof.

## Analytics

Phase 1 emits first-party browser events through `lifesdetails:analytics` and logs them in development. No paid platform, tracking cookie, or personal data collection is included.

Tracked events:

- `hero_booking_click`
- `service_card_click`
- `whatsapp_click`
- `contact_click`
- `before_after_interaction`
- `booking_page_visit`

## Routes

- `/`
- `/services`
- `/book`
- `/contact`
- `/privacy`
- `/terms`

All `/admin` data pages and mutations verify the Supabase session and the configured single owner email on the server. Search engines are blocked from the admin area by metadata and `robots.txt`.
