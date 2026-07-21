# Life's Details

Mobile-first web app foundation for Life's Details, a car-detailing business in Aalter, Belgium.

## Current Phase

Phase 0 - Product Foundation.

This phase establishes the application shell and local typed configuration. It does not include database-backed booking, authentication, payments, or admin workflows.

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

## Routes

- `/`
- `/services`
- `/book`
- `/contact`
- `/privacy`
- `/terms`
- `/admin`

## Business Contact

Contact data lives in `src/config/business.ts` and currently includes:

- Phone and WhatsApp: `+32 491 64 57 00`
- Email: `info.lifesdetails@gmail.com`
