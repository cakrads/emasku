# PRD: SSR for Price History Page

## Category: Architecture
## Severity: Major
## Priority: P2 — Public SEO page, historical chart data
## Target Files:
- `src/app/(public)/prices/history/page.tsx`
- `src/frontend/features/public/prices-history/prices-history-view.tsx`

## Problem
The `/prices/history` page fetches spot price series data entirely client-side via `useQuery`. As a public page:
- No SEO value (crawlers see empty chart placeholder)
- Loading spinner on every navigation
- No server-side caching of historical price data

## Current Pattern
```tsx
// prices-history-view.tsx
'use client'
const { data: allData, isLoading, error } = useQuery({
  queryKey: ['prices', 'spot', brand, range, denomination],
  queryFn: () => fetchSpotPriceSeries({ brand, range, denomination }),
})
```

## Solution
1. Fetch default chart data (e.g. 30-day, first brand) server-side in `page.tsx` via HTTP (`fetchSpotPriceSeries` using absolute URL `getBaseUrl()`).
2. Pass `initialData` to `PricesHistoryView`.
3. Add `export const revalidate = 900` (15 min ISR for historical data).
4. Client-side `useQuery` handles parameter changes (brand/range switching).

## Strict Rules
- **Strict Layer Separation**: Frontend code MUST NOT import from the `application` folder (e.g., UseCases). The frontend must communicate with the backend via HTTP calls using absolute URLs for server-side fetching.

## Verification
- View page source at `/prices/history` — default chart data present in HTML.
- Switching brand/range triggers client-side refetch (expected behavior).
- Initial load has no spinner for default view.
