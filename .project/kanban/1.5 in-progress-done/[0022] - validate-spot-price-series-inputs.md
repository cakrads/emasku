# PRD: Validate Spot Price Series Inputs

## Category: Robustness
## Severity: Minor
## Target File: `src/applications/modules/prices/v1/usecases/get-spot-price-series.ts`

## Problem
Input parameters `from`, `to`, and `denominationGram` are not strictly validated before being used in calculations or queries.

## Solution
1. Validate `from` and `to` are real `Date` instances.
2. Ensure `denominationGram` is a finite positive number (> 0).
3. Throw a `ValidationError` with clear context if any check fails.
4. Assert `from < to` early.

## Verification
- Request spot price series with `to < from` or `denominationGram: -5`.
- Verify a 400 response with explaining the specific validation failure.
