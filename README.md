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
├── .spec/                         # Functional & Technical Truths
│   ├── spec.md                    # Functional requirements
│   └── tech-spec.md               # Technical manual
├── prisma/
│   ├── data                       # Initial Data (JSON)
│   ├── migrations/                # DB Migrations
│   ├── seed.ts                    # Seeding logic
│   └── schema.prisma              # DB Source of Truth
├── src/
│   ├── app/                       # Pillar 1: Routing ONLY (Thin)
│   │   ├── api/v1/                # Versioned API controllers
│   │   └── (dashboard)/           # UI Route Groups
│   ├── frontend/                  # Pillar 2: Frontend Boundary
│   │   ├── components/            # Atomic UI Components (ui/, fragments/)
│   │   ├── features/              # Stateful Feature Modules (flat structure, e.g., holdings-list)
│   │   ├── providers/             # ReactQuery, Theme, Auth, etc.
│   │   ├── services/              # API Clients
│   │   ├── types/                 # DTOs & Interfaces
│   │   ├── data/                  # Static/Dummy data
│   │   └── utils/                 # Frontend helpers & repositories
│   └── applications/              # Pillar 3: Backend Boundary (Core)
│       ├── modules/               # Domain-driven modules (Portfolio, Market, etc)
│       │   └── [module]/v1/
│       │       ├── domain/        # Pure Entities & Interfaces
│       │       ├── usecase/       # Business logic orchestration
│       │       ├── http/          # HTTP adapters (optional)
│       │       └── delivery/      # Delivery layer (optional)
│       └── shared/                # Common Infrastructure
│           ├── persistence/       # Prisma & Shared Repositories
│           ├── scrapers/          # Scraper implementations
│           └── lib/               # Shared logic & wrappers
├── public/
├── .env.example
├── README.md
├── package.json
└── tsconfig.json

```

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
