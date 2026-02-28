# PRD: Guard Zero Denomination Division

## Category: Robustness
## Severity: Minor
## Target File: `src/applications/modules/portfolio/v1/usecases/get-holding-detail.ts`

## Problem
In `get-holding-detail.ts`, the per-gram normalization divides by `holding.denominationGram`. If this value is 0 or invalid, it causes a division-by-zero error.

## Solution
Guard the calculation:
1. Check if `holding.denominationGram` is > 0.
2. If invalid, skip division or return the raw price.
3. Update `currentPrice` and `currentValue` consistently.

## Verification
- Mock a holding with `denominationGram: 0`.
- Verify the system handles it gracefully without a crash.
