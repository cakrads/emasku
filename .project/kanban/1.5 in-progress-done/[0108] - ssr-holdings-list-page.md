# PRD: SSR for Holdings List Page

## Category: Architecture
## Severity: Minor
## Priority: P3 — Authenticated page, 5 parallel queries
## Target Files:
- `src/app/(admin)/holdings/page.tsx`
- `src/frontend/features/admin/holdings-list/holdings-list-view.tsx`

## Problem
The holdings list page runs 5 parallel `useQuery` calls:
- Filtered holdings (paginated)
- All holdings (for summary calculation)
- Portfolio summary
- Brands list (for filter dropdown)
- Goals list (for filter dropdown)

All fetched client-side, resulting in multiple loading states and skeleton placeholders.

## Solution
Use HydrationBoundary pattern to prefetch default-filter holdings and summary data server-side via HTTP. Reference data (brands, goals) can also be prefetched.

Auth session resolution required server-side for user-scoped queries.

## Strict Rules
- **Strict Layer Separation**: Frontend code MUST NOT import from the `application` folder (e.g., UseCases). The frontend must only communicate with the backend via HTTP calls using absolute URLs for server-side fetching.

## Verification
- Holdings list renders with data on initial load.
- Filter/sort changes trigger expected client-side refetches.
- Pagination still works client-side.
