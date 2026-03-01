# PRD: SSR for Goals List Page

## Category: Architecture
## Severity: Minor
## Priority: P3 — Authenticated page, list view
## Target Files:
- `src/app/(admin)/goals/page.tsx`
- `src/frontend/features/admin/goals-list/goals-list-view.tsx`

## Problem
The goals list page fetches all goals via client-side `useQuery`, showing a loading spinner on every navigation. The page also contains mutation logic (complete goal, delete goal).

## Solution
1. Prefetch goals list server-side in `page.tsx`.
2. Pass via `initialData` or HydrationBoundary.
3. Auth session required.
4. Mutations remain client-side (no change needed).

## Verification
- Goals list renders immediately on navigation.
- Complete/delete goal actions still work and trigger refetch.
