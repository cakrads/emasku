# PRD: Atomic Bulk Sell Operations

## Category: Data Integrity
## Severity: Critical
## Target File: `src/applications/shared/persistence/repositories/prisma-portfolio-repository.ts`

## Problem
The `bulkSellHoldings` implementation uses a per-item `try/catch` block within a single outer database transaction. If a holding update fails for any reason (e.g., race condition), the `SELL` transaction record for that item might still be created or the state might become inconsistent because the inner catch prevents the whole transaction from rolling back, or it might commit "orphan" records depending on how the error is handled.

## Solution
Each sell operation (holding update + transaction creation) for an individual item in a bulk request should be atomic and isolated:
1. Ensure each item's logic is wrapped in its own sub-transaction OR refactor the bulk operation to be truly atomic across all items if preferred (rollback all if one fails).
2. Given the current design, isolating each item into its own transaction ensures that failures for one holding don't affect others, while maintaining consistency for each individual holding.

## Verification
- Invoke `bulkSellHoldings` with multiple IDs.
- Simulate a failure for one ID (e.g., already sold).
- Verify that for the failed ID, NO `SELL` transaction is created and the state is unchanged.
- Verify that other successfull items are correctly updated.
