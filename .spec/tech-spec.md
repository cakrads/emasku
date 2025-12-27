# Gold Portfolio Tracker – Technical Spec

## 1. Stack Architecture

- **Framework**: Next.js (Latest stable, 15+)
- **State Management**: TanStack Query (React Query)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 2. Engineering Principles

- **Clean Architecture**: Strict separation of concerns (Domain, Application, Delivery, Infrastructure).
- **Domain Purity**: Domain logic must NOT import HTTP objects, frameworks, or external libraries except `decimal.js`.
- **Kebab-case Files**: All source files must use lowercase with dashes (e.g., `add-holding.ts`, `react-query-provider.tsx`, `prisma-client.ts`).
- **Spec-driven development**: Always reference `spec.md` and `tech-spec.md`.
- **Immutable financial records**: `GoldPriceSnapshot` records are never modified.
- **Single source of truth**: All valuation must use the latest `GoldPriceSnapshot`.
- **Readability over cleverness**: Keep code maintainable and clear.

## 3. Financial Precision Rules
>
> [!IMPORTANT]
> To prevent floating-point errors (e.g., 0.1 + 0.2 = 0.30000000000000004), the following rules apply:
>
> - **Database**: All weights and prices must use `Decimal(20, 2)` or appropriate precision in PostgreSQL.
> - **ORM**: Use Prisma's `Decimal` type.
> - **Logic**: Use `decimal.js` for all arithmetic operations in both frontend and backend.
> - No native JavaScript `number` type for financial calculations.

## 4. Data Acquisition Strategy

### 4.1 Live Price Scraper

- **Target**: `https://galeri24.co.id/harga-emas`
- **Method**: Extract `__NUXT_DATA__` script tag from the HTML.
- **Frequency**: Scheduled cron job.

### 4.2 Historical Initial Seeding

- **Target**: `5-years-gold-price.json` (Manually provided by user).
- **Method**: A seeding script (e.g., `prisma/seed-historical.ts`) reads the JSON and inserts into `GoldPriceSnapshot`.
- **Format**: `[[timestamp, price], ...]` where timestamp is in milliseconds.
- **Purpose**: One-time seed of historical price snapshots.

## 5. UI/UX Rules

- **Framework**: Tailwind CSS.
- **Client State**: TanStack Query for asynchronous data fetching and caching.
- **Responsiveness**: Mobile-first design.
- **Theme**: Premium aesthetics (to be refined later).

## 6. Data Models (Prisma)

- **GoldAsset**: `id`, `brand`, `weight` (Decimal), `buyPricePerGram` (Decimal), `buyDate` (DateTime).
- **GoldPriceSnapshot**: `id`, `pricePerGram` (Decimal), `recordedAt` (DateTime), `source` (String).
