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
- Prepare the system for future features (targets, allocation “pockets”)

---

## 🧭 Architecture Overview

The system follows a **Module-Based Clean Architecture** inside a Next.js monolith. The codebase is divided into **three strict pillars**:

**Routing (Next.js) → Frontend (React) → Backend Core (Application Modules)**

### 🔒 Architecture Rules (Non-Negotiable)

These rules are enforced by structure and convention:

- **Strict Isolation**: `frontend/` MUST NOT import from `applications/`, and vice-versa.
- **Routing Only**: `app/` is for routing/controllers only (minimal logic, < 10 LOC).
- **Pure Domain**: `domain/` layers contains no framework, HTTP, or database code.
- **API Boundary**: `services/` are the ONLY place the frontend can call APIs.
- **Financial Precision**: All math MUST use `decimal.js` inside the domain.

---

## 🏗️ High-Level Folder Structure

```text
/emasku
├── .docs/                         # Project Documentation
│   ├── api-contract.md            # API Specification
│   ├── frontend-guidelines.md     # UI & Component Rules
│   └── ...
├── prisma/
│   ├── data                       # Initial Data (JSON)
│   ├── migrations/                # DB Migrations
│   ├── seed.ts                    # Seeding logic
│   └── schema.prisma              # DB Source of Truth
├── src/
│   ├── app/                       # Pillar 1: Routing ONLY (Next.js App Router)
│   │   ├── api/v1/                # Versioned API Routes (prices, portfolio, auth)
│   │   └── (dashboard)/           # UI Page Routes
│   ├── frontend/                  # Pillar 2: Frontend Implementation
│   │   ├── components/            # React Components
│   │   │   ├── ui/                # Shadcn UI Fundamentals
│   │   │   ├── fragments/         # Business-aware Fragments
│   │   │   └── layout/            # Page Layouts
│   │   ├── features/              # Feature Modules (dashboard, prices-history, etc)
│   │   ├── hooks/                 # Custom React Hooks (useUrlFilters, etc)
│   │   ├── items/                 # Theme & Visual Styles
│   │   ├── lib/                   # Frontend Utilities
│   │   ├── services/              # API Client Layers
│   │   └── view-model/            # Presentation Logic
│   ├── applications/              # Pillar 3: Backend Core Modules
│   │   ├── modules/               # Domain Modules (prices, portfolio, auth)
│   │   └── shared/                # Backend Shared Logic
│   ├── i18n/                      # Localization (ID/EN)
│   ├── lib/                       # Global Shared Libs
│   ├── middleware.ts              # Route Protection & Localization
│   └── shared/                    # Shared Infrastructure (DB, Logger)
├── public/
├── .env.example
├── README.md
├── package.json
└── tsconfig.json

```

---

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL (Supabase) + Prisma ORM
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

| Layer      | Responsibility                                          |
| ---------- | ------------------------------------------------------- |
| **domain** | Pure business rules, entities, and interface contracts. |
| **usecase**| Executes a specific business action (Orchestration).    |
| **http**   | Translates HTTP/Requests into Use Case inputs.         |

---

## 🔁 Data Flow Example: Dashboard Load

1. **User Request**: Browser hits `/dashboard`.
2. **Routing**: `app/(dashboard)/page.tsx` renders `DashboardView`.
3. **Frontend View**: `DashboardView` (frontend/features) uses a custom hook.
4. **API Service**: Hook calls `portfolio.api.ts` (frontend/services).
5. **Controller**: Hits `/api/v1/portfolio` -> `applications/modules/portfolio/v1/http/controller.ts`.
6. **Use Case**: Controller calls `getPortfolio.ts` (applications/modules/portfolio/v1/usecase).
7. **Entity**: Use Case uses `entity.ts` (applications/modules/portfolio/v1/domain) for calculations.
8. **Persistence**: Use Case saves/loads via `prismaPortfolioRepository.ts` (shared/persistence).

---

## 🛠 Developer Setup

- **Prerequisites**: Node.js 20+, Supabase.
- **Install**: `npm install`
- **Prisma**: `npx prisma generate`

---

## 📄 Documentation

- [Functional Spec](.spec/spec.md)
- [Technical Spec](.spec/tech-spec.md)
- [Frontend Guidelines](.docs/frontend-guidelines.md)
- [UI Architecture manifest](.docs/ui-structure-manifest.md)
- [Scraper Implementation Guide](.docs/scraper-guide.md)
- [Database Setup](.docs/database-setup.md)
