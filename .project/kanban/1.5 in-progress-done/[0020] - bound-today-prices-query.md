# PRD: Bound Today Prices Query

## Category: Performance
## Severity: Major
## Target File: `src/applications/shared/persistence/repositories/prisma-price-repository.ts`

## Problem
In `getTodayPrices`, the `findMany` query doesn't have a date boundary, which causes it to read more rows than necessary as the table grows.

## Solution
Restrict the read by adding a `recordedAt >= startOfToday` filter. 
1. Compute `startOfToday` once at the beginning of the function.
2. Ensure the query only returns rows from the current day.
3. Keep existing filters for `brandCode`, `denominationGram`, and `priceType`.

## Verification
- Check the query plan or row count for `getTodayPrices`.
- Verify it only returns data for the current calendar day.
