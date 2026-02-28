# PRD: Validate Scraper Price Values

## Category: Robustness / Data Integrity
## Severity: Minor
## Target File: `src/applications/modules/prices/v1/usecases/scrape-and-persist-prices.ts`

## Problem
Truthiness checks on `raw.sellPrice` and `raw.buybackPrice` allow negative or NaN values to be persisted if they aren't caught early.

## Solution
1. Explicitly validate that price values are finite numbers and non-negative (`price >= 0`) before saving.
2. Skip invalid entries from being pushed to `pricesToSave`.

## Verification
- Mock scraper data with negative prices.
- Verify these records are ignored during the persistence phase.
