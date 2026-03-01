# PRD: Decompose Large View Components

## Category: Architecture
## Severity: Major
## Target Files:
- `src/frontend/features/admin/goals-detail/goal-detail-view.tsx` (608 lines)
- `src/frontend/features/admin/goals-list/goals-list-view.tsx` (454 lines)
- `src/frontend/features/admin/holdings-detail/holding-detail-view.tsx` (448 lines)
- `src/frontend/features/admin/holdings-list/holdings-list-view.tsx` (373 lines)
- `src/frontend/features/admin/holdings-create/add-holding-view.tsx` (341 lines)

## Problem
Several view components exceed 300–600 lines, mixing multiple concerns:
- Data fetching logic
- Multiple `useState` hooks (10+)
- Business calculations (`reduce`, subtotals)
- Modal state management
- Form handling
- Complex conditional rendering
- Multiple nested inline components

This makes components hard to test, reason about, and reuse.

## Solution
Break each large view into:
1. **Container component** (< 150 lines): data fetching, state coordination.
2. **Presentation components**: pure, reusable UI pieces (`GoalHeader`, `GoalProgress`, etc.).
3. **Custom hooks**: business logic (`useGoalCalculations`), sorting, filtering.
4. **Sub-features**: modals and forms as separate files.

### Example
```tsx
// goal-detail-view.tsx (< 150 lines)
export function GoalDetailView({ goalId }: Props) {
  const goal = useGoalDetail(goalId)
  const calculations = useGoalCalculations(goal)

  return (
    <GoalDetailLayout>
      <GoalHeader goal={goal} />
      <GoalProgress calculations={calculations} />
      <GoalHoldingsList holdings={goal.holdings} />
      <GoalActions goalId={goalId} />
    </GoalDetailLayout>
  )
}
```

## Verification
- Each resulting file is under 200 lines.
- No behavioral regressions (UI looks and works the same).
- Business logic hooks are unit-testable independently.
