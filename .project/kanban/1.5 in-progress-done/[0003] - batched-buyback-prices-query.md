# PRD: Batched Buyback Prices Query

## Category: Performance
## Severity: Major
## Target File: `src/applications/shared/persistence/repositories/prisma-price-repository.ts`

## Problem
The `getLatestBuybackPrices` method currently performs multiple individual database queries (one per brand/denomination pair) to fetch the latest prices. As the number of holdings or goals increases, this N+1 pattern will lead to significant latency and database load.

## Solution
Refactor `getLatestBuybackPrices` to use a single batched database query:
1. Use Prisma's `findMany` with an `OR` condition or a specialized raw query to fetch all required prices in one trip.
2. Group the results in-memory to satisfy the requested keys.

## Verification
- Measure the number of database queries triggered by the goal list or portfolio summary before and after the change.
- Verify that prices returned are identical to the single-query approach.
