# [0091] Guard Division by denominationGram

## Category
Data Integrity

## Problem
In `get-holding-detail.ts`, a division by `holding.denominationGram` is already guarded
with a `> 0` check (line ~62–64), but similar divisions elsewhere may not be guarded.

The `get-portfolio-summary.ts` usecase also performs per-gram calculations. Any division
by `denominationGram` or similar values should be defensively guarded against zero/negative.

## Fix
Audit all division operations involving `denominationGram` and add `> 0` guards where missing.
Return `null` or a safe default when the denominator is invalid.

## Files
- `src/applications/modules/portfolio/v1/usecases/get-portfolio-summary.ts`
- `src/applications/modules/portfolio/v1/usecases/get-holding-detail.ts` (already done, verify)
