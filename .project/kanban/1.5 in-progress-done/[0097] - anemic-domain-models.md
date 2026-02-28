# [0097] Anemic Domain Models

## Category
Architecture — 🟠 Major

## Problem
Domain models (`GoalDomain`, `PortfolioHoldingDomain`) are pure data interfaces
with zero validation or business logic. Invariants (e.g., completed goals must
have `completedAt`, `targetAmount` must be positive, valid lifecycle transitions)
are scattered across use cases.

## Fix
Convert critical domain models to classes with:
- Constructor validation of invariants
- Lifecycle transition methods (e.g., `markCompleted()`)
- Factory methods for creation from DB records

## Note
Only worthwhile if business logic complexity grows. For simple CRUD, current
approach is acceptable.

## Files
- `src/applications/shared/domain/goal.contract.ts`
- `src/applications/shared/domain/portfolio.contract.ts`
- `src/applications/modules/goals/v1/domain/goal.domain.ts`
- `src/applications/modules/portfolio/v1/domain/portfolio.domain.ts`
