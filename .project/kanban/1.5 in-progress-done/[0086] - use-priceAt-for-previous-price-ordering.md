# [0086] Use priceAt for Previous Price Ordering

## Category
Data Quality

## Problem
In `src/applications/shared/persistence/repositories/prisma-price-repository.ts`,
`getPreviousPrice()` uses `recordedAt` as a secondary sort key (line ~93).

`recordedAt` is the ingestion timestamp, not the market timestamp. If prices are backfilled or
re-ingested, `recordedAt` may not reflect actual market ordering. The primary sort should use
`priceAt` only for recency.

Also, the comment on line ~141 still references `recordedAt` even though the query already
uses `priceAt` — the comment is stale.

## Fix
1. Remove `{ recordedAt: 'desc' }` from the `orderBy` in `getPreviousPrice()`.
2. Update the stale comment on line ~141.

## Files
- `src/applications/shared/persistence/repositories/prisma-price-repository.ts`
