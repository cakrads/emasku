# [0114] Memoize Expensive Render Calculations

## Category
Performance — Runtime

## Severity
Major

## Problem

Several components run `reduce`, `filter`, `map`, and transform functions on every render even when the underlying data hasn't changed. This causes ~30% unnecessary computation overhead. The `useMemo` pattern is already used elsewhere in the codebase.

## Target Files

| File | Calculations to Memoize |
|------|------------------------|
| `src/frontend/features/admin/dashboard/components/goals-section.tsx` | `totalGoalsValue` (reduce), `activeGoalsCount` (filter) |
| `src/frontend/features/admin/holdings-list/holdings-list-view.tsx` | `viewModels` (map + transformHoldingItem), `summaryViewModel` (transformPortfolioSummary), `isFiltered` (comparison check), `activeFilterCount` (array + filter) |

## Solution

Wrap each calculation with `useMemo`, using the source data as the dependency:

```tsx
const totalGoalsValue = useMemo(
  () => goals.reduce((sum, g) => sum + g.value, 0),
  [goals]
)
```

Apply the same pattern to all listed calculations, using appropriate dependency arrays.

## Verification

- [ ] `npm run build` — no build errors
- [ ] Holdings list filtering still works correctly
- [ ] Goals section displays correct totals
- [ ] No behavioral regressions in dashboard or holdings views
