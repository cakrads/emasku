# Copilot Instructions for AI Coding Agents

## Project Architecture
- **Module-Based Clean Architecture**: The codebase is split into three strict pillars:
  1. **Routing (Next.js)**: `src/app/` for routing/controllers only (minimal logic, <10 LOC per file).
  2. **Frontend (React)**: `src/frontend/` for all UI, state, and API client logic. Only call APIs via `src/frontend/services/`.
  3. **Backend Core (Application Modules)**: `src/applications/` for business logic, persistence, and scrapers. Each feature in `modules/` follows Clean Architecture: `domain/` (pure logic), `http/` (adapters), `persistence/` (repositories).
- **Strict Boundaries**: No framework, HTTP, or DB code in `domain/`. Only `services/` in frontend may call APIs.
- **Financial Precision**: All domain math must use `decimal.js`.

## Developer Workflows
- **Start Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Prisma DB**: Use `npm run db:studio`, `db:push`, `db:pull`, `db:generate`, `db:seed` for database workflows. Seed script: `prisma/seed.ts`.
- **Run Scraper**: `npm run scraper:run` (executes `src/applications/shared/scrapers/run-scraper.ts`).

## Project-Specific Conventions
- **API Versioning**: All backend APIs are versioned under `src/app/api/v1/`.
- **React Query**: Use `@tanstack/react-query` for data fetching in frontend. Providers in `src/frontend/providers/`.
- **Component Structure**: UI components in `src/frontend/components/`, feature logic in `src/frontend/features/`.
- **Config**: Route config in `src/frontend/config/routes.ts`.
- **Data**: Dummy/test data in `src/frontend/data/`.
- **Logger/Errors**: Use `src/applications/shared/lib/logger.ts` and `errors.ts` for backend logging and error handling.
- **Environment**: Use `.env` for secrets/config. See `.env.example` for required variables.

## Integration & Patterns
- **Prisma**: DB schema in `prisma/schema.prisma`. All persistence via repositories in `src/applications/shared/persistence/repositories/`.
- **Scrapers**: Implemented in `src/applications/shared/scrapers/`.
- **TypeScript**: Strict typing enforced throughout. Types in `src/frontend/types/`.
- **Tailwind CSS**: Used for styling. See `postcss.config.mjs` and `tailwind.config.js`.

## Examples
- To add a new API: create a controller in `src/app/api/v1/{feature}/`, then implement logic in the corresponding backend module.
- To add a new frontend feature: add UI in `src/frontend/features/{feature}/`, fetch data via `services/`, and use React Query.

---
For more details, see [README.md](../README.md) and follow the architecture rules strictly. Ask for clarification if a pattern or workflow is unclear.
