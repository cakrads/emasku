# PRD: Order Prices by Market Time

## Category: Data Accuracy
## Severity: Major
## Target File: `src/applications/shared/persistence/repositories/prisma-price-repository.ts`

## Problem
Price queries currently order results by `recordedAt` (the time the data was saved to the database). If data is ingested out of order from scrapers or migrations, the "latest" price might actually be an older quote.

## Solution
Update the `orderBy` clause in `getLatestBuybackPrice` and other price-related queries to use `priceAt` (the market timestamp) instead of `recordedAt`.

## Verification
- Manually insert a price record with a newer `recordedAt` but an older `priceAt`.
- Verify that the query correctly returns the record with the most recent `priceAt`.
