# Gold Portfolio Tracker – Technical Spec

> **Version Philosophy**: Always use the latest **stable** release of each technology. This spec documents explicit versions to ensure consistency and reliability.

## 1. Stack Architecture

| Technology         | Version       | Notes                                      |
| ------------------ | ------------- | ------------------------------------------ |
| **Next.js**        | `^16.1.6`     | App Router                                 |
| **React**          | `^19.2.3`     | Stable                                     |
| **TypeScript**     | `5.x`         | Stable                                     |
| **Prisma**         | `^7.4.0`      | TypeScript-based, adapter pattern           |
| **PostgreSQL**     | `16+`         | Via Supabase                               |
| **TanStack Query** | `^5.62.7`     | Async state management                     |
| **Zustand**        | `^5.0.9`      | Client UI state                            |
| **Tailwind CSS**   | `^4.1.18`     | v4 (CSS-first config)                      |
| **Node.js**        | `20.x LTS`    | Active LTS                                 |
| **Deployment**     | Vercel        | Edge-optimized                             |

> [!IMPORTANT]
> **Prisma 7 Breaking Changes**:
>
> - `url` property in `schema.prisma` is **deprecated**
> - Connection URLs go in `prisma.config.ts`
> - Runtime uses `adapter` or `accelerateUrl` in `PrismaClient` constructor
> - See: <https://pris.ly/d/prisma7-client-config>

## 2. Engineering Principles

- **Clean Architecture**: Strict separation of concerns (Domain, Application, Delivery, Infrastructure).
- **Domain Purity**: Domain logic must NOT import HTTP objects, frameworks, or external libraries except `decimal.js`.
- **Kebab-case Files**: All source files must use lowercase with dashes (e.g., `add-holding.ts`, `react-query-provider.tsx`).
- **Spec-driven development**: Always reference `spec.md` and `tech-spec.md`.
- **Immutable financial records**: Price records are never modified.
- **Single source of truth**: Real-time valuation uses the latest `GoldPrice` (BUYBACK), while periodic PnL (Daily, Weekly, Monthly) uses the authoritative `GoldDailyClose` table.
- **Readability over cleverness**: Keep code maintainable and clear.

## 3. Financial Precision Rules

> [!IMPORTANT]
> To prevent floating-point errors (e.g., 0.1 + 0.2 = 0.30000000000000004):
>
> - **Database**: Use `BigInt` for prices (to support large values > 2.1B), `Decimal` for weights.
> - **ORM**: Use Prisma's `Decimal` type for weights and `BigInt` for prices.
> - **Logic**: Use `decimal.js` for all arithmetic in both frontend and backend.
> - No native JavaScript `number` type for financial calculations.

## 4. API Design Rules

- **Derived Truth**: API returns the final computed truth, not raw tables. The backend owns the business logic.
- **Frontend Agnostic to Money**: Frontend never computes money or financial rules. It only displays formatted values from the API.
- **Single Responsibility Endpoints**: Each endpoint answers exactly one business question (e.g., `GET /portfolio/summary`, `GET /portfolio/performance`).
- **No Ambiguity Leakage**: The API resolves all market ambiguity (e.g., which price source to use) before responding. The frontend should never have to decide "which price is real".

## 5. Prisma 7 Configuration

### 5.1 Schema File (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // NOTE: url removed in Prisma 7
}
```

### 5.2 Config File (`prisma.config.ts`)

```typescript
import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: `tsx prisma/seed.ts`,
  },
  datasource: {
    url: env('DIRECT_URL'),
  },
})
```

### 5.3 Client Instantiation

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
```

## 6. Data Acquisition Strategy

### 5.1 Live Price Scraper

- **Target**: `https://galeri24.co.id/harga-emas`
- **Method**: Extract `__NUXT_DATA__` script tag from the HTML.
- **Frequency**: Scheduled cron job.

### 5.2 Historical & Daily Close Aggregation

- **GoldDailyClose**: A system-managed table that stores the "final truth" for each market day.
- **Rules**:
  - One record per Brand + PriceType + Gram + Date.
  - Derived from the latest `GoldPrice` intraday record for that day (WIB).
  - **Carry-Forward**: If no prices are recorded on a specific day (e.g., Sunday), the system carries forward the last known close.
- **Purpose**: Powering the "Today", "Weekly", and "Monthly" PnL metrics without scanning millions of intraday points.
- **Valuation Strategy**: All historical charts and periodic differences use `PriceType.SELL` from this table as the canonical spot price proxy.

## 7. UI/UX Rules

- **Framework**: Tailwind CSS v4.
- **Server State**: TanStack Query for async data fetching and caching.
- **Client UI State**: Zustand for modals, filters, and local preferences.
- **Responsiveness**: Mobile-first design.
- **Theme**: Premium aesthetics.

## 8. Data Models (Prisma)

See `prisma/schema.prisma` for current models.
