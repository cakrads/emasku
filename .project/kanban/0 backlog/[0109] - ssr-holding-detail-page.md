# PRD: SSR for Holding Detail Page

## Category: Architecture
## Severity: Minor
## Priority: P3 — Authenticated page, single entity view
## Target Files:
- `src/app/(admin)/holdings/[holdingId]/page.tsx`
- `src/frontend/features/admin/holdings-detail/holding-detail-view.tsx`

## Problem
The holding detail page fetches a single holding record via client-side `useQuery`, showing a loading spinner until data arrives. The page route is already `async` (extracts `holdingId` from params) but doesn't prefetch data.

## Solution
1. Prefetch holding data server-side using the holding ID from route params.
2. Pass as `initialData` or use HydrationBoundary.
3. Auth session required for ownership validation.

## Verification
- Holding detail renders immediately when navigating from holdings list.
- No spinner on initial load.
- Mutations (sell, delete) still invalidate and refetch correctly.
