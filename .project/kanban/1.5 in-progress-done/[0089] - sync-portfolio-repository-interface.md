# [0089] Sync Portfolio Repository Interface with Implementation

## Category
Type & Interface Consistency

## Problem
`IPortfolioRepository` in `domain/repository.ts` is missing `goalId` in the `create()` and
`update()` method signatures, but the `PrismaPortfolioRepository` implementation accepts it.

This means the interface doesn't fully describe the contract, which reduces the interface's
value for type safety and testing.

## Fix
Add `goalId?: string` to the `create` data parameter and
`goalId?: string | null` to the `update` data parameter in `IPortfolioRepository`.

## Files
- `src/applications/modules/portfolio/v1/domain/repository.ts`
