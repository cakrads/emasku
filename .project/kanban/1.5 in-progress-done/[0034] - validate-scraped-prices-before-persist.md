# PRD: Validate Scraped Prices Before Persisting

## Category: Duplicate
## Severity: Minor
## Target File: `src/applications/shared/scrapers/scrape-and-persist-prices.ts`
## Lines: 36-52

## Problem
Scraped numeric prices are persisted without validation, risking corrupted data in the database.

## Solution
1. Add numeric validation (e.g., `isNaN`, range checks) before persisting.
2. Log and skip invalid entries instead of saving them.

## Verification
- Simulate scraped data with invalid values (NaN, negative, null).
- Verify invalid entries are rejected and valid ones persisted.
