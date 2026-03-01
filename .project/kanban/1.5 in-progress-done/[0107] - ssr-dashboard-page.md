# PRD: SSR for Dashboard Page

## Category: Architecture
## Severity: Major
## Priority: P2 — Primary authenticated page, first page after login
## Target Files:
- `src/app/(admin)/dashboard/page.tsx`
- `src/frontend/features/admin/dashboard/dashboard-view.tsx`
- `src/frontend/features/admin/dashboard/components/prices-today-cards.tsx`
- `src/frontend/features/admin/dashboard/components/holdings-preview.tsx`
- `src/frontend/features/admin/dashboard/components/goals-section.tsx`

## Problem
The dashboard has 4 independent `useQuery` calls across the main view and 3 sub-components:
- `dashboard-view.tsx` — portfolio summary
- `prices-today-cards.tsx` — today's prices
- `holdings-preview.tsx` — holdings preview
- `goals-section.tsx` — goals list

Every widget shows its own loading spinner independently. The user sees a "popcorn" loading effect after login.

## Solution
Since there are multiple independent queries, use the **HydrationBoundary pattern** (preferred over `initialData` for multi-query pages):
1. In `page.tsx`: create server-side `QueryClient`, prefetch all 4 queries via HTTP, dehydrate.
2. Wrap `DashboardView` in `<HydrationBoundary state={dehydratedState}>`.
3. Sub-components keep their existing `useQuery` calls unchanged — they will pick up the prefetched data automatically.
4. Auth session must be resolved server-side to fetch user-specific data via HTTP.

## Strict Rules
- **Strict Layer Separation**: Frontend code MUST NOT import from the `application` folder (e.g., UseCases). The frontend must only communicate with the backend via HTTP calls using absolute URLs for server-side fetching.

## Verification
- Dashboard renders with all data visible immediately (no popcorn spinners).
- Server HTML contains portfolio summary and price data.
- Client-side revalidation still works after `staleTime` expires.
