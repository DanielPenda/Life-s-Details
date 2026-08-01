# Life's Details

Mobile-first conversion website for Life's Details, a mobile car-detailing business serving Aalter, Belgium, and nearby areas.

## Current Phase

Phase 2 - Simple Booking Request.

The website now accepts structured six-step booking requests, stores them in PostgreSQL, records initial status history, limits accidental duplicate submissions, and sends owner/customer notifications through a replaceable email adapter.

Customer accounts, admin management, payments, live availability, and marketing automation remain intentionally out of scope. Every request requires manual owner confirmation.

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
```

Prepare the database:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

For production, run `pnpm db:deploy` during deployment. Set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and a verified `EMAIL_FROM` value when real email delivery is required. The default `log` provider records only recipient and subject metadata during development.

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Phase 2 Booking

- Schema and migration: `prisma/schema.prisma` and `prisma/migrations/`
- Service and add-on seed data: `prisma/seed.mjs`
- Shared validation: `src/lib/booking-schema.ts`
- Booking form: `src/app/book/booking-form.tsx`
- Persistence action: `src/app/book/actions.ts`
- Email provider abstraction: `src/lib/email.ts`

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

The `/admin` placeholder remains reserved for Phase 3 and contains no management functionality. Booking records are managed through the database provider until the admin phase is justified.
