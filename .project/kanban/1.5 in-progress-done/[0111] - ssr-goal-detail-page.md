# PRD: SSR for Goal Detail Page

## Category: Architecture
## Severity: Minor
## Priority: P3 — Authenticated page, single entity view
## Target Files:
- `src/app/(admin)/goals/[goalId]/page.tsx`
- `src/frontend/features/admin/goals-detail/goal-detail-view.tsx`

## Problem
The goal detail page (608 lines) fetches a goal with its holdings via client-side `useQuery`. It shows a loading spinner until the data arrives. The route is already `async` (extracts `goalId` from params) but doesn't prefetch.

## Solution
1. Prefetch goal detail data server-side using the goal ID from route params via HTTP.
2. Pass as `initialData` or use HydrationBoundary.
3. Auth session required for ownership validation via HTTP.
4. Mutations (add/remove holding, edit goal) remain client-side.

## Strict Rules
- **Strict Layer Separation**: Frontend code MUST NOT import from the `application` folder (e.g., UseCases). The frontend must only communicate with the backend via HTTP calls using absolute URLs for server-side fetching.

## Verification
- Goal detail page renders immediately when navigating from goals list.
- No spinner on initial load.
- All interactive features (modals, mutations) still function.
