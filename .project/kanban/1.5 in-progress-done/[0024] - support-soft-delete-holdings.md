# PRD: Support Soft-Delete for Holdings

## Category: Minor
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/usecases/delete-holding.usecase.ts`

## Problem
The `execute` method in `DeleteHoldingUsecase` accepts a `hard` flag but currently ignores it and always performs a permanent delete.

## Solution
Implement conditional deletion logic:
1. If `hard` is `true`, perform a permanent database delete.
2. If `hard` is `false`, perform a soft-delete (e.g., mark as `ARCHIVED` or `DELETED`).
3. Update repository methods to support this differentiation if necessary.

## Verification
- Call `deleteHolding` with `hard: false`.
- Verify the record still exists in the database but is no longer "active".
- Call with `hard: true` and verify permanent removal.
