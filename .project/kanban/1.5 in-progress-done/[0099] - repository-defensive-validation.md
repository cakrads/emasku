# [0099] Repository Layer Lacks Defensive Validation

## Category
Hardening — 🟡 Minor

## Problem
Repository `create`/`update` methods accept data and write to DB without any
validation. If a use case forgets validation or has a bug, invalid data reaches
the database.

## Current Mitigation
All use cases validate before calling repositories.

## Fix (Belt-and-Suspenders)
Add defensive assertions in repository methods:
- `userId` must be non-empty
- `quantity` must be positive
- `denominationGram` must be positive
- `buyPrice` must be non-negative

## Files
- `src/applications/shared/persistence/repositories/prisma-portfolio-repository.ts`
- `src/applications/shared/persistence/repositories/prisma-goal-repository.ts`
