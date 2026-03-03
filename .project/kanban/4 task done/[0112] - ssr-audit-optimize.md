# [0112] SSR Audit & Optimize — Remove Unnecessary SSR

## Problem

After implementing SSR on almost all pages ([0100], [0105]–[0111]), page transitions feel slow because every navigation triggers server-side API fetches before rendering. Most pages are auth-protected and don't benefit from SSR at all.

## SSR Decision Table

| Page | Route | APIs in SSR | Keep SSR? | Action | Reason |
|------|-------|-------------|-----------|--------|--------|
| **Prices List** | `/prices` | `fetchTodayPrices()` — 1 API | **Yes** | Keep as-is (ISR 60s) | Core SEO page. Users search for gold prices. Crawlers must see price data in HTML. Lightweight single API. |
| **Landing** | `/` | `fetchTodayPrices()` — 1 API | **No** | Remove SSR → client-side | Prices are a small section, not the main content. Users go to `/prices` for price data. Faster page load without SSR. |
| **Price History** | `/prices/history` | `fetchSpotPriceSeries()` — 1 API | **No** | Remove SSR → client-side | Chart data not indexable by crawlers. Users immediately change params (brand, range, denomination), making SSR data wasted. |
| **Dashboard** | `/dashboard` | `fetchPortfolioSummary()`, `fetchPortfolioList()`, `fetchGoals()`, `fetchTodayPrices()` — 4 APIs | **No** | Remove SSR → client-side + skeletons | Auth page, zero SEO. 4 parallel API calls add server delay. Users visit frequently; slow transitions hurt more than skeletons. |
| **Holdings List** | `/holdings` | `fetchPortfolioList()` ×2, `fetchPortfolioSummary()`, `fetchBrands()`, `fetchGoals()` — 5 APIs | **No** | Remove SSR → client-side + skeletons | Auth page, no SEO. Heaviest page (5 queries). Users constantly change filters, so SSR data becomes stale immediately. |
| **Holding Detail** | `/holdings/[id]` | `fetchHoldingDetail()` — 1 API | **No** | Remove SSR → client-side | Auth page, no SEO. Data often partially cached from holdings list. Client-side fetch is fast enough. |
| **Goals List** | `/goals` | `fetchGoals()` — 1 API | **No** | Remove SSR → client-side | Auth page, no SEO. Goals data is small, loads fast client-side. |
| **Goal Detail** | `/goals/[id]` | `fetchGoalDetail()` — 1 API | **No** | Remove SSR → client-side | Auth page, no SEO. Single query, fast client-side load. |

## Key Principles

1. **Only `/prices` keeps SSR** — the only page where crawlers need to see content in HTML
2. **All auth pages → client-side** — never crawled, SSR only adds latency
3. **Heavy API pages are priority** — Dashboard (4 APIs) and Holdings List (5 APIs) are the biggest bottlenecks
4. **Interactive pages waste SSR** — when users change filters/params, prefetched data is immediately discarded
5. **Fast transitions > no spinners** — skeleton loading with quick navigation feels better than waiting

## Implementation Notes per Page

For each page being reverted:
- Remove `async` from page component, remove server-side fetch/prefetch logic
- Remove `HydrationBoundary`/`dehydrate` imports and wrapping
- Remove `initialData` prop passing
- Ensure the view component's `useQuery` hooks work standalone (they already do — SSR is just hydration)
- Add proper skeleton/loading states if not already present

## Files to Modify

| File | Change |
|------|--------|
| `src/app/(public)/page.tsx` | Remove async, fetchTodayPrices, initialData prop |
| `src/app/(public)/prices/history/page.tsx` | Remove async, fetchSpotPriceSeries, initialData prop |
| `src/app/(admin)/dashboard/page.tsx` | Remove prefetchQuery, HydrationBoundary, dehydrate |
| `src/app/(admin)/holdings/page.tsx` | Remove prefetchQuery, HydrationBoundary, dehydrate |
| `src/app/(admin)/holdings/[holdingId]/page.tsx` | Remove prefetchQuery, HydrationBoundary, dehydrate |
| `src/app/(admin)/goals/page.tsx` | Remove prefetchQuery, HydrationBoundary, dehydrate |
| `src/app/(admin)/goals/[goalId]/page.tsx` | Remove prefetchQuery, HydrationBoundary, dehydrate |

## Acceptance Criteria

- [ ] All 7 pages listed above have SSR removed
- [ ] `/prices` page still uses SSR with ISR 60s
- [ ] Page transitions feel noticeably faster
- [ ] Skeleton/loading states display properly on auth pages
- [ ] No regressions in data loading or display
