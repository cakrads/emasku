# PRD: Guard Zero Denomination Division

## Category: Robustness
## Severity: Major
## Target File: `src/applications/modules/portfolio/v1/usecases/get-holding-detail.ts`

## Problem
The usecase divides the current price by `holding.denominationGram` to normalize it to "per gram". If a holding is incorrectly saved with `denominationGram = 0`, this will cause a division-by-zero error, crashing the request.

## Solution
Add a guard clause:
1. Check if `holding.denominationGram` is zero or null.
2. If zero, return 0 for `currentPrice` or throw a clear `BaseError`.

## Verification
- Manually update a holding in the database to have `denominationGram = 0`.
- Fetch the detail for that holding.
- Verify the API returns a graceful response instead of crashing.
