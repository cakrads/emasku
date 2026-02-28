# [0087] Fix Delta Computation to Use Immediate Previous

## Category
Data Quality

## Problem
In `prisma-price-repository.ts` (prices module), `getTodayPrices()` computes price deltas by
finding the "first DIFFERENT price" in the iteration. This means it skips identical prices and
compares against the first price that differs, which may not be the immediate-previous record.

The correct behavior is to compute delta as `(latestPrice - immediatePreviousPrice)`, where
"immediate previous" is the most recent price that was recorded before the latest one.

## Fix
Track the immediate previous price for each type (sell/buyback) during iteration, regardless
of whether it matches the current value. Compute delta from the immediate-previous value.

## Files
- `src/applications/modules/prices/v1/repository/prisma-price-repository.ts` (`getTodayPrices`)
