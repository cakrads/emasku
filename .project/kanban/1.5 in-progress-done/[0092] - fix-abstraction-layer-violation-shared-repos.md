# [0092] Fix Abstraction Layer Violation in Shared Repositories

## Category
Architecture — 🔴 Critical

## Problem
Shared persistence repositories import domain types directly from module-specific domains:

```ts
// prisma-portfolio-repository.ts
import { PortfolioHoldingDomain } from '@/applications/modules/portfolio/v1/domain/portfolio.domain'
import { SellHoldingData, SellHoldingResult, BulkSellResult } from '@/applications/modules/portfolio/v1/domain/repository'

// prisma-goal-repository.ts
import { GoalDomain } from '@/applications/modules/goals/v1/domain/goal.domain'
import { CreateGoalData, UpdateGoalData } from '@/applications/modules/goals/v1/domain/goal.repository'
```

This violates clean architecture: shared infrastructure depends on module-specific business domains.

## Impact
- Repositories non-reusable across modules
- Circular dependency risk
- Module versions (v1, v2) baked into shared infrastructure
- Cannot swap/mock without module-specific types

## Fix
1. Move domain interfaces to `src/applications/shared/domain/` as shared contracts
2. Have module-specific domains implement/extend these shared contracts
3. Repositories depend only on shared contracts

## Files
- `src/applications/shared/persistence/repositories/prisma-portfolio-repository.ts`
- `src/applications/shared/persistence/repositories/prisma-goal-repository.ts`
- `src/applications/shared/domain/` (new)
