# [0113] Lazy Load Recharts (ChartRenderer)

## Category
Performance — Bundle Size

## Severity
Critical

## Problem

Recharts is eagerly imported on all pages but only used on the dashboard and prices-history pages. This adds ~100KB to the initial bundle for every route, even those that never render a chart.

## Target Files

| File | Change |
|------|--------|
| `src/frontend/features/admin/dashboard/components/portfolio-chart.tsx` | Replace static import with `next/dynamic` |
| `src/frontend/features/public/prices-history/components/price-history-chart.tsx` | Replace static import with `next/dynamic` |

## Solution

Replace the static `import { ChartRenderer }` with a lazy-loaded dynamic import:

```tsx
import dynamic from 'next/dynamic'

const ChartRenderer = dynamic(
  () => import('@/frontend/components/ui/chart-renderer').then(mod => ({ default: mod.ChartRenderer })),
  { ssr: false, loading: () => <ChartSkeleton /> }
)
```

This defers the entire Recharts library until a chart is actually rendered.

## Verification

- [ ] `npm run build` — compare bundle sizes before/after (~100KB reduction expected)
- [ ] Dashboard renders correctly with lazy-loaded chart
- [ ] Prices history page renders correctly
- [ ] No hydration errors in browser console
- [ ] Chart skeleton displays while loading
