# PRD: SSR for Landing Page Price Section

## Category: Architecture
## Severity: Critical
## Priority: P1 — Public SEO page, first impression
## Target Files:
- `src/app/(public)/page.tsx`
- `src/frontend/features/public/landing/landing-view.tsx`
- `src/frontend/features/public/landing/components/price-section.tsx`

## Problem
The landing page (`/`) includes a `PriceSection` component that fetches gold prices via client-side `useQuery`. This means:
- Crawlers see no price content on the homepage
- Loading spinner shown instead of instant price data
- Homepage SEO is degraded (price data is a key value proposition)

## Current Pattern
```tsx
// price-section.tsx
'use client'
const { data, isLoading, error } = useQuery({
  queryKey: ['prices', 'today'],
  queryFn: fetchTodayPrices,
})
```

## Solution
1. Fetch today's prices server-side in `page.tsx` using direct use-case call.
2. Pass `initialData` to `LandingView` → `PriceSection`.
3. Add `export const revalidate = 60` (ISR aligned with React Query `staleTime`).
4. `PriceSection` keeps `useQuery` with `initialData` for client-side revalidation.

## Verification
- View page source at `/` — price data visible in HTML.
- No loading spinner on price section during initial load.
- No duplicate API call on first render.
