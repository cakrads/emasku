# PRD: Extract Business Logic from UI Components

## Category: Architecture
## Severity: Major
## Target Files:
- `src/frontend/features/admin/holdings-list/holdings-list-view.tsx`
- `src/frontend/features/admin/goals-detail/goal-detail-view.tsx`

## Problem
Complex calculations, sorting, and transformations live inside view components:
- Sorting logic embedded in `holdings-list-view.tsx` (date parsing, multi-key sort).
- Subtotal calculations (`reduce`) in `goal-detail-view.tsx`.

This means:
- Business logic cannot be unit-tested independently.
- Logic is duplicated across components.
- UI components are harder to reason about.

## Evidence
```tsx
// holdings-list-view.tsx
let sortedHoldings = [...allHoldings].sort((a, b) => {
  if (sortBy === 'date') {
    const dateA = new Date(a.buyDate ?? 0).getTime()
    const dateB = new Date(b.buyDate ?? 0).getTime()
    output = dateB - dateA
  }
  return sortDirection === 'desc' ? -output : output
})

// goal-detail-view.tsx
const holdingsSubtotal = data.holdings.reduce(
  (sum, h) => sum + (h.currentValue ?? 0), 0
)
```

## Solution
1. Extract sorting into a custom hook: `usePortfolioSort(holdings, sortBy, direction)` backed by a pure `sortHoldings()` function.
2. Extract calculations to a view-model / domain utility: `calculateGoalSubtotal(holdings)`.
3. Unit-test the pure functions directly.

### Example
```tsx
// hooks/usePortfolioSort.ts
export function usePortfolioSort(holdings, sortBy, direction) {
  return useMemo(() => sortHoldings(holdings, sortBy, direction), [holdings, sortBy, direction])
}

// utils/goal-calculations.ts
export function calculateGoalSubtotal(holdings: Holding[]): number {
  return holdings.reduce((sum, h) => sum + (h.currentValue ?? 0), 0)
}
```

## Verification
- Pure utility functions have unit tests with edge cases (empty arrays, null values).
- View components no longer contain inline `.sort()`, `.reduce()`, or date-parsing logic.
- UI behavior is unchanged.
