# PRD: Fix Buyback Delta Calculation

## Category: Data Integrity
## Severity: Minor
## Target File: `src/applications/shared/persistence/repositories/prisma-price-repository.ts`

## Problem
The current delta logic uses the first seen price (e.g., `group.sellPrice`) as the baseline instead of the immediate previous record in the series.

## Solution
1. Track the immediate previous price (e.g., `sellPreviousPrice`) on every iteration.
2. When encountering a new price record, if it differs from the previous one, calculate the delta as `(previousPrice - currentPrice)`.
3. Ensure deltas are only set once for each group.

## Verification
- Feed a sequence of 3 different prices for the same brand/denom.
- Verify the delta correctly represents the change between the most recent and the second most recent price.
