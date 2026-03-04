# Add Error States to useQuery Consumers

**Source:** CodeRabbit FE Review #3 — Issue #5
**Severity:** MEDIUM
**Type:** Enhancement (robustness)

## Problem

10 files use `useQuery` but never check `isError`, meaning users see frozen or empty UI on API failures with no feedback.

## Affected Files

- `src/frontend/features/public/prices-list/prices-list-view.tsx`
- `src/frontend/features/public/prices-history/prices-history-view.tsx`
- `src/frontend/features/public/landing/components/price-section.tsx`
- `src/frontend/features/admin/holdings-detail/holding-detail-view.tsx`
- `src/frontend/features/admin/holdings-list/holdings-list-view.tsx`
- `src/frontend/features/admin/holdings-edit/edit-holding-view.tsx`
- `src/frontend/features/admin/goals-edit/goal-edit-view.tsx`
- `src/frontend/features/admin/holdings-create/components/review-step.tsx`
- `src/frontend/features/admin/holdings-create/components/weight-selector.tsx`
- `src/frontend/features/admin/holdings-create/components/goal-selector.tsx`

## Fix Pattern

```tsx
const { data, isLoading, isError, error, refetch } = useQuery({ ... })

if (isLoading) return <Skeleton />
if (isError) return (
  <ErrorState
    message={error?.message ?? t('common.errorLoading')}
    onRetry={() => refetch()}
  />
)
```

Consider creating a shared `<ErrorState />` component if one doesn't exist, then apply consistently across all 10 files.

## Files

See affected files list above.
