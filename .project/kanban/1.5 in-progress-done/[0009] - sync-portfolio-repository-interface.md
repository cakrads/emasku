# PRD: Sync Portfolio Repository Interface

## Category: Maintenance
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/domain/repository.ts`

## Problem
The `IPortfolioRepository` interface has drifted from its actual implementation. The `findAllByUserId` signature in the interface only expects a user ID, while the implementation supports filters (brandCodes, dates, goalId) and returns pagination metadata.

## Solution
Update the `IPortfolioRepository` interface to match the `PrismaPortfolioRepository` implementation:
1. Update `findAllByUserId` signature to include filter and pagination parameters.
2. Update return type to include `total` count for pagination.

## Verification
- Ensure that TypeScript compiler (`tsc`) passes without errors.
- Verify that other usecases using the interface (if any) are updated accordingly.
