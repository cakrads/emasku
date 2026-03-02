# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Before starting any task**, read `.spec/spec.md` (functional goals) and `.spec/tech-spec.md` (technical constraints). If a task changes the domain model or core logic, update the relevant spec **first**.

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint

# Database (Prisma 7)
npm run db:studio        # Open Prisma Studio
npm run db:push          # Push schema changes
npm run db:generate      # Regenerate Prisma client
npm run db:seed          # Seed the database

# Scraper
npm run scraper:run      # Run the gold price scraper

# Prod variants (use .env.prod)
npm run dev:prod
npm run build:prod
npm run db:studio:prod
npm run db:seed:prod
npm run scraper:run:prod
```

### Testing

> No test runner is currently configured. When adding tests in the future, use **Vitest** and co-locate test files as `*.test.ts` next to the source.
>
> Priority test targets: domain entities, use cases, and shared contract validators.

## Architecture

The project is a **Next.js 16+ monolith** with three strict, isolated pillars:

```
src/app/           → Pillar 1: Routing ONLY (Next.js App Router, <10 LOC per file)
src/frontend/      → Pillar 2: Frontend (React components, hooks, API services)
src/applications/  → Pillar 3: Backend Core (domain, use cases, HTTP adapters)
src/shared/        → Cross-cutting contracts (DTOs shared between frontend/backend)
src/middleware.ts  → Route protection & localization
```

### Non-Negotiable Rules

- `frontend/` MUST NOT import from `applications/`, and vice versa.
- `app/` files are routing controllers only — minimal logic, no business rules.
- `domain/` layers contain **no** framework, HTTP, or database code.
- `services/` inside `frontend/` are the **only** place the frontend calls APIs.
- All domain math MUST use `decimal.js` (no native JS `number` for financial calculations).
- Database prices use `BigInt`; weights use `Decimal`.
- All files must use **kebab-case** naming (e.g., `add-holding.ts`).
- All imports use the `@/` alias (`@/*` → `src/*`). Never use relative `../../` across pillars.

### Anti-Patterns (DO NOT)

- ❌ Import from `applications/` in `frontend/` or vice versa
- ❌ Use native `number` for financial math — always `decimal.js`
- ❌ Use raw HTML tags (`div`, `p`, `h1-h6`) outside `components/ui/`
- ❌ Call APIs directly from components — use the `services/` layer
- ❌ Put business logic in `app/` route files
- ❌ Duplicate types between pillars — add shared types to `src/shared/contracts/`
- ❌ Cache API data in Zustand — use TanStack Query's cache
- ❌ Use `className="w-full"` on buttons — use the `fullWidth` prop

## Module Structures

### Backend (`src/applications/modules/<feature>/v1/`)

```
domain/          → Pure business rules, entities, interfaces
usecases/        → Business action orchestration
delivery/http/   → HTTP adapters (controller, request parsing)
```

Shared persistence: `src/applications/shared/persistence/repositories/` (one Prisma repository per domain).

### Frontend (`src/frontend/`)

```
components/ui/        → Stateless primitives (no raw HTML outside here)
components/fragments/ → Reusable UI organisms (admin/ and public/ groups)
components/layout/    → Page layouts (StandardPageLayout, SharedNavbar)
features/admin/       → Authenticated feature modules
features/public/      → Public feature modules
services/             → API clients (the ONLY place to call APIs)
hooks/                → Custom React hooks
view-model/           → Presentation logic (formatting, derived display data)
utils/                → Frontend utilities (api-client, formatting, aggregations)
context/              → React contexts (e.g., language)
providers/            → App-wide providers (auth, react-query, theme)
config/               → Frontend config (routes)
data/                 → Static/reference data
```

Features follow `[group]/[entity]-[action]` naming: `admin/holdings-list`, `public/prices-history`.

### Shared Contracts (`src/shared/contracts/`)

The **neutral boundary** between frontend and backend. Both pillars import types from `src/shared/` — neither pillar ever imports from the other.

- `frontend/services/` imports contracts from here to type API requests/responses.
- `applications/delivery/` imports contracts from here to type controller I/O.
- Naming: `<entity>.<action>.contract.ts` (e.g., `portfolio.contract.ts`, `sell-holding.contract.ts`).
- Must be pure TypeScript types/interfaces — no runtime code, no imports from either pillar.
- Add new contracts here rather than duplicating types across pillars.

## Key Patterns

### Data Flow

**Client-side (default):**
`app/page.tsx` → renders frontend View → TanStack Query hook → `frontend/services/*.api.ts` → `/api/v1/...` → backend controller → use case → Prisma repository

**SSR (when SEO or instant render is needed):**
`app/page.tsx` fetches data server-side → passes to frontend View as `initialData` for TanStack Query → hook hydrates from `initialData`, then revalidates client-side as normal

### Financial Precision

- `GoldDailyClose` table is the authoritative source for periodic PnL (today/weekly/monthly).
- Current valuation uses the latest `GoldPrice` (BUYBACK type).
- Price records are **immutable** — never update or delete them.
- Frontend **never** computes money or financial rules; it only displays formatted values from the API.

### Error Handling

Backend uses a centralized error hierarchy in `src/applications/shared/lib/errors.ts`:

| Error Class | HTTP Code | Use When |
|---|---|---|
| `ValidationError` | 400 | Client sent invalid data |
| `UnauthorizedError` | 401 | Authentication required |
| `ForbiddenError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate entry or conflict |
| `UnprocessableError` | 422 | Semantic validation failure |
| `InternalError` | 500 | Unexpected server error |

- Use cases throw these domain-specific errors.
- Controllers wrap handlers with `wrapController()` from `controller-wrapper.ts` — this catches errors, logs them, generates trace IDs, and maps to standardized HTTP responses.
- Frontend surfaces errors via TanStack Query's `error` state.
- **Never swallow errors silently** — always log or throw.

### State Management

- **Server state** (API data): TanStack Query — always.
- **Client UI state** (modals, filters, local preferences): Zustand or React `useState`.
- Never cache API data in Zustand — TanStack Query owns the server cache.

### Prisma 7 Config

Connection URL is in `prisma.config.ts` (not `schema.prisma`). Client is instantiated with `PrismaPg` pool adapter. See `src/applications/shared/persistence/` for the client singleton.

## UI Component Rules

- **No raw HTML tags** (`div`, `p`, `h1-h6`) outside `components/ui`. Use `<Stack />`, `<Section />`, `<Container />`, `<Typography />`.
- **Button colors**: `color="primary"` (gold/add actions), `color="warning"` (sell/mark actions), `color="error"` (delete actions). Use `fullWidth` prop instead of `className="w-full"`.
- **Typography**: All text via `<Typography variant="..." />`.
- **Layout**: `<StandardPageLayout />` wraps every feature page.
- **Imports**: Always use absolute aliases: `@/frontend/features/...`

## Git Conventions

- **Branches**: `feat/<feature-name>`, `fix/<bug-name>`, `refactor/<area>`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
- **PRs**: One feature per PR, always against `main`

## Environment & Prisma 7

Copy `.env.example` to `.env`. For production workflows use `.env.prod` with `env-cmd` scripts. The `postinstall` hook runs `prisma generate` automatically after `npm install`.

## Documentation

- [Functional Spec](.spec/spec.md)
- [Technical Spec](.spec/tech-spec.md)
- [Frontend Guidelines](.docs/.frontend/frontend-guidelines.md)
- [UI Structure Manifest](.docs/.frontend/ui-structure-manifest.md)
- [API Contract](.docs/.backend/api-contract.md)
- [Database Setup](.docs/.backend/database-setup.md)
