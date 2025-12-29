# Gold Portfolio Tracker – Technical Spec

> **Version Philosophy**: Always use the latest **stable** release of each technology. This spec documents explicit versions to ensure consistency and reliability.

## 1. Stack Architecture (Versions as of Dec 2025)

| Technology         | Version       | Notes                                      |
| ------------------ | ------------- | ------------------------------------------ |
| **Next.js**        | `16.x`        | Latest stable, App Router                  |
| **React**          | `19.x`        | Latest stable                              |
| **TypeScript**     | `5.x`         | Latest stable                              |
| **Prisma**         | `7.x`         | Latest stable (Nov 2025), TypeScript-based |
| **PostgreSQL**     | `16+`         | Via Supabase                               |
| **TanStack Query** | `5.x`         | Async state management                     |
| **Tailwind CSS**   | `4.x`         | Latest stable                              |
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
- **Single source of truth**: All valuation must use the latest price record.
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

### 4.1 Schema File (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // NOTE: url removed in Prisma 7
}
```

### 4.2 Config File (`prisma.config.ts`)

```typescript
import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),

  migrate: {
    async url() {
      return process.env.DATABASE_URL!
    },
  },
})
```

### 4.3 Client Instantiation

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
```

## 5. Data Acquisition Strategy

### 5.1 Live Price Scraper

- **Target**: `https://galeri24.co.id/harga-emas`
- **Method**: Extract `__NUXT_DATA__` script tag from the HTML.
- **Frequency**: Scheduled cron job.

### 5.2 Historical Initial Seeding

- **Target**: `5-years-gold-price.json`
- **Method**: Seeding script reads JSON and inserts into `GoldPrice`.
- **Format**: `[[timestamp, price], ...]` where timestamp is in milliseconds.

## 6. UI/UX Rules

- **Framework**: Tailwind CSS v4.
- **Client State**: TanStack Query for async data fetching and caching.
- **Responsiveness**: Mobile-first design.
- **Theme**: Premium aesthetics.

## 7. Data Models (Prisma)

See [`prisma/schema.prisma`](file:///c:/Project/emasku/prisma/schema.prisma) for current models.
