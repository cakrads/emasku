# PRD: Sync Portfolio Repository Interface

## Category: Maintenance
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/domain/repository.ts`

## Problem
The `IPortfolioRepository.findAllByUserId` signature is out of sync with its actual implementation in `PrismaPortfolioRepository`.

## Solution
Update the interface to match the implementation:
1. Accept extended filter shape (`brandCodes?`, `dateFrom?`, `dateTo?`, `goalId?`).
2. Add optional `pagination` parameter.
3. Change return type to `Promise<{ items: PortfolioHoldingDomain[]; total: number }>`.

## Verification
- Verify that `IPortfolioRepository` correctly describes the methods used in usecases and implemented in the repository.
- Ensure no TypeScript errors remain in the domain layer.
