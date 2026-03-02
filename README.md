# Gold Portfolio Tracker (Emasku)

A professional-grade web application for tracking gold ownership, portfolio value, and performance over time.

This project is intentionally designed with **Clean Architecture**, **strict boundaries**, and **long-term scalability** in mind.  
It is not a tutorial project — it is a **serious engineering portfolio**.

---

## 🎯 Project Goals

- Allow users to record gold holdings (weight, brand, buy price, date)
- Show current value based on latest gold prices
- Display profit/loss (absolute & percentage)
- Track historical prices and visualize trends
- Allocate holdings to savings goals ("pockets")
- Simulate buyback scenarios

---

## 🧭 Architecture Overview

The system follows a **Module-Based Clean Architecture** inside a Next.js monolith. The codebase is divided into **three strict pillars**:

### Routing (Next.js) → Frontend (React) → Backend Core (Application Modules)

### 🔒 Architecture Rules (Non-Negotiable)

These rules are enforced by structure and convention:

- **Strict Isolation**: `frontend/` MUST NOT import from `applications/`, and vice-versa.
- **Shared Contracts**: Both pillars import types from `src/shared/contracts/` — neither imports from the other.
- **Routing Only**: `app/` is for routing/controllers only (minimal logic, < 10 LOC).
- **Pure Domain**: `domain/` layers contain no framework, HTTP, or database code.
- **API Boundary**: `services/` are the ONLY place the frontend can call APIs.
- **Financial Precision**: All math MUST use `decimal.js` inside the domain.

---

## 🏗️ High-Level Folder Structure

```text
/emasku
├── .docs/                         # Project Documentation
│   ├── .backend/                  # Backend docs (API contract, DB setup)
│   ├── .frontend/                 # Frontend docs (guidelines, UI manifest)
│   └── ...
├── .spec/                         # Functional & Technical Specs
│   ├── spec.md                    # Functional Spec
│   └── tech-spec.md               # Technical Spec
├── prisma/
│   ├── data/                      # Initial Data (JSON)
│   ├── migrations/                # DB Migrations
│   ├── seed.ts                    # Seeding logic
│   └── schema.prisma              # DB Source of Truth
├── src/
│   ├── app/                       # Pillar 1: Routing ONLY (Next.js App Router)
│   │   ├── api/v1/                # Versioned API Routes
│   │   ├── (admin)/               # Admin Routes (Dashboard, Holdings, Goals)
│   │   ├── (public)/              # Public Routes (Prices, Privacy, Landing)
│   │   └── (auth)/                # Auth Routes (Login)
│   ├── frontend/                  # Pillar 2: Frontend Implementation
│   │   ├── components/            # React Components
│   │   │   ├── ui/                # Pure UI Primitives (31 components)
│   │   │   ├── fragments/         # Business Fragments
│   │   │   │   ├── admin/         # Admin Fragments (Navbar, StepHeader, etc.)
│   │   │   │   └── public/        # Public Fragments (SimpleFooter)
│   │   │   └── layout/            # Page Layouts (StandardPageLayout, SharedNavbar)
│   │   ├── features/              # Feature Modules
│   │   │   ├── admin/             # Admin Features (dashboard, holdings, goals, etc.)
│   │   │   └── public/            # Public Features (login, prices, landing, privacy)
│   │   ├── hooks/                 # Custom React Hooks
│   │   ├── services/              # API Client Layers
│   │   ├── view-model/            # Presentation Logic
│   │   ├── utils/                 # Frontend Utilities (api-client, formatting)
│   │   ├── context/               # React Contexts (language)
│   │   ├── providers/             # App-wide Providers (auth, react-query, theme)
│   │   ├── config/                # Frontend Config (routes)
│   │   └── data/                  # Static/Reference Data
│   ├── applications/              # Pillar 3: Backend Core Modules
│   │   ├── modules/               # Domain Modules (brands, goals, portfolio, prices)
│   │   └── shared/                # Backend Shared Logic (auth, persistence, scrapers)
│   ├── shared/                    # Shared Contracts (DTOs between pillars)
│   │   └── contracts/             # Type-only interfaces for frontend ↔ backend
│   ├── i18n/                      # Localization (ID/EN)
│   ├── lib/                       # Global Shared Libs
│   └── middleware.ts              # Route Protection & Localization
├── public/
├── .env.example
├── README.md
├── package.json
└── tsconfig.json
```

---

## 🛠 Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Database**: PostgreSQL (Supabase) + Prisma 7 ORM
- **Rate Limiting**: Upstash Redis (Serverless)
- **State Management**: TanStack Query (React Query) + Zustand
- **UI System**: Tailwind CSS v4 + Shadcn UI
- **Charting**: Recharts
- **Validation**: Zod
- **Icons**: Lucide React
- **Internationalization**: Custom i18n Dictionary
- **Math**: decimal.js (Financial precision)

---

## 🧠 Backend Responsibility

Inside `src/applications/modules/`, each feature follows a strict Clean Architecture pattern:

| Layer          | Responsibility                                          |
| :------------- | :------------------------------------------------------ |
| **domain**     | Pure business rules, entities, and interface contracts.  |
| **usecases**   | Executes a specific business action (Orchestration).    |
| **delivery/http** | Translates HTTP/Requests into Use Case inputs.       |

Shared persistence: `src/applications/shared/persistence/repositories/` (one Prisma repository per domain).

---

## 🔁 Data Flow

### Client-Side (default)

1. **User Request**: Browser hits `/dashboard`.
2. **Routing**: `app/(admin)/page.tsx` renders `DashboardView`.
3. **Frontend View**: `DashboardView` (frontend/features) uses a TanStack Query hook.
4. **API Service**: Hook calls `portfolio.api.ts` (frontend/services).
5. **Controller**: Hits `/api/v1/portfolio` → `applications/modules/portfolio/v1/delivery/http/controller.ts`.
6. **Use Case**: Controller calls use case (applications/modules/portfolio/v1/usecases).
7. **Entity**: Use Case uses domain entities for calculations.
8. **Persistence**: Use Case saves/loads via Prisma repository (shared/persistence).

### SSR (when SEO or instant render is needed)

`app/page.tsx` fetches data server-side → passes to frontend View as `initialData` for TanStack Query → hook hydrates from `initialData`, then revalidates client-side as normal.

---

## 🛠 Developer Setup

- **Prerequisites**: Node.js 20+, Supabase.
- **Install**: `npm install`
- **Prisma**: `npx prisma generate`

---

## 📈 Periodic Performance & Daily Closes

To ensure accurate PnL ("Today", "Weekly", "Monthly") without the overhead of scanning millions of intraday price points, the system implements a **Daily Close** architecture:

- **GoldDailyClose**: The system-authoritative "final truth" for each market day (Asia/Jakarta).
- **Rule of One**: Exactly one record per Brand + PriceType + Denomination per Day.
- **Carry-Forward**: If no market data is recorded on a specific day (e.g., Sunday), the system automatically carries forward the last known close.
- **Spot Canonical**: The `SELL` price type in the `GoldDailyClose` table serves as the canonical source for historical spot price visualization.

## 📄 Documentation

- [Functional Spec](.spec/spec.md)
- [Technical Spec](.spec/tech-spec.md)
- [Frontend Guidelines](.docs/.frontend/frontend-guidelines.md)
- [UI Architecture Manifest](.docs/.frontend/ui-structure-manifest.md)
- [Scraper Implementation Guide](.docs/scraper-guide.md)
- [Database Setup](.docs/.backend/database-setup.md)
- [API Contract](.docs/.backend/api-contract.md)
- [Production API Spec](.docs/.backend/production-api-spec.md)
