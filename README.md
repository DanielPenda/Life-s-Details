# Life's Details

Mobile-first conversion website for Life's Details, a mobile car-detailing business serving Aalter, Belgium, and nearby areas.

## Current Phase

Phase 1 - Conversion Landing Page.

The website now explains the offer, compares three configurable service packages, demonstrates before/after interaction, answers common questions, describes the service area, and sends visitors into direct booking enquiries.

Database-backed booking, customer accounts, admin workflows, payments, and marketing automation remain intentionally out of scope.

## Local Setup

```bash
pnpm install
pnpm dev
```

Create `.env.local` if the site URL differs from local development:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Phase 1 Content

- Business and contact details: `src/config/business.ts`
- Announcement, FAQs, service radius, social links, and legal placeholder: `src/config/content.ts`
- Packages, inclusions, durations, and starting-price labels: `src/config/services.ts`
- Analytics event names and development logger: `src/lib/analytics.ts`

The current package prices, 20 km service radius, payment FAQ, social links, and legal-business details must be confirmed by the owner before public launch.

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

The `/admin` placeholder remains reserved for a later phase and contains no management functionality.
